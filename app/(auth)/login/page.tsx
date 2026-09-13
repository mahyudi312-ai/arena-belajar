"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="card-arena max-w-md w-full"
      >
        <div className="text-center mb-6">
          <div className="text-6xl mb-2 animate-bounce-slow">🏟️</div>
          <h1 className="text-3xl font-extrabold text-arena-red font-playful">
            Masuk Arena!
          </h1>
          <p className="text-gray-600 font-fun">
            Siap bertanding jadi juara? 🏆
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-bold text-arena-dark mb-1 font-fun">
              📧 Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="nama@email.com"
              className="w-full px-4 py-3 rounded-2xl border-4 border-arena-gold/40
                         focus:border-arena-red focus:outline-none
                         font-body text-lg transition-colors"
            />
          </div>

          <div>
            <label className="block font-bold text-arena-dark mb-1 font-fun">
              🔒 Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Minimal 6 karakter"
              className="w-full px-4 py-3 rounded-2xl border-4 border-arena-gold/40
                         focus:border-arena-red focus:outline-none
                         font-body text-lg transition-colors"
            />
          </div>

          {error && (
            <div className="bg-red-100 border-4 border-red-400 text-red-700
                            px-4 py-2 rounded-2xl font-bold text-center">
              ⚠️ {error}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="btn-red w-full text-xl py-4 disabled:opacity-60"
          >
            {loading ? "Memuat..." : "Masuk Arena"}
          </motion.button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-1 bg-arena-gold/30 rounded"></div>
          <span className="text-gray-500 font-bold text-sm">atau</span>
          <div className="flex-1 h-1 bg-arena-gold/30 rounded"></div>
        </div>

        <p className="text-center text-gray-600">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="text-arena-blue font-bold hover:underline"
          >
            Daftar Gratis
          </Link>
        </p>

        <div className="mt-5 bg-arena-gold/20 rounded-2xl p-3 text-sm">
          <p className="font-bold text-arena-dark mb-1">Akun Demo:</p>
          <p className="font-mono text-xs">siswa1@demo.com / demo123</p>
        </div>
      </motion.div>
    </div>
  );
}