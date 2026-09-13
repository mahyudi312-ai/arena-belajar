"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const LABELS = ["A", "B", "C", "D", "E"];

function safeParseOptions(input: any): string[] {
  try {
    if (Array.isArray(input)) return input;
    if (typeof input === "string") {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) return parsed;
    }
    return [];
  } catch (e) {
    console.error("Gagal parse options:", input, e);
    return [];
  }
}

export default function LatihanPage() {
  const params = useParams();
  const id = params.id as string;
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [skor, setSkor] = useState(0);
  const [expGained, setExpGained] = useState(0);
  const [finished, setFinished] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/materi/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setLesson(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Error fetch:", e);
        setLoading(false);
      });
  }, [id]);

  const handleAnswer = async (opt: string) => {
    if (selected) return;
    setSelected(opt);

    const quiz = lesson.quizzes[current];
    const isCorrect = opt === quiz.answer;

    if (isCorrect) {
      setFeedback("Benar! +" + quiz.exp + " EXP");
      setSkor(skor + 1);
      setExpGained(expGained + quiz.exp);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } else {
      setFeedback("Salah. Jawaban: " + quiz.answer);
    }

    // Submit ke server
    try {
      const res = await fetch("/api/latihan/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: id,
          quizId: quiz.id,
          userAnswer: opt,
          isCorrect,
        }),
      });
      const data = await res.json();
      if (data.leveledUp) {
        setLevelUpInfo(data);
      }
    } catch (e) {
      console.error("Submit error:", e);
    }

    setTimeout(() => {
      if (current < lesson.quizzes.length - 1) {
        setCurrent(current + 1);
        setSelected(null);
        setFeedback("");
      } else {
        setFinished(true);
      }
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-6xl animate-bounce-slow">✏️</div>
      </div>
    );
  }

  if (!lesson || !lesson.quizzes || lesson.quizzes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="card-arena text-center max-w-md">
          <div className="text-6xl mb-3">📭</div>
          <h1 className="text-2xl font-bold mb-2">Belum ada soal</h1>
          <Link href="/dashboard" className="btn-red inline-block mt-4">
            Kembali
          </Link>
        </div>
      </div>
    );
  }

  if (finished) {
    const percent = Math.round((skor / lesson.quizzes.length) * 100);
    const isPerfect = skor === lesson.quizzes.length;
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
            Skor: <strong>{skor}</strong> / {lesson.quizzes.length}
          </p>
          <p className="text-lg text-gray-600 mb-2">Nilai: {percent}</p>
          <p className="text-2xl font-bold text-arena-gold mb-2">
            +{expGained} EXP
          </p>
          {levelUpInfo?.leveledUp && (
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-xl font-bold text-arena-purple mb-4"
            >
              🎉 Naik ke Level {levelUpInfo.newLevel}!
            </motion.p>
          )}
          <p className="text-sm text-gray-500 mb-6">
            ✨ EXP tersimpan di database!
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link href={`/materi/${lesson.id}`}>
              <button className="btn-blue">Baca Lagi</button>
            </Link>
            <Link href={`/belajar/${lesson.subject.slug}/${lesson.kelas}`}>
              <button className="btn-red">Materi Lain</button>
            </Link>
            <Link href="/dashboard">
              <button className="btn-purple">Dashboard</button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const quiz = lesson.quizzes[current];
  const options = safeParseOptions(quiz.options);

  return (
    <div className="min-h-screen p-6 bg-arena-pattern">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Link href={`/materi/${id}`} className="text-arena-blue font-bold">
            ← Baca Materi
          </Link>
          <span className="font-bold font-playful">
            Soal {current + 1}/{lesson.quizzes.length}
          </span>
        </div>

        <div className="progress-arena mb-6">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{
              width: `${((current + 1) / lesson.quizzes.length) * 100}%`,
            }}
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
            <h2 className="text-xl md:text-2xl font-bold font-playful text-arena-dark mb-6 text-center">
              {quiz.question}
            </h2>

            {options.length === 0 ? (
              <div className="text-center text-red-500 font-bold p-4">
                ⚠️ Opsi jawaban tidak tersedia
              </div>
            ) : (
              <div className="space-y-3">
                {options.map((opt: string, i: number) => {
                  const isCorrect = opt === quiz.answer;
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
            )}

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