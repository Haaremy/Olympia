'use client';

import React, { useState } from "react";
import Image from "next/image";

interface CarouselProps {
  images: string[];
  titles: string[];
  width?: string; // z.B. "w-full"
  height?: string; // z.B. "h-64"
  visible?: number; // Anzahl sichtbarer Bilder
}

const Carousel: React.FC<CarouselProps> = ({
  images,
  width = "w-full",
  titles,
  visible = 1,
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
          <div key={idx} style={{ position: 'relative' }}>
            <Image
                src={src}     // relativer Pfad im 'public'-Ordner oder remote URL
                alt="Team Image"    // Alternativtext
                width={300}           // erforderliche Breite in Pixeln (Number)
                height={200}          // erforderliche Höhe in Pixeln (Number)
                className="m-2"
              />
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black to-transparent text-white">
              <h2 className="text-xl font-semibold">{titles[idx]}</h2>
            </div>
          </div>
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
