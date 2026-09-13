"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

const avatars = [
  { id: "ara", emoji: "🦸", name: "Ara" },
  { id: "kiki", emoji: "🐦", name: "Kiki" },
  { id: "bubu", emoji: "🐻", name: "Bubu" },
  { id: "ciko", emoji: "🐱", name: "Ciko" },
  { id: "momo", emoji: "🐵", name: "Momo" },
  { id: "pipo", emoji: "🐧", name: "Pipo" },
  { id: "nunu", emoji: "🐰", name: "Nunu" },
  { id: "tata", emoji: "🐿️", name: "Tata" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    kelas: "1",
    avatar: "ara",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Gagal mendaftar");
      return;
    }

    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="card-arena max-w-lg w-full"
      >
        <div className="text-center mb-6">
          <div className="text-6xl mb-2 animate-float">✨</div>
          <h1 className="text-3xl font-extrabold text-arena-blue font-playful">
            Daftar Arena
          </h1>
          <p className="text-gray-600 font-fun">
            Isi data & pilih karaktermu!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-bold mb-1 font-fun">Nama Lengkap</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="Contoh: Adik Hebat"
              className="w-full px-4 py-3 rounded-2xl border-4 border-arena-gold/40
                         focus:border-arena-blue focus:outline-none text-lg"
            />
          </div>

          <div>
            <label className="block font-bold mb-1 font-fun">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-2xl border-4 border-arena-gold/40
                         focus:border-arena-blue focus:outline-none text-lg"
            />
          </div>

          <div>
            <label className="block font-bold mb-1 font-fun">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
              placeholder="Minimal 6 karakter"
              className="w-full px-4 py-3 rounded-2xl border-4 border-arena-gold/40
                         focus:border-arena-blue focus:outline-none text-lg"
            />
          </div>

          <div>
            <label className="block font-bold mb-2 font-fun">Pilih Kelas</label>
            <div className="grid grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6].map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setForm({ ...form, kelas: String(k) })}
                  className={`py-3 rounded-2xl font-bold text-lg transition-all ${
                    form.kelas === String(k)
                      ? "bg-arena-red text-white scale-105 shadow-lg"
                      : "bg-arena-gold/20 text-arena-dark hover:bg-arena-gold/40"
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold mb-2 font-fun">Pilih Karakter</label>
            <div className="grid grid-cols-4 gap-2">
              {avatars.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setForm({ ...form, avatar: a.id })}
                  className={`py-3 rounded-2xl transition-all ${
                    form.avatar === a.id
                      ? "bg-arena-blue text-white scale-105 shadow-lg"
                      : "bg-arena-gold/20 hover:bg-arena-gold/40"
                  }`}
                >
                  <div className="text-3xl">{a.emoji}</div>
                  <div className="text-xs font-bold mt-1">{a.name}</div>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border-4 border-red-400 text-red-700
                            px-4 py-2 rounded-2xl font-bold text-center">
              {error}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="btn-blue w-full text-xl py-4 disabled:opacity-60"
          >
            {loading ? "Mendaftar..." : "Daftar Sekarang"}
          </motion.button>
        </form>

        <p className="text-center text-gray-600 mt-5">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-arena-red font-bold hover:underline">
            Masuk Arena
          </Link>
        </p>
      </motion.div>
    </div>
  );
}