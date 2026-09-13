"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function KoleksiPage() {
  const [badges, setBadges] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, earned: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/badge/me")
      .then((r) => r.json())
      .then((data) => {
        setBadges(data.badges || []);
        setStats({ total: data.total || 0, earned: data.earned || 0 });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-6xl animate-bounce-slow">🏅</div>
      </div>
    );
  }

  const percent = stats.total > 0 ? Math.round((stats.earned / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen p-6 bg-arena-pattern">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="text-arena-blue font-bold mb-4 inline-block">
          ← Kembali ke Dashboard
        </Link>

        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <div className="text-7xl mb-3 animate-bounce-slow">🏅</div>
          <h1 className="text-4xl font-bold font-playful text-arena-purple mb-2">
            Koleksi Medali
          </h1>
          <p className="text-gray-600 font-fun">
            Kumpulkan semua medali dengan rajin belajar!
          </p>
        </motion.div>

        <div className="bg-white/90 rounded-3xl p-5 mb-6 border-4 border-arena-purple/30">
          <div className="flex justify-between mb-2 font-playful text-lg">
            <span>🏅 Progress Koleksi</span>
            <span className="text-arena-purple font-bold">
              {stats.earned} / {stats.total}
            </span>
          </div>
          <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 1.5 }}
              className="h-full bg-gradient-to-r from-arena-purple to-arena-blue rounded-full"
            />
          </div>
          <p className="text-center mt-2 text-sm text-gray-600 font-bold">
            {percent}% terkumpul
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {badges.map((b, i) => (
            <motion.div
              key={b.slug}
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: i * 0.05, type: "spring" }}
              className={`rounded-3xl p-5 text-center border-4 shadow-lg
                ${
                  b.earned
                    ? "bg-gradient-to-br from-arena-gold/40 to-arena-purple/30 border-arena-gold"
                    : "bg-gray-100 border-gray-300 opacity-60"
                }`}
            >
              <div className={`text-5xl mb-2 ${b.earned ? "animate-float" : "grayscale"}`}>
                {b.earned ? b.emoji : "🔒"}
              </div>
              <h3
                className={`font-bold font-playful mb-1 ${
                  b.earned ? "text-arena-dark" : "text-gray-500"
                }`}
              >
                {b.name}
              </h3>
              <p className="text-xs text-gray-600">{b.description}</p>
              {b.earned && (
                <div className="mt-2 bg-arena-gold text-arena-dark text-xs px-3 py-1 
                                rounded-full font-bold inline-block">
                  ✅ Diraih
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}