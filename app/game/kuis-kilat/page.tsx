"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const LABELS = ["A", "B", "C", "D"];
const QUESTION_TIME = 10;
const TOTAL_QUESTIONS = 10;

const QUESTIONS = [
  { q: "5 + 3 = ?", options: ["7", "8", "9", "10"], answer: "8" },
  { q: "12 - 4 = ?", options: ["6", "7", "8", "9"], answer: "8" },
  { q: "3 × 4 = ?", options: ["10", "11", "12", "13"], answer: "12" },
  { q: "20 ÷ 4 = ?", options: ["4", "5", "6", "7"], answer: "5" },
  { q: "15 + 7 = ?", options: ["20", "21", "22", "23"], answer: "22" },
  { q: "9 × 3 = ?", options: ["24", "25", "26", "27"], answer: "27" },
  { q: "36 ÷ 6 = ?", options: ["4", "5", "6", "7"], answer: "6" },
  { q: "48 + 12 = ?", options: ["56", "58", "60", "62"], answer: "60" },
  { q: "100 - 45 = ?", options: ["45", "50", "55", "65"], answer: "55" },
  { q: "7 × 8 = ?", options: ["48", "54", "56", "64"], answer: "56" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function KuisKilatPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [skor, setSkor] = useState(0);
  const [exp, setExp] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const timerRef = useRef<any>(null);

  const startGame = () => {
    const shuffledQuestions = shuffle(QUESTIONS).map((q) => ({
      ...q,
      options: shuffle(q.options),
    }));
    setQuestions(shuffledQuestions);
    setCurrent(0);
    setSelected(null);
    setSkor(0);
    setExp(0);
    setCorrectCount(0);
    setTimeLeft(QUESTION_TIME);
    setFinished(false);
    setFeedback("");
  };

  useEffect(() => {
    startGame();
  }, []);

  // Timer per soal
  useEffect(() => {
    if (finished || selected || questions.length === 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [current, selected, finished, questions]);

  const handleTimeout = () => {
    setFeedback("⏰ Waktu habis!");
    setSelected("__timeout__");
    setTimeout(() => nextQuestion(), 1200);
  };

  const handleAnswer = (opt: string) => {
    if (selected) return;
    clearInterval(timerRef.current);
    setSelected(opt);

    const quiz = questions[current];
    const isCorrect = opt === quiz.answer;

    if (isCorrect) {
      const bonus = Math.max(1, Math.round(timeLeft / 2));
      const gainedExp = 10 + bonus * 2;
      setSkor(skor + 1);
      setCorrectCount(correctCount + 1);
      setExp(exp + gainedExp);
      setFeedback(`✅ Benar! +${gainedExp} EXP (⚡${timeLeft}s)`);
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    } else {
      setFeedback(`❌ Salah. Jawaban: ${quiz.answer}`);
    }

    setTimeout(() => nextQuestion(), 1200);
  };

  const nextQuestion = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setSelected(null);
      setTimeLeft(QUESTION_TIME);
      setFeedback("");
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    const percent = Math.round((correctCount / TOTAL_QUESTIONS) * 100);
    const isPerfect = correctCount === TOTAL_QUESTIONS;
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-arena-pattern">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card-arena max-w-md w-full text-center"
        >
          <div className="text-7xl mb-4">
            {isPerfect ? "🏆" : percent >= 70 ? "🌟" : "💪"}
          </div>
          <h1 className="text-3xl font-bold font-playful text-arena-red mb-3">
            {isPerfect ? "Sempurna!" : percent >= 70 ? "Hebat!" : "Coba Lagi!"}
          </h1>
          <p className="text-xl mb-2 font-fun">
            Benar: <strong>{correctCount}</strong> / {TOTAL_QUESTIONS}
          </p>
          <p className="text-lg text-gray-600 mb-2">Nilai: {percent}</p>
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

  if (questions.length === 0) return null;

  const quiz = questions[current];
  const timePercent = (timeLeft / QUESTION_TIME) * 100;

  return (
    <div className="min-h-screen p-4 md:p-6 bg-arena-pattern">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Link href="/game" className="text-arena-blue font-bold">
            ← Game Lain
          </Link>
          <div className="flex gap-4 font-bold font-playful">
            <span>⭐ {exp}</span>
            <span>
              Soal {current + 1}/{TOTAL_QUESTIONS}
            </span>
          </div>
        </div>

        <div className="text-center mb-4">
          <div className="text-5xl mb-2">⚡</div>
          <h1 className="text-3xl font-bold font-playful text-arena-purple">
            Kuis Kilat
          </h1>
        </div>

        {/* Timer bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2 font-bold">
            <span className="text-arena-dark">⏱️ Waktu</span>
            <span
              className={`text-2xl font-playful ${
                timeLeft <= 3 ? "text-red-600 animate-pulse" : "text-arena-blue"
              }`}
            >
              {timeLeft}s
            </span>
          </div>
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                timeLeft <= 3
                  ? "bg-gradient-to-r from-red-500 to-red-600"
                  : "bg-gradient-to-r from-arena-gold via-arena-red to-arena-purple"
              }`}
              animate={{ width: `${timePercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="card-arena"
          >
            <h2 className="text-2xl md:text-3xl font-bold font-playful text-arena-dark mb-6 text-center">
              {quiz.q}
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {quiz.options.map((opt: string, i: number) => {
                const isCorrect = opt === quiz.answer;
                const isSelected = opt === selected;
                let bg = "bg-gradient-to-br from-arena-mint to-cyan-400";
                let textColor = "text-white";
                let labelBg = "bg-arena-blue";

                if (selected) {
                  if (isCorrect) {
                    bg = "bg-green-500";
                    textColor = "text-white";
                    labelBg = "bg-white";
                  } else if (isSelected) {
                    bg = "bg-red-500";
                    textColor = "text-white";
                    labelBg = "bg-white";
                  } else {
                    bg = "bg-gray-200";
                    textColor = "text-gray-500";
                    labelBg = "bg-gray-400";
                  }
                }

                return (
                  <motion.button
                    key={i}
                    whileHover={{ scale: selected ? 1 : 1.05 }}
                    whileTap={{ scale: selected ? 1 : 0.95 }}
                    onClick={() => handleAnswer(opt)}
                    disabled={!!selected}
                    className={`${bg} ${textColor} p-4 rounded-2xl 
                               font-bold text-xl shadow-lg border-4 border-white
                               disabled:cursor-not-allowed transition-all
                               flex items-center gap-3`}
                  >
                    <span
                      className={`${labelBg} text-white font-bold 
                                    w-8 h-8 rounded-full flex items-center 
                                    justify-center shrink-0 text-sm`}
                    >
                      {LABELS[i]}
                    </span>
                    <span>{opt}</span>
                  </motion.button>
                );
              })}
            </div>

            {feedback && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`mt-6 text-center text-xl font-bold font-playful ${
                  feedback.includes("Benar")
                    ? "text-green-600"
                    : feedback.includes("Waktu")
                    ? "text-orange-600"
                    : "text-red-600"
                }`}
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