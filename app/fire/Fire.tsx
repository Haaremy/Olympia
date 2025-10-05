"use client";

import React from "react";
import Image from "next/image";

export default function Fire() {
  return (
    <div className="relative flex flex-col items-center justify-center select-none pointer-events-none">
      {/* Flammen-GIF */}
      <Image
        alt="Olympisches Feuer"
        width={120}
        height={160}
        src="/images/blue-blueflame.gif"
        className="object-contain animate-flicker drop-shadow-[0_0_20px_rgba(0,200,255,0.6)]"
        priority
      />

      {/* Glüh-Effekt */}
      <div className="absolute bottom-0 w-16 h-4 bg-blue-400 rounded-full blur-xl opacity-40 animate-pulse" />
    </div>
  );
}
