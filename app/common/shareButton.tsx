'use client';

import React from 'react';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Button } from '@/cooperateDesign';



type ShareButtonProps = {
  teamUname?: string; // optional username for fetching server image
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
const canvas = document.createElement('canvas');
canvas.width = 1080;
canvas.height = 1920;
const ctx = canvas.getContext('2d');
if (!ctx) return;

if (!teamUname) teamUname = "";
console.log(teamUname);

// -----------------------------
// 2️⃣ Dynamischer Farbverlauf-Hintergrund
// -----------------------------
const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
gradient.addColorStop(0, '#1E3A8A'); // Blau oben
gradient.addColorStop(1, '#DC2626'); // Rot unten
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, canvas.width, canvas.height);

// -----------------------------
// 3️⃣ Hintergrundbild unten drapieren (proportional, leicht transparent)
// -----------------------------
const bgImage = await loadImage(`https://olympia.haaremy.de/uploads/${teamUname.toLowerCase()}.jpg?t=${Date.now()}`);
const bgWidth = canvas.width;
const bgHeight = bgImage.height * (canvas.width / bgImage.width);
const bgY = canvas.height - bgHeight;
ctx.globalAlpha = 0.7; // leicht transparent für coolen Look
ctx.drawImage(bgImage, 0, bgY, bgWidth, bgHeight);
ctx.globalAlpha = 1; // zurücksetzen

// -----------------------------
// 4️⃣ Überschrift oben mit Shadow/Glow
// -----------------------------
ctx.font = 'bold 80px "Helvetica Neue", sans-serif';
ctx.fillStyle = '#FFFFFF';
ctx.textAlign = 'center';
ctx.shadowColor = 'rgba(0,0,0,0.5)';
ctx.shadowBlur = 10;
ctx.fillText('Team Olympia', canvas.width / 2, 120);
ctx.shadowBlur = 0; // Shadow zurücksetzen

// -----------------------------
// 5️⃣ Overlay-Bild (unten rechts, halbtransparent)
// -----------------------------
const overlay = await loadImage('https://olympia.haaremy.de/images/applogo.png');
const overlayWidth = 120;
const overlayHeight = 120;
ctx.globalAlpha = 0.85; // leicht transparentes Overlay
ctx.drawImage(
  overlay,
  canvas.width - overlayWidth - 40,
  canvas.height - overlayHeight - 40,
  overlayWidth,
  overlayHeight
);
ctx.globalAlpha = 1;

// -----------------------------
// 6️⃣ Optional: abgerundete Ecken
// -----------------------------
const radius = 40;
ctx.globalCompositeOperation = 'destination-in';
ctx.beginPath();
ctx.moveTo(radius, 0);
ctx.lineTo(canvas.width - radius, 0);
ctx.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
ctx.lineTo(canvas.width, canvas.height - radius);
ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height);
ctx.lineTo(radius, canvas.height);
ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
ctx.lineTo(0, radius);
ctx.quadraticCurveTo(0, 0, radius, 0);
ctx.closePath();
ctx.fill();
ctx.globalCompositeOperation = 'source-over';


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
    <Button
      onClick={handleShare}
    >
      Share
    </Button>
  );
}
