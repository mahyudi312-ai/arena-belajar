"use client";
import Link from "next/link";
import { motion } from "framer-motion";

const games = [
  {
    slug: "tebak-gambar",
    title: "Tebak Gambar",
    emoji: "🖼️",
    desc: "Tebak gambar dari emoji!",
    color: "from-pink-400 to-rose-500",
    exp: 50,
  },
  {
    slug: "memory",
    title: "Memory Match",
    emoji: "🧠",
    desc: "Cocokkan pasangan kartu",
    color: "from-cyan-400 to-blue-500",
    exp: 75,
  },
  {
    slug: "cari-kata",
    title: "Cari Kata",
    emoji: "🔍",
    desc: "Temukan kata tersembunyi",
    color: "from-yellow-400 to-orange-500",
    exp: 75,
  },
  {
    slug: "kuis-kilat",
    title: "Kuis Kilat",
    emoji: "⚡",
    desc: "Jawab cepat sebelum waktu habis",
    color: "from-purple-400 to-indigo-500",
    exp: 100,
  },
];

export default function GameListPage() {
  return (
    <div className="min-h-screen p-6 bg-arena-pattern">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="text-arena-blue font-bold mb-4 inline-block">
          ← Kembali ke Dashboard
        </Link>

        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="text-7xl mb-3 animate-bounce-slow">🎮</div>
          <h1 className="text-4xl font-bold font-playful text-arena-red mb-2">
            Arena Game
          </h1>
          <p className="text-gray-600 font-fun">
            Pilih game seru untuk dimainkan!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {games.map((g, i) => (
            <motion.div
              key={g.slug}
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: i * 0.1, type: "spring" }}
              whileHover={{ scale: 1.03 }}
            >
              <Link href={`/game/${g.slug}`}>
                <div className={`bg-gradient-to-br ${g.color} rounded-3xl p-6 
                                text-white shadow-xl cursor-pointer border-4 border-white 
                                hover:shadow-2xl transition-all`}>
                  <div className="text-6xl mb-3 animate-float">{g.emoji}</div>
                  <h3 className="text-2xl font-bold font-playful mb-1">{g.title}</h3>
                  <p className="text-sm opacity-90">{g.desc}</p>
                  <div className="mt-3 text-sm font-bold">+{g.exp} 💎</div>
                  <button className="mt-3 bg-white/30 hover:bg-white/50 px-4 py-1 
                                     rounded-full text-sm font-bold transition">
                    Main Sekarang ▶
                  </button>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}