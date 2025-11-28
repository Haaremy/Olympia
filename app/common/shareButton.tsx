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
// 1 Canvas erstellen
const canvas = document.createElement('canvas');
canvas.width = 1080;
canvas.height = 1920;
const ctx = canvas.getContext('2d');
if (!ctx) return;

if (!teamUname) teamUname = "";
console.log(teamUname);

// -----------------------------
// 2 Dynamischer Farbverlauf-Hintergrund (links -> rechts)
// -----------------------------
const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
gradient.addColorStop(0, '#140079'); // Blau links
gradient.addColorStop(1, '#E2001A'); // Rot rechts
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, canvas.width, canvas.height);

// -----------------------------
// 3 Team Bild (1:1, rund, unten rechts)
// -----------------------------
const teamImage = await loadImage(`https://olympia.haaremy.de/uploads/${teamUname.toLowerCase()}.jpg?t=${Date.now()}`);

const overlaySize = 120;

// Mittelpunkt aus dem neuen Paint-Bereich
const cx = 560;
const cy = 595;

// Startpunkt
const posX = cx - overlaySize / 2;
const posY = cy - overlaySize / 2;

// Rundes Bild zeichnen
ctx.save();
ctx.globalAlpha = 0.85;
ctx.beginPath();
ctx.arc(cx, cy, overlaySize / 2, 0, Math.PI * 2);
ctx.closePath();
ctx.clip();

ctx.drawImage(teamImage, posX, posY, overlaySize, overlaySize);
ctx.restore();


// -----------------------------
// 4 Großes Overlay (Titelbild etc. 1920x1080)
// -----------------------------
const largeOverlay = await loadImage(`/images/share.png`);
ctx.drawImage(largeOverlay, 0, 0, canvas.width, canvas.height);



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
