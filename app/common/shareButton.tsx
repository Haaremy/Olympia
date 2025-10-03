'use client';

import React from 'react';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';



type ShareButtonProps = {
  teamUname?: string || ""; // optional username for fetching server image
};

export default function ShareButton({ teamUname }: ShareButtonProps) {
  const handleShare = async () => {
    try {
      // -----------------------------
      // Hilfsfunktion: Bild laden
      // -----------------------------
      const loadImage = (src: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = src;
          img.onload = () => resolve(img);
          img.onerror = reject;
        });

      // -----------------------------
// 1️⃣ Canvas erstellen
// -----------------------------
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
if (!ctx) return;
console.log(teamUname);
canvas.width = 1080;
canvas.height = 1920;

// -----------------------------
// 2️⃣ Farbverlauf-Hintergrund (blau → rot)
// -----------------------------
const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
gradient.addColorStop(0, '#1E3A8A'); // Blau oben
gradient.addColorStop(1, '#DC2626'); // Rot unten
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, canvas.width, canvas.height);

// -----------------------------
// 3️⃣ Hintergrundbild unten drapieren
// -----------------------------
const bgImage = await loadImage(`https://olympia.haaremy.de/uploads/${teamUname.toLowerCase()}.jpg`);
const bgWidth = canvas.width;
const bgHeight = bgImage.height * (canvas.width / bgImage.width); // proportional skalieren
const bgY = canvas.height - bgHeight - 0; // unten
ctx.drawImage(bgImage, 0, bgY, bgWidth, bgHeight);

// -----------------------------
// 4️⃣ Text oben in Weiß
// -----------------------------
ctx.font = '64px sans-serif';
ctx.fillStyle = 'white';
ctx.textAlign = 'center';
ctx.fillText('Team Olympia', canvas.width / 2, 100);

// -----------------------------
// 5️⃣ Overlay-Bild (unten rechts oder unter Überschrift)
// -----------------------------
const overlay = await loadImage('https://olympia.haaremy.de/images/applogo.png');
const overlayWidth = 100;
const overlayHeight = 100;

// Option A: unten rechts
ctx.drawImage(
  overlay,
  canvas.width - overlayWidth - 20,
  canvas.height - overlayHeight - 20,
  overlayWidth,
  overlayHeight
);

// Option B: unter Überschrift (auskommentieren, falls du A bevorzugst)
// ctx.drawImage(
//   overlay,
//   canvas.width / 2 - overlayWidth / 2,
//   120, // etwas unter die Überschrift
//   overlayWidth,
//   overlayHeight
// );

      // -----------------------------
      // 5️⃣ Canvas zu Blob → Base64
      // -----------------------------
      const blob: Blob = await new Promise((resolve) =>
        canvas.toBlob((b) => b && resolve(b), 'image/png')
      );

      const arrayBuffer = await blob.arrayBuffer();
      const base64Data = btoa(
        new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      // -----------------------------
      // 6️⃣ Blob als Datei im Cache speichern
      // -----------------------------
      const file = await Filesystem.writeFile({
        path: 'share-image.png',
        data: base64Data,
        directory: Directory.Cache,
      });

      // -----------------------------
      // 7️⃣ Share starten
      // -----------------------------
      await Share.share({
        title: 'Olympia @ HS Anhalt',
        text: 'Christmas regards from the faculty of Computer Science.',
        files: [file.uri],
        dialogTitle: 'Share with friends',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="px-4 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700"
    >
      Share
    </button>
  );
}
