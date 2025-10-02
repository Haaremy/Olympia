'use client';

import React from 'react';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';

export default function ShareButton() {
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

      canvas.width = 800; // Standardbreite
      canvas.height = 600; // Standardhöhe

      // -----------------------------
      // 2️⃣ Hintergrundbild laden und zeichnen
      // -----------------------------
      const bgImage = await loadImage('https://olympia.haaremy.de/uploads/fbins.jpg');
      canvas.width = bgImage.width;
      canvas.height = bgImage.height;
      ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

      // -----------------------------
      // 3️⃣ Text hinzufügen
      // -----------------------------
      ctx.font = '48px sans-serif';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText('Team Olympia', canvas.width / 2, 100);

      // -----------------------------
      // 4️⃣ Overlay-Bild
      // -----------------------------
      const overlay = await loadImage('https://olympia.haaremy.de/images/applogo.png');
      const overlayWidth = 150;
      const overlayHeight = 150;
      ctx.drawImage(
        overlay,
        canvas.width - overlayWidth - 20,
        canvas.height - overlayHeight - 20,
        overlayWidth,
        overlayHeight
      );

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
