'use client';

import { Share } from '@capacitor/share';
import React from 'react';

export default function ShareButton() {
  const handleShare = async () => {
    try {
      // 1️⃣ Canvas erstellen
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Größe definieren
      canvas.width = 800;
      canvas.height = 600;

      // 2️⃣ Hintergrundbild laden
      const image = new Image();
      image.crossOrigin = 'anonymous'; // falls externes Bild
      image.src = 'https://olympia.haaremy.de/uploads/fbins.jpg';

      image.onload = async () => {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        // 3️⃣ Text oder Overlay hinzufügen
        ctx.font = '48px sans-serif';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText('Team Olympia', canvas.width / 2, 100);

        // Optional: weiteres Overlay-Bild
        const overlay = new Image();
        overlay.src = 'https://olympia.haaremy.de/images/applogo.png';
        overlay.onload = async () => {
          ctx.drawImage(overlay, canvas.width - 200, canvas.height - 200, 150, 150);

          // 4️⃣ Canvas zu Blob konvertieren
          canvas.toBlob(async (blob) => {
            if (!blob) return;
            const blobUrl = URL.createObjectURL(blob);

            // 5️⃣ Share mit Capacitor
            await Share.share({
              title: 'Check this out!',
              text: 'This is some awesome content from my app.',
              url: blobUrl,
              dialogTitle: 'Share with Santa',
            });
          });
        };
      };
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
