"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

const subjectNames: Record<string, { name: string; emoji: string }> = {
  "bahasa-indonesia": { name: "Bahasa Indonesia", emoji: "📖" },
  "matematika": { name: "Matematika", emoji: "🔢" },
  "ppkn": { name: "PPKn", emoji: "🇮🇩" },
  "ipas": { name: "IPAS", emoji: "🔬" },
  "seni": { name: "Seni Budaya", emoji: "🎨" },
  "pai": { name: "Agama Islam", emoji: "🕌" },
  "bahasa-inggris": { name: "Bahasa Inggris", emoji: "🌍" },
  "koding": { name: "Koding", emoji: "💻" },
};

export default function PilihKelasPage() {
  const params = useParams();
  const slug = params.subject as string;
  const subject = subjectNames[slug] || { name: "Pelajaran", emoji: "📚" };

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
          <div className="text-7xl mb-3">{subject.emoji}</div>
          <h1 className="text-4xl font-bold font-playful text-arena-red mb-2">
            {subject.name}
          </h1>
          <p className="text-gray-600 font-fun">Pilih kelasmu untuk mulai belajar</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((k, i) => (
            <motion.div
              key={k}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: i * 0.1, type: "spring" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={`/belajar/${slug}/${k}`}>
                <div className="bg-gradient-to-br from-arena-blue to-arena-purple
                                rounded-3xl p-6 text-white shadow-xl cursor-pointer
                                border-4 border-white text-center hover:shadow-2xl transition-all">
                  <div className="text-5xl mb-2">🏫</div>
                  <div className="text-3xl font-bold font-playful">Kelas {k}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}