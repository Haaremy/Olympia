'use client';

import React, { useState } from "react";

interface CarouselProps {
  images: string[];
  width?: string; // z.B. "w-full"
  height?: string; // z.B. "h-64"
  visible?: number; // Anzahl sichtbarer Bilder
}

const Carousel: React.FC<CarouselProps> = ({
  images,
  width = "w-full",

  visible = 3,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - visible : prevIndex - 1
    );
  };

  const next = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex >= images.length - visible ? 0 : prevIndex + 1
    );
  };

  if (images.length === 0) return null;

  const itemWidth = 100 / visible; // Breite jedes Bildes in %

  return (
    <div className={`relative ${width} h-[64v] overflow-hidden rounded-lg`}>
      {/* Images */}
      <div
        className="flex transition-transform duration-300"
        style={{ transform: `translateX(-${currentIndex * itemWidth}%)` }}
      >
        {images.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`Team Image ${idx + 1}`}
            className={`  m-2`}
            style={{
                width: `${itemWidth}%`,
                height: idx === 2 ? "h-[32v]" : "h-[64v]",
            }}
          />
        ))}
      </div>

      {/* Prev / Next Buttons */}
      <button
        onClick={prev}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow"
      >
        ◀
      </button>
      <button
        onClick={next}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow"
      >
        ▶
      </button>

      {/* Indicators */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`w-2 h-2 rounded-full ${
              idx >= currentIndex && idx < currentIndex + visible
                ? "bg-pink-500"
                : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
