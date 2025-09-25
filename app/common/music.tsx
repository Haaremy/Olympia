"use client";

import { createContext, useContext, useRef, useState, ReactNode, useEffect } from "react";

type MusicContextType = {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  setIsPlaying: (p: boolean) => void;
};

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Autoplay beim Mount
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5; // Startlautstärke
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) =>
          console.warn(
            "Autoplay blockiert: Der Nutzer muss einmal interagieren",
            err
          )
        );
    }
  }, []);

  return (
    <MusicContext.Provider value={{ audioRef, isPlaying, setIsPlaying }}>
      {/* Audio global */}
      <audio
        ref={audioRef}
        src="https://www.mp3streams.nl/zender/sky-radio-christmas/stream/61-mp3-128"
        loop
      />
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used inside MusicProvider");
  return ctx;
}
