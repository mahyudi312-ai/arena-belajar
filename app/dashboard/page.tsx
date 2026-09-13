"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const subjects = [
  { id: "bahasa-indonesia", name: "Bahasa Indonesia", emoji: "ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“", color: "from-pink-400 to-pink-600" },
  { id: "matematika", name: "Matematika", emoji: "ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒâ€šÃ‚Â¢", color: "from-blue-400 to-blue-600" },
  { id: "ppkn", name: "PPKn", emoji: "ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡Ãƒâ€šÃ‚Â®ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡Ãƒâ€šÃ‚Â©", color: "from-red-400 to-red-600" },
  { id: "ipas", name: "IPAS", emoji: "ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒâ€šÃ‚Â¬", color: "from-green-400 to-green-600" },
  { id: "seni", name: "Seni Budaya", emoji: "ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â¨", color: "from-purple-400 to-purple-600" },
  { id: "pai", name: "Agama Islam", emoji: "ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢Ãƒâ€¦Ã¢â‚¬â„¢", color: "from-emerald-400 to-emerald-600" },
  { id: "bahasa-inggris", name: "Bahasa Inggris", emoji: "ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã¢â‚¬â„¢Ãƒâ€šÃ‚Â", color: "from-orange-400 to-orange-600" },
  { id: "koding", name: "Koding", emoji: "ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢Ãƒâ€šÃ‚Â»", color: "from-indigo-400 to-indigo-600" },
];

const avatarEmoji: Record<string, string> = {
  ara: "ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¦Ãƒâ€šÃ‚Â¸", kiki: "ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚ÂÃƒâ€šÃ‚Â¦", bubu: "ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚ÂÃƒâ€šÃ‚Â»", ciko: "ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚ÂÃƒâ€šÃ‚Â±",
  momo: "ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚ÂÃƒâ€šÃ‚Âµ", pipo: "ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚ÂÃƒâ€šÃ‚Â§", nunu: "ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚ÂÃƒâ€šÃ‚Â°", tata: "ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚ÂÃƒâ€šÃ‚Â¿ÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¸Ãƒâ€šÃ‚Â",
};

function getPangkat(level: number) {
  if (level <= 5) return "ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚ÂÃƒâ€šÃ‚Â£ Pemula Arena";
  if (level <= 10) return "ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã‚Â¡ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¸Ãƒâ€šÃ‚Â Ksatria Muda";
  if (level <= 20) return "ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂºÃƒâ€šÃ‚Â¡ÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¸Ãƒâ€šÃ‚Â Pahlawan Ilmu";
  if (level <= 30) return "ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚ÂÃƒÂ¢Ã¢â€šÂ¬Ã‚Â  Juara Kelas";
  if (level <= 40) return "ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“ Master Arena";
  return "ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã¢â‚¬â„¢Ãƒâ€¦Ã‚Â¸ Legenda Cerdas";
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [freshUser, setFreshUser] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/user/me")
        .then((r) => r.json())
        .then((data) => {
          if (!data.error) {
            setFreshUser(data);
            const kelas = data.kelas;
            const url = kelas
              ? `/api/leaderboard?kelas=${kelas}&limit=3`
              : "/api/leaderboard?limit=3";
            return fetch(url);
          }
        })
        .then((r) => r && r.json())
        .then((data) => {
          if (data?.users) setLeaderboard(data.users);
        })
        .catch(() => {});
    }
  }, [session, refreshKey]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-6xl animate-bounce-slow">ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚ÂÃƒâ€¦Ã‚Â¸ÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¸Ãƒâ€šÃ‚Â</div>
      </div>
    );
  }

  if (!session?.user) return null;

  const sessionUser = session.user as any;
  const user = { ...sessionUser, ...freshUser };
  const exp = user.exp || 0;
  const level = user.level || 1;
  const kristal = user.kristal || 0;
  const streak = user.streak || 0;
  const expTarget = level * 500;
  const expPercent = Math.min((exp / expTarget) * 100, 100);
  const avatar = avatarEmoji[user.avatar] || "ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¦Ãƒâ€šÃ‚Â¸";

  return (
    <div className="min-h-screen p-4 md:p-6 bg-arena-pattern">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/90 backdrop-blur rounded-3xl shadow-xl p-5 md:p-6 mb-6 border-4 border-arena-red/30"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-5xl md:text-6xl animate-bounce-slow">{avatar}</div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-arena-red font-playful">
                  Hai, {user.name}! ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¹
                </h1>
                <p className="text-gray-600 font-fun">
                  Kelas {user.kelas || "-"} ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢ {getPangkat(level)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <StatBadge emoji="ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢Ãƒâ€¦Ã‚Â½" value={kristal} label="Kristal" />
              <StatBadge emoji="ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒâ€šÃ‚Â¥" value={streak} label="Streak" />
              <StatBadge emoji="ÃƒÆ’Ã‚Â¢Ãƒâ€šÃ‚Â­Ãƒâ€šÃ‚Â" value={exp} label="EXP" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/90 rounded-3xl p-5 mb-6 border-4 border-arena-gold/40"
        >
          <div className="flex justify-between mb-2 font-playful text-base md:text-lg">
            <span>ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â¯ Level {level} ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â {getPangkat(level)}</span>
            <span className="text-arena-red font-bold">{exp} / {expTarget} EXP</span>
          </div>
          <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${expPercent}%` }}
              transition={{ duration: 1.5 }}
              className="h-full bg-gradient-to-r from-arena-gold via-arena-red to-arena-purple rounded-full"
            />
          </div>
          <div className="flex justify-end mt-2">
            <button
              onClick={() => setRefreshKey((k) => k + 1)}
              className="text-xs text-arena-blue hover:underline font-bold"
            >
              ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾ Refresh
            </button>
          </div>
        </motion.div>

        <h2 className="text-2xl font-bold mb-4 font-playful text-arena-dark">
          ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒâ€¦Ã‚Â¡ Peta Misi ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â Pilih Pelajaranmu
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {subjects.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: i * 0.08, type: "spring" }}
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={`/belajar/${s.id}`}>
                <div className={`bg-gradient-to-br ${s.color} rounded-3xl p-5 
                                text-white shadow-xl cursor-pointer border-4 border-white
                                hover:shadow-2xl transition-all`}>
                  <div className="text-5xl mb-2">{s.emoji}</div>
                  <div className="font-bold text-base md:text-lg font-playful">{s.name}</div>
                  <div className="text-xs opacity-90 mt-1">Kelas 1-6</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold font-playful text-arena-dark">
            ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â® Game Seru Hari Ini
          </h2>
          <Link href="/game" className="text-arena-blue font-bold hover:underline">
            Lihat Semua ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <GameCardLink slug="tebak-gambar" title="Tebak Gambar" emoji="ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“Ãƒâ€šÃ‚Â¼ÃƒÆ’Ã‚Â¯Ãƒâ€šÃ‚Â¸Ãƒâ€šÃ‚Â" color="from-pink-300 to-rose-400" />
          <GameCardLink slug="memory" title="Memory Match" emoji="ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â§Ãƒâ€šÃ‚Â " color="from-cyan-300 to-blue-400" soon />
          <GameCardLink slug="cari-kata" title="Cari Kata" emoji="ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒâ€šÃ‚Â" color="from-yellow-300 to-orange-400" soon />
        </div>

        <div className="bg-white/90 rounded-3xl p-5 md:p-6 border-4 border-arena-gold/40 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold font-playful text-arena-dark">
              ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚ÂÃƒÂ¢Ã¢â€šÂ¬Ã‚Â  Papan Juara
            </h2>
            <Link href="/papan-juara" className="text-arena-blue font-bold hover:underline">
              Lihat Semua ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢
            </Link>
          </div>
          <div className="space-y-2">
            {leaderboard.length === 0 ? (
              <p className="text-gray-500 text-center py-3">
                Belum ada data ranking
              </p>
            ) : (
              leaderboard.map((u, i) => {
                const medal = i === 0 ? "ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¥ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡" : i === 1 ? "ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¥Ãƒâ€¹Ã¢â‚¬Â " : "ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚Â¥ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â°";
                const isMe = u.id === user.id;
                return (
                  <div
                    key={u.id}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl
                      ${isMe ? "bg-arena-gold/30 border-2 border-arena-gold" : "bg-gray-50"}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{medal}</span>
                      <span className={`font-bold ${isMe ? "text-arena-red" : "text-arena-dark"}`}>
                        {u.name} {isMe && "(Kamu)"}
                      </span>
                    </div>
                    <span className="font-bold text-arena-blue">
                      {u.exp.toLocaleString()} EXP
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â© 2025 ArenaBelajar ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â Masuk Arena, Keluar Jadi Juara! ÃƒÆ’Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€šÃ‚ÂÃƒÂ¢Ã¢â€šÂ¬Ã‚Â 
        </p>
      </div>
    </div>
  );
}

function StatBadge({ emoji, value, label }: { emoji: string; value: number; label: string }) {
  return (
    <div className="bg-gradient-to-br from-arena-gold/30 to-arena-red/20 rounded-2xl px-4 py-2 
                    flex items-center gap-2 border-2 border-arena-gold/50 shadow">
      <span className="text-2xl">{emoji}</span>
      <div>
        <div className="font-bold text-lg font-playful text-arena-dark">{value.toLocaleString()}</div>
        <div className="text-xs text-gray-600">{label}</div>
      </div>
    </div>
  );
}

function GameCardLink({ slug, title, emoji, color, soon }: { 
  slug: string; title: string; emoji: string; color: string; soon?: boolean 
}) {
  if (soon) {
    return (
      <div className={`bg-gradient-to-br ${color} opacity-60 rounded-3xl p-5 text-white 
                      border-4 border-white shadow-xl relative`}>
        <div className="absolute top-3 right-3 bg-white text-arena-red px-2 py-0.5 
                        rounded-full text-xs font-bold">
          Segera
        </div>
        <div className="text-5xl mb-2 animate-float">{emoji}</div>
        <div className="font-bold text-lg font-playful">{title}</div>
      </div>
    );
  }

  return (
    <Link href={`/game/${slug}`}>
      <motion.div
        whileHover={{ y: -5 }}
        className={`bg-gradient-to-br ${color} rounded-3xl p-5 text-white 
                    cursor-pointer border-4 border-white shadow-xl`}
      >
        <div className="text-5xl mb-2 animate-float">{emoji}</div>
        <div className="font-bold text-lg font-playful">{title}</div>
        <button className="mt-3 bg-white/30 hover:bg-white/50 px-4 py-1 rounded-full 
                           text-sm font-bold transition">
          Main ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“Ãƒâ€šÃ‚Â¶
        </button>
      </motion.div>
    </Link>
  );
}