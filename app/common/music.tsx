"use client";

import { createContext, useContext, useRef, useState, ReactNode } from "react";

type MusicContextType = {
  audioRef: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  setIsPlaying: (p: boolean) => void;
};

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <MusicContext.Provider value={{ audioRef, isPlaying, setIsPlaying }}>
      {/* Audio wird global bereitgestellt */}
      <audio ref={audioRef} src="https://www.mp3streams.nl/zender/sky-radio-christmas/stream/61-mp3-128" loop />
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used inside MusicProvider");
  return ctx;
}
