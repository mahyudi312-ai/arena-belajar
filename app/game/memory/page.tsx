"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

type Card = {
  id: number;
  emoji: string;
  pairId: number;
  matched: boolean;
};

const CARD_EMOJIS = ["🐱", "🐶", "🐰", "🐼", "🦊", "🐸", "🐵", "🐧"];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createDeck(): Card[] {
  const pairs = CARD_EMOJIS.map((emoji, i) => [
    { id: i * 2, emoji, pairId: i, matched: false },
    { id: i * 2 + 1, emoji, pairId: i, matched: false },
  ]).flat();
  return shuffle(pairs);
}

export default function MemoryPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [finished, setFinished] = useState(false);
  const [canFlip, setCanFlip] = useState(true);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);

  const totalPairs = CARD_EMOJIS.length;

  const startGame = () => {
    setCards(createDeck());
    setFlipped([]);
    setMatchedPairs(0);
    setMoves(0);
    setFinished(false);
    setCanFlip(true);
    setTime(0);
    setRunning(true);
  };

  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setTime((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  const handleFlip = (id: number) => {
    if (!canFlip) return;
    if (flipped.includes(id)) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.matched) return;
    if (flipped.length === 2) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      setCanFlip(false);
      const [a, b] = newFlipped.map((i) => cards.find((c) => c.id === i)!);

      if (a.pairId === b.pairId) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.pairId === a.pairId ? { ...c, matched: true } : c
            )
          );
          setMatchedPairs((p) => p + 1);
          setFlipped([]);
          setCanFlip(true);
          confetti({
            particleCount: 30,
            spread: 50,
            origin: { y: 0.6 },
          });
        }, 500);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setCanFlip(true);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (matchedPairs === totalPairs && totalPairs > 0) {
      setRunning(false);
      setFinished(true);
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 },
      });
    }
  }, [matchedPairs, totalPairs]);

  const exp = Math.max(50, 150 - moves * 2 - time);
  const isWin = finished;

  if (isWin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-arena-pattern">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card-arena max-w-md w-full text-center"
        >
          <div className="text-7xl mb-4">🏆</div>
          <h1 className="text-3xl font-bold font-playful text-arena-red mb-3">
            Hebat!
          </h1>
          <p className="text-xl mb-2 font-fun">
            Selesai dalam <strong>{moves}</strong> langkah
          </p>
          <p className="text-lg text-gray-600 mb-2">⏱️ Waktu: {time} detik</p>
          <p className="text-2xl font-bold text-arena-gold mb-6">+{exp} EXP</p>

          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={startGame} className="btn-blue">
              Main Lagi 🔄
            </button>
            <Link href="/game">
              <button className="btn-red">Game Lain</button>
            </Link>
            <Link href="/dashboard">
              <button className="btn-purple">Dashboard</button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-arena-pattern">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Link href="/game" className="text-arena-blue font-bold">
            ← Game Lain
          </Link>
          <div className="flex gap-4 font-bold font-playful">
            <span>⏱️ {time}s</span>
            <span>👆 {moves}</span>
          </div>
        </div>

        <div className="text-center mb-4">
          <div className="text-5xl mb-2">🧠</div>
          <h1 className="text-3xl font-bold font-playful text-arena-purple mb-1">
            Memory Match
          </h1>
          <p className="text-gray-600">
            Temukan pasangan! {matchedPairs}/{totalPairs} pasang
          </p>
        </div>

        <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto">
          {cards.map((card) => {
            const isFlipped = flipped.includes(card.id) || card.matched;
            return (
              <motion.button
                key={card.id}
                whileHover={{ scale: isFlipped ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFlip(card.id)}
                disabled={card.matched || !canFlip}
                className={`aspect-square rounded-2xl shadow-lg border-4 
                  flex items-center justify-center text-4xl md:text-5xl
                  transition-all duration-300 relative
                  ${
                    card.matched
                      ? "bg-gradient-to-br from-green-300 to-green-500 border-white"
                      : isFlipped
                      ? "bg-gradient-to-br from-arena-gold to-arena-red border-white"
                      : "bg-gradient-to-br from-arena-blue to-arena-purple border-white cursor-pointer"
                  }`}
              >
                <motion.span
                  initial={false}
                  animate={{ rotateY: isFlipped ? 0 : 180 }}
                  transition={{ duration: 0.3 }}
                >
                  {isFlipped ? card.emoji : "❓"}
                </motion.span>
              </motion.button>
            );
          })}
        </div>

        <div className="text-center mt-6">
          <button onClick={startGame} className="btn-blue">
            🔄 Acak Ulang
          </button>
        </div>
      </div>
    </div>
  );
}