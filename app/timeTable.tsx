"use client";

import React, { useEffect, useRef, useState } from "react";
import { useUI } from "./context/UIContext";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { Capacitor } from "@capacitor/core";
import { Button } from "@cooperateDesign";
import { detectPlatform } from "./common/detectPlatform";

/* -----------------------------------------------------------
   StoreBox Component
----------------------------------------------------------- */

interface StoreBoxProps {
  store: "android" | "ios";
  visible: boolean;
}

interface TimeEvent {
  start: number; // oder Date, falls du Date nutzt
  end: number;
}

const StoreBox: React.FC<StoreBoxProps> = ({ store, visible }) => {
  if (!visible) return null;

  const isAndroid = store === "android";
  const badgeSrc = isAndroid
    ? "/images/googlebadge.png"
    : `/images/appstorebadge.png`;

  const storeUrl = isAndroid
    ? "https://play.google.com/store/apps/details?id=de.haaremy.olympia&pcampaignid=web_share"
    : "https://apps.apple.com/de/app/";

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-2">
        {isAndroid ? "Android Olympia App" : "iOS Olympia App"}
      </h3>

      <div className="w-full max-w-3xl mt-2 flex items-center justify-between p-4 border rounded-lg border-gray-300 dark:border-gray-600 bg-black">
        <div className="flex flex-col">
          <a
            href={storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center"
          >
            <Image
              src={badgeSrc}
              alt={isAndroid ? "Google Play Store Badge" : "Apple App Store Badge"}
              width={150}
              height={60}
              className="hover:scale-105 transition-transform"
            />
          </a>
        </div>

        <div className="flex-shrink-0 ml-4">
          <Image
            src="/images/applogo.png"
            alt="Olympia App Icon"
            width={80}
            height={80}
            className="rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );
};

/* -----------------------------------------------------------
   Modal Component
----------------------------------------------------------- */

interface ModalProps {
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ onClose }) => {
  const { setIsModalOpen } = useUI();
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const [platform, setPlatform] = useState<string>("unknown");
  const [curTime, setCurTime] = useState<number>(0);

  const isNative = Capacitor.isNativePlatform();

  /* Zeit aktualisieren */
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurTime(now.getHours() * 60 + now.getMinutes());
    };

    update();
    const timer = setInterval(update, 20000);
    return () => clearInterval(timer);
  }, []);

  /* Plattform ermitteln */
  useEffect(() => {
    detectPlatform().then(setPlatform);
  }, []);

  /* Modal-Effekte */
  useEffect(() => {
    setIsModalOpen(true);

    modalRef.current?.focus();
    document.body.style.overflow = "hidden";

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.body.style.overflow = "auto";
      setIsModalOpen(false);
    };
  }, [onClose, setIsModalOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (overlayRef.current === e.target) onClose();
  };

  /* Timetable */
  const timetable = [
    { time: "16:00", key: "tt-0", start: 16 * 60, end: 18 * 60 },
    { time: "18:00", key: "tt-1", start: 18 * 60, end: 21 * 60 },
    { time: "20:00", key: "tt-5", start: 20 * 60, end: 20 * 60 + 15 },
    { time: "21:00", key: "tt-2", start: 21 * 60, end: 21 * 60 + 30 },
    { time: "21:30", key: "tt-4", start: 21 * 60 + 30, end: 22 * 60 + 30 },
    { time: "22:30", key: "tt-3", start: 22 * 60 + 30, end: 23 * 60 + 59 },
  ];

  const getEventClass = (ev: TimeEvent) => {
    if (curTime < ev.start) return "text-pink-400 text-md py-1";
    if (curTime >= ev.start && curTime < ev.end)
      return "text-white font-bold text-lg py-2";
    return "text-blue-400 text-sm";
  };

  /* Download Box Logik */
  const showAndroidStore = platform === "Android" && !isNative;
  const showIOSStore = platform === "iPhone" && isNative;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 flex justify-center items-center bg-white/20 dark:bg-black/30 backdrop-blur-sm z-[100]"
      role="dialog"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="bg-white dark:bg-gray-800 truedark:bg-black truedark:text-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[70vh] overflow-hidden flex flex-col m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-semibold">Timetable</h2>

          <Button onClick={onClose} aria-label="Modal schließen">
            X
          </Button>
        </div>

        <div className="overflow-y-auto max-h-[40vh] pr-2">
          <table className="mt-4 table-auto w-full text-left">
            <thead>
              <tr>
                <th className="dark:text-white text-black font-semibold pb-2 pr-8">Zeit</th>
                <th className="dark:text-white text-black font-semibold pb-2">Event</th>
              </tr>
            </thead>
            <tbody>
              {timetable.map((ev, idx) => (
                <tr
                  key={idx}
                  className="border-b dark:border-white/10 border-black/10"
                >
                  <td className="text-black dark:text-white pr-8">{ev.time}</td>
                  <td className={`${getEventClass(ev)} dark:text-white text-black break-words`}>
                    {t(ev.key)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <StoreBox store="android" visible={showAndroidStore} />
          <StoreBox store="ios" visible={showIOSStore} />
        </div>
      </div>
    </div>
  );
};

export default Modal;
