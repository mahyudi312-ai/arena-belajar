"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function MateriPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/materi/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setLesson(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-6xl animate-bounce-slow">📖</div>
      </div>
    );
  }

  if (!lesson || lesson.error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="card-arena text-center max-w-md">
          <div className="text-6xl mb-3">😢</div>
          <h1 className="text-2xl font-bold mb-2">Materi tidak ditemukan</h1>
          <Link href="/dashboard" className="btn-red inline-block mt-4">
            Kembali
          </Link>
        </div>
      </div>
    );
  }

  const markdownToHtml = (md: string) => {
    let html = md;
    html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
    html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
    html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
    html = html.replace(/\n\n/g, "</p><p>");
    html = "<p>" + html + "</p>";
    html = html.replace(/\|(.+)\|/g, (match: string) => {
      return match;
    });
    return html;
  };

  return (
    <div className="min-h-screen p-6 bg-arena-pattern">
      <div className="max-w-3xl mx-auto">
        <Link
          href={`/belajar/${lesson.subject.slug}/${lesson.kelas}`}
          className="text-arena-blue font-bold mb-4 inline-block"
        >
          ← Kembali ke Daftar Materi
        </Link>

        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="card-arena mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{lesson.subject.emoji}</span>
            <span className="badge-exp">+{lesson.expReward} EXP</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-playful text-arena-red mb-2">
            {lesson.title}
          </h1>
          <p className="text-gray-600 font-fun">
            {lesson.subject.name} • Kelas {lesson.kelas}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="card-arena prose prose-lg max-w-none mb-6"
        >
          <div
            className="text-arena-dark leading-relaxed whitespace-pre-wrap font-body"
            style={{ fontSize: "1.05rem" }}
          >
            {lesson.content}
          </div>
        </motion.div>

        <div className="text-center">
          <Link href={`/latihan/${lesson.id}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-red text-xl px-8 py-4"
            >
              Mulai Latihan Soal ▶
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
}