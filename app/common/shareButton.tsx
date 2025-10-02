'use client';

import { Share } from '@capacitor/share';
import React from 'react';

export default function ShareButton() {
  const handleShare = async () => {
    try {
      // Canvas erstellen
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = 800;
      canvas.height = 600;

      // Bilder laden als Promise
      const loadImage = (src: string) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = src;
          img.onload = () => resolve(img);
          img.onerror = reject;
        });

      const bg = await loadImage('https://olympia.haaremy.de/uploads/fbins.jpg');
      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

      const overlay = await loadImage('https://olympia.haaremy.de/images/applogo.png');
      ctx.drawImage(overlay, canvas.width - 200, canvas.height - 200, 150, 150);

      // Text hinzufügen
      ctx.font = '48px sans-serif';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText('Team Olympia', canvas.width / 2, 100);

      // Canvas zu Blob
      const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) return;

      // Temporäre URL für Share
      const blobUrl = URL.createObjectURL(blob);

      // Share ausführen
      await Share.share({
        title: 'Team Olympia',
        text: 'Hier sind die Punkte!',
        url: blobUrl,
        dialogTitle: 'Share with friends',
      });

      // Aufräumen
      URL.revokeObjectURL(blobUrl);
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
