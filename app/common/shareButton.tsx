'use client';

import React, { useEffect } from 'react';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Button } from '@/cooperateDesign';
import { useTranslation } from 'next-i18next';
import '../lib/i18n'

type ShareButtonProps = {
  teamUname?: string;
  teamName?: string;
};



// --------------------------
// Word-Wrap Textbox
// --------------------------
export function drawTextBox(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  font: string,
  color: string = "#fff"
) {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textBaseline = "top";

  const words = text.split(" ");
  let line = "";
  let posY = y;

  for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      const testWidth = ctx.measureText(testLine).width;

      if (testWidth > maxWidth && i > 0) {
          ctx.fillText(line, x, posY);
          line = words[i] + " ";
          posY += lineHeight;
      } else {
          line = testLine;
      }
  }

  ctx.fillText(line, x, posY);
}

export default function ShareButton({ teamUname, teamName }: ShareButtonProps) {

  const { t } = useTranslation();

  // Schrift laden
  useEffect(() => {
    const loadFont = async () => {
      const font = new FontFace("RubicBold", "url(/fonts/rubic/extrabold.ttf)");
      await font.load();
      document.fonts.add(font);
    };
    loadFont();
  }, []);

  // ---------------------------------------------------------
  // SHARE BUTTON HANDLER
  // ---------------------------------------------------------
  const handleShare = async () => {
    try {
      // Bild laden Helper
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
      // -----------------------------
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (!teamUname) teamUname = "";

      // -----------------------------
      // 2 Hintergrund Farbverlauf
      // -----------------------------
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, '#140079');
      gradient.addColorStop(1, '#E2001A');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // -----------------------------
      // 3 Team Bild rund
      // -----------------------------
      const teamImage = await loadImage(`https://olympia.haaremy.de/uploads/${teamUname.toLowerCase()}.jpg?t=${Date.now()}`);

      const overlaySize = 780;
      const cx = 560;
      const cy = 595;

      const posX = cx - overlaySize / 2;
      const posY = cy - overlaySize / 2;

      ctx.save();
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.arc(cx, cy, overlaySize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(teamImage, posX, posY, overlaySize, overlaySize);
      ctx.restore();

      // -----------------------------
      // 4 Overlay Bild
      // -----------------------------
      const largeOverlay = await loadImage(`/images/sharenotext.png`);
      ctx.drawImage(largeOverlay, 0, 0, canvas.width, canvas.height);

      // -----------------------------
      // 5 Texte (mit Word-Wrap)
      // -----------------------------
      
      

      
      const insta = "@Instagram";
      drawTextBox(ctx, insta, canvas.width / 4 - 200 , 30, 500, 50, "60px RubicBold");

      drawTextBox(ctx, t("shareTeam"), canvas.width / 4 - 200, 1200, 400, 60, "80px RubicBold");
      if(!teamName) teamName = "";
      drawTextBox(ctx, teamName, canvas.width / 4 - 200, 1000, 700, 90, "50px RubicBold");
      
      ctx.fillStyle = "#000000";
      drawTextBox(ctx, t("shareTitle"), canvas.width / 2, 1450, 1100, 60, "60px RubicBold");
      drawTextBox(ctx, t("shareSubtitle"), canvas.width / 2 - 400, 1310, 800, 90, "80px RubicBold");

      

     

      // -----------------------------
      // 6 Canvas → Blob → Base64
      // -----------------------------
      const blob: Blob = await new Promise((resolve) =>
        canvas.toBlob((b) => b && resolve(b), "image/png")
      );

      const arrayBuffer = await blob.arrayBuffer();
      const base64Data = btoa(
        new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      // -----------------------------
      // 7 Datei im Cache speichern
      // -----------------------------
      const file = await Filesystem.writeFile({
        path: "share-image.png",
        data: base64Data,
        directory: Directory.Cache,
      });

      // -----------------------------
      // 8 Share Dialog öffnen
      // -----------------------------
      await Share.share({
        title: "Olympia @ HS Anhalt",
        text: "Christmas regards from the faculty of Computer Science.",
        files: [file.uri],
        dialogTitle: "Share with friends",
      });

    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <Button onClick={handleShare}>
      Share
    </Button>
  );
}
