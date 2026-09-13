"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="text-center max-w-3xl">
        <div className="text-8xl mb-4">*</div>
        <h1 className="text-6xl md:text-7xl font-extrabold mb-4 font-playful">
          <span className="text-gradient-arena">ArenaBelajar</span>
        </h1>
        <p className="text-2xl text-arena-dark mb-2 font-fun">
          Masuk Arena, Keluar Jadi Juara!
        </p>
        <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
          Belajar sambil bertanding! Materi lengkap kelas 1-6 SD.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/login">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="btn-red text-xl px-8 py-4">Mulai Bertanding</motion.button>
          </Link>
          <Link href="/register">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="btn-blue text-xl px-8 py-4">Daftar Gratis</motion.button>
          </Link>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-5xl">
        {[
          { title: "Materi Lengkap", desc: "8 mapel, kelas 1-6 SD" },
          { title: "Game Seru", desc: "Tebak gambar, memory, cari kata" },
          { title: "Jadi Juara", desc: "Kumpulkan kristal & medali" }
        ].map((f, i) => (
          <motion.div key={i} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.2 }} className="card-arena text-center">
            <div className="text-3xl font-bold text-arena-red mb-3">*</div>
            <h3 className="text-2xl font-bold text-arena-red mb-2">{f.title}</h3>
            <p className="text-gray-600">{f.desc}</p>
          </motion.div>
        ))}
      </div>
      <p className="mt-16 text-gray-500 text-sm">2025 ArenaBelajar</p>
    </main>
  );
}