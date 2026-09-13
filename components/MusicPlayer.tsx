"use client";
import { useEffect, useRef, useState } from "react";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.3;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setShowHint(false);
        })
        .catch(() => {
          setIsPlaying(false);
          setShowHint(true);
        });
    }
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
      setShowHint(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/sounds/background.mp3" loop />

      <button
        onClick={toggleMusic}
        className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur
                   w-14 h-14 rounded-full shadow-xl border-4 border-arena-gold
                   flex items-center justify-center text-2xl
                   hover:scale-110 active:scale-95 transition-all"
        title={isPlaying ? "Matikan musik" : "Nyalakan musik"}
      >
        {isPlaying ? "🔊" : "🔇"}
      </button>

      {showHint && (
        <div className="fixed top-20 right-4 z-50 bg-arena-gold text-arena-dark
                        px-4 py-2 rounded-2xl shadow-xl border-4 border-white
                        font-bold text-sm max-w-xs animate-bounce-slow">
          🎵 Klik tombol di atas untuk nyalakan musik!
        </div>
      )}
    </>
  );
}
