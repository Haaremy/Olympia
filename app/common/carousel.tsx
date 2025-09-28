'use client';

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface CarouselProps {
  images: string[];
  titles: string[];
  width?: string;
  height?: string;
  visible?: number;
  autoPlay?: boolean;
  interval?: number; // Zeit in ms
}

const Carousel: React.FC<CarouselProps> = ({
  images,
  titles,
  width = "w-full",
  height = "h-64",
  visible = 1,
  autoPlay = true,
  interval = 4000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  if (images.length === 0) return null;

  const next = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex >= images.length - visible ? 0 : prevIndex + 1
    );
  };

  const prev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - visible : prevIndex - 1
    );
  };

  // Autoplay
  useEffect(() => {
    if (autoPlay && !paused) {
      autoPlayRef.current = setInterval(next, interval);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [autoPlay, paused, interval]);

  const itemWidth = 100 / visible;

  return (
    <div
      className={`relative ${width} ${height} overflow-hidden rounded-2xl shadow-lg`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Wrapper */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * itemWidth}%)` }}
      >
        {images.map((src, idx) => (
          <div
            key={idx}
            className="relative flex-shrink-0"
            style={{ width: `${itemWidth}%` }}
          >
            <Image
              src={src}
              alt={titles[idx] || `Slide ${idx + 1}`}
              fill
              priority={idx === 0} // Erste Bild sofort laden
              className="object-cover"
            />
            {/* Titel Overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <h2 className="text-lg font-semibold text-white drop-shadow">
                {titles[idx]}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* Prev / Next Buttons */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition"
      >
        ◀
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition"
      >
        ▶
      </button>

      {/* Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            aria-label={`Go to slide ${idx + 1}`}
            onClick={() => setCurrentIndex(idx)}
            className={`w-3 h-3 rounded-full transition ${
              idx >= currentIndex && idx < currentIndex + visible
                ? "bg-pink-500 scale-110"
                : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
