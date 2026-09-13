"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const LABELS = ["A", "B", "C", "D"];

const QUESTIONS = [
  { img: "🐘", answer: "Gajah", options: ["Gajah", "Kucing", "Ayam", "Sapi"] },
  { img: "🍎", answer: "Apel", options: ["Mangga", "Apel", "Jeruk", "Pisang"] },
  { img: "🚗", answer: "Mobil", options: ["Motor", "Mobil", "Sepeda", "Bus"] },
  { img: "🐟", answer: "Ikan", options: ["Burung", "Kucing", "Ikan", "Kambing"] },
  { img: "🌻", answer: "Bunga Matahari", options: ["Mawar", "Melati", "Bunga Matahari", "Anggrek"] },
  { img: "⚽", answer: "Bola", options: ["Bola", "Balon", "Kelereng", "Buku"] },
  { img: "🏠", answer: "Rumah", options: ["Sekolah", "Rumah", "Pasar", "Kantor"] },
  { img: "🐦", answer: "Burung", options: ["Ikan", "Kucing", "Burung", "Sapi"] },
  { img: "🍌", answer: "Pisang", options: ["Apel", "Pisang", "Jeruk", "Anggur"] },
  { img: "📚", answer: "Buku", options: ["Pensil", "Buku", "Penghapus", "Tas"] },
];

export default function TebakGambarPage() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [skor, setSkor] = useState(0);
  const [exp, setExp] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (opt: string) => {
    if (selected) return;
    setSelected(opt);

    const q = QUESTIONS[current];
    const isCorrect = opt === q.answer;

    if (isCorrect) {
      setFeedback("Benar! +50 EXP");
      setSkor(skor + 1);
      setExp(exp + 50);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } else {
      setFeedback("Salah. Jawaban: " + q.answer);
    }

    setTimeout(() => {
      if (current < QUESTIONS.length - 1) {
        setCurrent(current + 1);
        setSelected(null);
        setFeedback("");
      } else {
        setFinished(true);
      }
    }, 1500);
  };

  const reset = () => {
    setCurrent(0);
    setSelected(null);
    setFeedback("");
    setSkor(0);
    setExp(0);
    setFinished(false);
  };

  if (finished) {
    const percent = Math.round((skor / QUESTIONS.length) * 100);
    const isPerfect = skor === QUESTIONS.length;
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-arena-pattern">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card-arena max-w-md w-full text-center"
        >
          <div className="text-7xl mb-4">{isPerfect ? "🏆" : "🌟"}</div>
          <h1 className="text-3xl font-bold font-playful text-arena-red mb-3">
            {isPerfect ? "Perfect Victory!" : "Selesai!"}
          </h1>
          <p className="text-xl mb-2 font-fun">
            Skor: <strong>{skor}</strong> / {QUESTIONS.length}
          </p>
          <p className="text-lg text-gray-600 mb-2">Nilai: {percent}</p>
          <p className="text-2xl font-bold text-arena-gold mb-6">+{exp} EXP</p>

          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={reset} className="btn-blue">Main Lagi</button>
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

  const q = QUESTIONS[current];

  return (
    <div className="min-h-screen p-6 bg-arena-pattern">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Link href="/game" className="text-arena-blue font-bold">
            ← Game Lain
          </Link>
          <span className="font-bold font-playful">
            Soal {current + 1}/{QUESTIONS.length}
          </span>
        </div>

        <div className="progress-arena mb-6">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${((current + 1) / QUESTIONS.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="card-arena"
          >
            <div className="text-center mb-6">
              <div className="text-[8rem] leading-none mb-4 animate-bounce-slow">
                {q.img}
              </div>
              <p className="text-2xl font-playful text-arena-dark">
                Gambar apa ini?
              </p>
            </div>

            <div className="space-y-3">
              {q.options.map((opt, i) => {
                const isCorrect = opt === q.answer;
                const isSelected = opt === selected;
                let bg = "bg-white hover:bg-arena-gold/20 border-arena-gold";
                let textColor = "text-arena-dark";
                let labelBg = "bg-arena-blue";

                if (selected) {
                  if (isCorrect) {
                    bg = "bg-green-500 border-green-600";
                    textColor = "text-white";
                    labelBg = "bg-white";
                  } else if (isSelected) {
                    bg = "bg-red-500 border-red-600";
                    textColor = "text-white";
                    labelBg = "bg-white";
                  } else {
                    bg = "bg-gray-100 border-gray-300";
                    textColor = "text-gray-400";
                    labelBg = "bg-gray-300";
                  }
                }

                return (
                  <motion.button
                    key={i}
                    whileHover={{ scale: selected ? 1 : 1.02 }}
                    whileTap={{ scale: selected ? 1 : 0.98 }}
                    onClick={() => handleAnswer(opt)}
                    disabled={!!selected}
                    className={`${bg} ${textColor} w-full text-left 
                               p-4 rounded-2xl border-4 shadow-md
                               disabled:cursor-not-allowed transition-all
                               flex items-center gap-4`}
                  >
                    <span className={`${labelBg} text-white font-bold 
                                     w-10 h-10 rounded-full flex items-center 
                                     justify-center shrink-0 text-lg`}>
                      {LABELS[i]}
                    </span>
                    <span className="text-lg font-bold font-playful">{opt}</span>
                  </motion.button>
                );
              })}
            </div>

            {feedback && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`mt-6 text-center text-xl font-bold font-playful
                  ${feedback.includes("Benar") ? "text-green-600" : "text-red-600"}`}
              >
                {feedback}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}