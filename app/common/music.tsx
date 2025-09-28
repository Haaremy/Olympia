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
  const [volume, setVolume] = useState(0);

  // Autoplay beim Mount
   useEffect(() => {
     
    if (audioRef.current) {
      if(localStorage.getItem("musicPlay") === "playing"){
        audioRef.current.play().then(() => setIsPlaying(true));
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      const saVol = localStorage.getItem("musicVolume");
      setVolume(saVol ? parseFloat(saVol) : 0.5);
      audioRef.current.volume = saVol ? parseFloat(saVol) : volume;
    }
  }, [volume, audioRef]);

  return (
    <MusicContext.Provider value={{ audioRef, isPlaying, setIsPlaying }}>
      {/* Audio global */}
      <audio
        ref={audioRef}
        src="https://music.haaremy.de/stream"
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
