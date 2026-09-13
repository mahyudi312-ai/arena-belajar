"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

const avatarEmoji: Record<string, string> = {
  ara: "🦸", kiki: "🐦", bubu: "🐻", ciko: "🐱",
  momo: "🐵", pipo: "🐧", nunu: "🐰", tata: "🐿️",
};

function getPangkat(level: number) {
  if (level <= 5) return "🐣 Pemula";
  if (level <= 10) return "⚔️ Ksatria";
  if (level <= 20) return "🛡️ Pahlawan";
  if (level <= 30) return "🏆 Juara";
  if (level <= 40) return "👑 Master";
  return "🌟 Legenda";
}

function getMedal(rank: number) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return "";
}

export default function PapanJuaraPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"kelas" | "semua">("kelas");

  const currentUser = session?.user as any;
  const myKelas = currentUser?.kelas;

  useEffect(() => {
    const url =
      filter === "kelas" && myKelas
        ? `/api/leaderboard?kelas=${myKelas}&limit=50`
        : "/api/leaderboard?limit=50";

    setLoading(true);
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filter, myKelas]);

  return (
    <div className="min-h-screen p-6 bg-arena-pattern">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard" className="text-arena-blue font-bold mb-4 inline-block">
          ← Kembali ke Dashboard
        </Link>

        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <div className="text-7xl mb-3 animate-bounce-slow">🏆</div>
          <h1 className="text-4xl font-bold font-playful text-arena-red mb-2">
            Papan Juara
          </h1>
          <p className="text-gray-600 font-fun">
            Juara sejati adalah yang rajin belajar! 💪
          </p>
        </motion.div>

        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={() => setFilter("kelas")}
            className={`px-5 py-2 rounded-2xl font-bold transition-all ${
              filter === "kelas"
                ? "bg-arena-red text-white scale-105 shadow-lg"
                : "bg-white text-arena-dark hover:bg-arena-gold/20"
            }`}
          >
            🏫 Kelas Saya
          </button>
          <button
            onClick={() => setFilter("semua")}
            className={`px-5 py-2 rounded-2xl font-bold transition-all ${
              filter === "semua"
                ? "bg-arena-red text-white scale-105 shadow-lg"
                : "bg-white text-arena-dark hover:bg-arena-gold/20"
            }`}
          >
            🌍 Semua Siswa
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="text-6xl animate-bounce-slow">⏳</div>
            <p className="text-gray-600 mt-3 font-bold">Memuat ranking...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="card-arena text-center">
            <div className="text-6xl mb-3">📭</div>
            <h2 className="text-2xl font-bold text-arena-dark mb-2">
              Belum ada siswa
            </h2>
            <p className="text-gray-600">
              Ajak temanmu belajar untuk muncul di papan juara!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((u, i) => {
              const rank = i + 1;
              const medal = getMedal(rank);
              const isMe = u.id === currentUser?.id;
              const avatar = avatarEmoji[u.avatar] || "🦸";

              let bgColor = "bg-white";
              let borderColor = "border-white";
              if (rank === 1) {
                bgColor = "bg-gradient-to-r from-yellow-100 to-yellow-50";
                borderColor = "border-yellow-400";
              } else if (rank === 2) {
                bgColor = "bg-gradient-to-r from-gray-100 to-gray-50";
                borderColor = "border-gray-400";
              } else if (rank === 3) {
                bgColor = "bg-gradient-to-r from-orange-100 to-orange-50";
                borderColor = "border-orange-400";
              }
              if (isMe) {
                borderColor = "border-arena-red border-4";
                bgColor = "bg-arena-gold/20";
              }

              return (
                <motion.div
                  key={u.id}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`${bgColor} rounded-3xl p-4 border-4 ${borderColor} 
                             shadow-md flex items-center gap-4 relative`}
                >
                  <div className="w-12 text-center">
                    {medal ? (
                      <span className="text-4xl">{medal}</span>
                    ) : (
                      <span className="text-2xl font-bold text-gray-400">
                        {rank}
                      </span>
                    )}
                  </div>

                  <div className="text-4xl">{avatar}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`font-bold text-lg font-playful truncate ${
                        isMe ? "text-arena-red" : "text-arena-dark"
                      }`}>
                        {u.name}
                      </h3>
                      {isMe && (
                        <span className="bg-arena-red text-white text-xs px-2 py-0.5 
                                       rounded-full font-bold">
                          Kamu
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600">
                      Kelas {u.kelas || "-"} • {getPangkat(u.level)} • Level {u.level}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-bold text-arena-blue text-lg">
                      {u.exp.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">EXP</div>
                  </div>
                </motion.div>
              );
            })}

            <div className="text-center mt-6 text-sm text-gray-500">
              Menampilkan {users.length} siswa teratas
            </div>
          </div>
        )}
      </div>
    </div>
  );
}