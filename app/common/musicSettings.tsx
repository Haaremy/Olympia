"use client";

import { useMusic } from "./music";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function MusicSettings() {
  const { audioRef, isPlaying, setIsPlaying } = useMusic();
  const [volume, setVolume] = useState(0);

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

  const handleVolume = (e : number) => {
      localStorage.setItem("musicVolume", (e).toString());
      setVolume(e);
  }

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      localStorage.setItem("musicPlay", "stopped");
    } else {
      localStorage.setItem("musicPlay", "playing");
      audioRef.current.play().then(() => setIsPlaying(true));
    }
  };

  return (
    <div className="mt-4">
      {/* Musiksteuerung */}
      <div className="flex items-center gap-2">
        <div className="flex flex-1 items-center gap-4">
          {/* Play/Pause */}
           
          
            {isPlaying ?
              <Image
                src="/images/settingspause.svg"
                alt="Admin"
                width={24}
                height={24}
                className="dark:invert truedark:invert invert-0"
                onClick={togglePlay}
              />
             : 
              <Image
                src="/images/settingsplay.svg"
                alt="Admin"
                width={24}
                height={24}
                className="dark:invert truedark:invert invert-0"
                onClick={togglePlay}
              />
              }

          {/* Lautstärke Slider */}
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => handleVolume(parseFloat(e.target.value))}
            className="flex-1 accent-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
