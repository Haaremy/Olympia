"use client";

import { useEffect, useRef } from "react";

export default function Music() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5; // Startlautstärke
      audioRef.current.play().catch((err) => {
        console.warn("Autoplay blockiert. Nutzer muss erst interagieren.", err);
      });
    }
  }, []);

  return (
    <audio
      ref={audioRef}
      src="https://dein-stream-url-hier/stream" // z. B. Icecast/Radio-Stream
      loop
    />
  );
}
