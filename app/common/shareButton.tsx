'use client';
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

      // Hintergrundbild laden
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.src = 'https://olympia.haaremy.de/uploads/fbins.jpg';

      image.onload = () => {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        // Text hinzufügen
        ctx.font = '48px sans-serif';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText('Team Olympia', canvas.width / 2, 100);

        // Canvas zu Data URL
        const dataUrl = canvas.toDataURL('image/png');

        // Web Share API nutzen
        if (navigator.share) {
          navigator.share({
            title: 'Team Olympia',
            text: 'Hier sind die Punkte!',
            url: dataUrl, // funktioniert nur in Browsern mit Web Share Unterstützung
          }).catch(console.error);
        } else {
          // Fallback: Bild herunterladen
          const a = document.createElement('a');
          a.href = dataUrl;
          a.download = 'team-olympia.png';
          a.click();
        }
      };
    } catch (err) {
      console.error('Error sharing:', err);
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
