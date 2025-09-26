"use client";

import { useMusic } from "./MusicContext";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function MusicSettings() {
  const { audioRef, isPlaying, setIsPlaying } = useMusic();
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, audioRef]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true));
    }
  };

  return (
    <div className="mt-4">
      {/* Musiksteuerung */}
      <div className="flex items-center gap-2">
        <Image
          src={`/images/music.svg`} // eigenes Icon hier ablegen
          alt="Music Icon"
          className="h-8 w-8 object-cover rounded-lg"
          width={50}
          height={50}
        />
        <div className="flex flex-1 items-center gap-2">
          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="p-3 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>

          {/* Lautstärke Slider */}
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 accent-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
