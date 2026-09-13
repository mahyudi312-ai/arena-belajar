"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DaftarMateriPage() {
  const params = useParams();
  const slug = params.subject as string;
  const kelas = params.kelas as string;
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/materi/list?subject=${slug}&kelas=${kelas}`)
      .then((r) => r.json())
      .then((data) => {
        setLessons(data.lessons || []);
        setSubject(data.subject || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug, kelas]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-6xl animate-bounce-slow">📚</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-arena-pattern">
      <div className="max-w-4xl mx-auto">
        <Link href={`/belajar/${slug}`} className="text-arena-blue font-bold mb-4 inline-block">
          ← Pilih Kelas Lain
        </Link>

        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="text-6xl mb-3">{subject?.emoji || "📚"}</div>
          <h1 className="text-3xl font-bold font-playful text-arena-red mb-2">
            {subject?.name || "Pelajaran"} — Kelas {kelas}
          </h1>
          <p className="text-gray-600 font-fun">
            {lessons.length} misi menanti untuk diselesaikan
          </p>
        </motion.div>

        {lessons.length === 0 ? (
          <div className="card-arena text-center">
            <div className="text-6xl mb-3">📭</div>
            <h2 className="text-2xl font-bold text-arena-dark mb-2">
              Belum ada materi
            </h2>
            <p className="text-gray-600">
              Materi untuk kelas ini belum tersedia. Coba kelas lain ya!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {lessons.map((lesson: any, i: number) => (
              <motion.div
                key={lesson.id}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/materi/${lesson.id}`}>
                  <div className="card-arena flex items-center gap-4 hover:scale-[1.02] cursor-pointer transition-all">
                    <div className="bg-gradient-to-br from-arena-gold to-arena-red
                                    rounded-2xl w-16 h-16 flex items-center justify-center
                                    text-2xl font-bold text-white shrink-0">
                      {lesson.urutan}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold font-playful text-arena-dark">
                        {lesson.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        +{lesson.expReward} EXP • {lesson._count?.quizzes || 0} soal
                      </p>
                    </div>
                    <div className="text-3xl">▶️</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}