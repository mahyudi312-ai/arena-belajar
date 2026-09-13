import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import MusicPlayer from "@/components/MusicPlayer";

export const metadata: Metadata = {
  title: "ArenaBelajar — Masuk Arena, Keluar Jadi Juara!",
  description: "Platform belajar seru untuk anak SD kelas 1-6.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-arena-pattern min-h-screen">
        <Providers>
          <MusicPlayer />
          {children}
        </Providers>
      </body>
    </html>
  );
}