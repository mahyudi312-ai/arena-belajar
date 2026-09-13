"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

const SIZE = 8;

const WORDS = ["KUCING", "AYAM", "SAPI", "BEBEK", "KAMBING"];

const WORD_COLORS = [
  "bg-pink-400",
  "bg-blue-400",
  "bg-green-400",
  "bg-yellow-400",
  "bg-purple-400",
];

type Cell = {
  letter: string;
  wordIndex: number | null; // null = random filler
  found: boolean;
  selected: boolean;
};

function placeWord(
  grid: Cell[][],
  word: string,
  wordIndex: number
): boolean {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [-1, 1],
  ];

  for (let attempt = 0; attempt < 100; attempt++) {
    const dir = directions[Math.floor(Math.random() * directions.length)];
    const [dr, dc] = dir;

    const maxRow = SIZE - (dr > 0 ? word.length : 1);
    const maxCol = SIZE - (dc > 0 ? word.length : 1);
    const minRow = dr < 0 ? word.length - 1 : 0;
    const minCol = dc < 0 ? word.length - 1 : 0;

    if (maxRow < minRow || maxCol < minCol) continue;

    const row = Math.floor(Math.random() * (maxRow - minRow + 1)) + minRow;
    const col = Math.floor(Math.random() * (maxCol - minCol + 1)) + minCol;

    let fits = true;
    for (let i = 0; i < word.length; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (r < 0 || r >= SIZE || c < 0 || c >= SIZE) {
        fits = false;
        break;
      }
      const cell = grid[r][c];
      if (cell.letter !== "" && cell.letter !== word[i]) {
        fits = false;
        break;
      }
    }

    if (fits) {
      for (let i = 0; i < word.length; i++) {
        const r = row + dr * i;
        const c = col + dc * i;
        grid[r][c].letter = word[i];
        grid[r][c].wordIndex = wordIndex;
      }
      return true;
    }
  }
  return false;
}

function generateGrid(): Cell[][] {
  const grid: Cell[][] = Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => ({
      letter: "",
      wordIndex: null,
      found: false,
      selected: false,
    }))
  );

  WORDS.forEach((word, i) => {
    placeWord(grid, word, i);
  });

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (!grid[r][c].letter) {
        grid[r][c].letter =
          alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }
  return grid;
}

export default function CariKataPage() {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [foundWords, setFoundWords] = useState<number[]>([]);
  const [selecting, setSelecting] = useState<{ r: number; c: number } | null>(
    null
  );
  const [hovering, setHovering] = useState<{ r: number; c: number } | null>(
    null
  );
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(true);
  const [finished, setFinished] = useState(false);
  const [wrongFlash, setWrongFlash] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);

  const totalWords = WORDS.length;
  const exp = Math.max(50, 150 - time - (hintUsed ? 30 : 0));

  const newGame = () => {
    setGrid(generateGrid());
    setFoundWords([]);
    setSelecting(null);
    setHovering(null);
    setTime(0);
    setRunning(true);
    setFinished(false);
    setHintUsed(false);
  };

  useEffect(() => {
    newGame();
  }, []);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setTime((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  useEffect(() => {
    if (foundWords.length === totalWords && totalWords > 0) {
      setRunning(false);
      setFinished(true);
      confetti({ particleCount: 200, spread: 90, origin: { y: 0.5 } });
    }
  }, [foundWords, totalWords]);

  const getLineCells = (
    start: { r: number; c: number },
    end: { r: number; c: number }
  ): { r: number; c: number }[] => {
    const dr = end.r - start.r;
    const dc = end.c - start.c;

    const absR = Math.abs(dr);
    const absC = Math.abs(dc);

    // Hanya horizontal, vertikal, atau diagonal 45°
    if (dr !== 0 && dc !== 0 && absR !== absC) return [];

    const steps = Math.max(absR, absC);
    const stepR = dr === 0 ? 0 : dr / absR;
    const stepC = dc === 0 ? 0 : dc / absC;

    const cells: { r: number; c: number }[] = [];
    for (let i = 0; i <= steps; i++) {
      cells.push({
        r: start.r + stepR * i,
        c: start.c + stepC * i,
      });
    }
    return cells;
  };

  const handleClickCell = (r: number, c: number) => {
    if (finished) return;
    if (grid[r][c].found) return;

    if (!selecting) {
      setSelecting({ r, c });
      return;
    }

    const line = getLineCells(selecting, { r, c });
    if (line.length === 0) {
      setSelecting({ r, c });
      return;
    }

    const word = line.map((p) => grid[p.r][p.c].letter).join("");
    const wordIndex = WORDS.findIndex((w) => w === word);
    const reverseIndex = WORDS.findIndex(
      (w) => w === word.split("").reverse().join("")
    );

    const foundIdx = wordIndex >= 0 ? wordIndex : reverseIndex;

    if (foundIdx >= 0 && !foundWords.includes(foundIdx)) {
      // Tandai ditemukan
      const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
      line.forEach((p) => {
        newGrid[p.r][p.c].found = true;
      });
      setGrid(newGrid);
      setFoundWords((prev) => [...prev, foundIdx]);
      setSelecting(null);
      setHovering(null);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    } else {
      // Salah
      setWrongFlash(true);
      setTimeout(() => setWrongFlash(false), 400);
      setSelecting({ r, c });
    }
  };

  const getCellHighlight = (r: number, c: number): string => {
    if (grid[r]?.[c]?.found) {
      const wi = grid[r][c].wordIndex;
      if (wi !== null) return `${WORD_COLORS[wi % WORD_COLORS.length]} text-white`;
    }
    if (selecting && hovering) {
      const line = getLineCells(selecting, hovering);
      if (line.some((p) => p.r === r && p.c === c)) {
        return "bg-arena-gold text-arena-dark ring-2 ring-arena-red";
      }
    }
    if (selecting?.r === r && selecting?.c === c) {
      return "bg-arena-red text-white";
    }
    return "bg-white hover:bg-arena-gold/30";
  };

  if (finished) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-arena-pattern">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card-arena max-w-md w-full text-center"
        >
          <div className="text-7xl mb-4">🔍</div>
          <h1 className="text-3xl font-bold font-playful text-arena-red mb-3">
            Hebat!
          </h1>
          <p className="text-xl mb-2 font-fun">
            Semua kata ditemukan! 🎉
          </p>
          <p className="text-lg text-gray-600 mb-2">⏱️ Waktu: {time} detik</p>
          <p className="text-2xl font-bold text-arena-gold mb-6">+{exp} EXP</p>

          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={newGame} className="btn-blue">
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
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Link href="/game" className="text-arena-blue font-bold">
            ← Game Lain
          </Link>
          <div className="flex gap-4 font-bold font-playful">
            <span>⏱️ {time}s</span>
            <span>
              ✅ {foundWords.length}/{totalWords}
            </span>
          </div>
        </div>

        <div className="text-center mb-4">
          <div className="text-5xl mb-2">🔍</div>
          <h1 className="text-3xl font-bold font-playful text-arena-red mb-1">
            Cari Kata
          </h1>
          <p className="text-gray-600">
            Klik huruf pertama, lalu huruf terakhir kata!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Grid huruf */}
          <div className="md:col-span-2">
            <div
              className={`inline-grid grid-cols-8 gap-1 md:gap-2 p-3 md:p-4 
                          bg-white/80 rounded-3xl shadow-xl border-4 border-arena-gold/40
                          ${wrongFlash ? "animate-shake" : ""}`}
              onMouseLeave={() => setHovering(null)}
            >
              {grid.map((row, r) =>
                row.map((cell, c) => (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => handleClickCell(r, c)}
                    onMouseEnter={() => setHovering({ r, c })}
                    disabled={cell.found}
                    className={`w-8 h-8 md:w-12 md:h-12 rounded-xl font-bold 
                               text-base md:text-xl transition-all
                               flex items-center justify-center
                               ${getCellHighlight(r, c)}
                               ${cell.found ? "cursor-default" : "cursor-pointer"}
                               border-2 border-white shadow`}
                  >
                    {cell.letter}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Daftar kata */}
          <div className="bg-white/90 rounded-3xl p-4 shadow-xl border-4 border-arena-gold/40">
            <h2 className="font-bold font-playful text-lg text-arena-dark mb-3 text-center">
              📝 Cari Kata:
            </h2>
            <div className="space-y-2">
              {WORDS.map((word, i) => {
                const found = foundWords.includes(i);
                return (
                  <div
                    key={word}
                    className={`px-3 py-2 rounded-xl font-bold text-center 
                      transition-all ${
                        found
                          ? `${WORD_COLORS[i % WORD_COLORS.length]} text-white 
                             line-through scale-95`
                          : "bg-gray-100 text-arena-dark"
                      }`}
                  >
                    {found ? "✅ " : "⬜ "}
                    {word}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 space-y-2">
              {selecting && (
                <p className="text-xs text-center text-arena-blue font-bold">
                  Sekarang klik huruf terakhir
                </p>
              )}
              <button
                onClick={newGame}
                className="btn-blue w-full text-sm py-2"
              >
                🔄 Acak Ulang
              </button>
            </div>
          </div>
        </div>

        <p className="text-center mt-4 text-sm text-gray-600">
          💡 Kata bisa horizontal, vertikal, atau diagonal.
        </p>
      </div>
    </div>
  );
}