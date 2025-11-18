"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useUI } from './context/UIContext';
import { useTranslation } from 'react-i18next';
import { detectPlatform } from './common/detectPlatform';
import Image from "next/image";
import { Capacitor } from '@capacitor/core';
import { Button } from '@cooperateDesign';  



interface ModalProps {
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ onClose }) => {
    const { setIsModalOpen } = useUI();
    const [platform, setPlatform] = useState("");
    const [isAndroid, setIsAndroid] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();  // Hook innerhalb der Komponente verwenden
    const hour = new Date().getHours();
    const min = new Date().getMinutes();
    const curTime = hour*60+min;


    useEffect(() => {
        detectPlatform().then(setPlatform);
        
        setIsAndroid(Capacitor.getPlatform() === 'android');
        setIsIOS(Capacitor.getPlatform() === "ios");
  
        const modal = modalRef.current;
        setIsModalOpen(true);

        // Fokus auf das Modal setzen
        if (modal) {
            modal.focus();
        }

        // Scrollen im Hintergrund deaktivieren
        document.body.style.overflow = 'hidden';

        // Escape-Taste zum Schließen des Modals
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        // Cleanup: Entfernen des Event Listeners und Aktivieren des Scrollens
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            setIsModalOpen(false);

            // Scrollen wieder aktivieren, wenn das Modal geschlossen wird
            document.body.style.overflow = 'auto';
        };
    }, [onClose, setIsModalOpen]);


    // Close modal if clicked outside of modal content
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (overlayRef.current === e.target) {
            onClose();
        }
    };


    const timetable = [
  { time: "16:00", key: "tt-0", start: 16*60, end: 18*60 },
  { time: "18:00", key: "tt-1", start: 18*60, end: 21*60 },
  { time: "20:00", key: "tt-5", start: 20*60, end: 20*60+15 },
  { time: "21:00", key: "tt-2", start: 21*60, end: 21*60+30 },
  { time: "21:30", key: "tt-4", start: 21*60+30, end: 22*60+30 },
  { time: "22:30", key: "tt-3", start: 22*60+30, end: 23*60+59 },
];

const getEventClass = (event: {start: number, end: number}) => {
  if (curTime < event.start) return "text-pink-500 text-md py-1";
  if (curTime >= event.start && curTime < event.end) return "text-white-500 text-lg py-4";
  return "text-blue-500 text-sm";
};


    return (
        <div 
            ref={overlayRef}
            id="modal"
            tabIndex={-1}  // Fokus auf das Modal setzen
            className="fixed inset-0 flex justify-center items-center bg-white/20 dark:bg-black/30 truedark:bg-black/50 backdrop-blur-sm z-100"
            role="dialog"
            aria-labelledby="modal-title"
            aria-hidden="false"
            onClick={handleOverlayClick} // Close modal on overlay click
          >
            <div
                ref={modalRef}
                className="truedark:border truedark:border-white bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 truedark:bg-black truedark:text-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[70vh] overflow-hidden flex flex-col m-4"
                onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside modal
                aria-labelledby="modal-title"
            >
                {/* Modal Header (Icon + Title + Close Button) */}
                <div className="flex justify-between items-center mb-4 ">
                    <h2 className="flex items-center text-3xl text-white-500">
                        Timetable
                    </h2>
                    
                    <Button
                        onClick={onClose}
                        aria-label="Modal schließen"
                    >
                        X
                    </Button>
                </div>
 
                {/* Ist event Zeit : vor nächstem event Zeit : nach Event Zeit*/ }
                <div className="overflow-y-auto max-h-[40vh] pr-2">
                <table className="mt-4 table-auto w-full max-w-md text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="text-white font-semibold pb-2 pr-8">Zeit</th>
                      <th className="text-white font-semibold pb-2">Event</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timetable.map((ev, idx) => (
                      <tr key={idx} className="border-b dark:border-white/10 border-black/10 truedark:border-white/10">
                        <td className="text-black dark:text-white pr-8">{ev.time}</td>
                        <td className={`${getEventClass(ev)} break-words whitespace-normal`}>
                          {t(ev.key)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div>
                <h3 className={` mt-8 ${
                    platform === "Android" ? (isAndroid ? "hidden" : "block" ): "hidden"
                  }`}>Playstore Olympia App</h3>
                      <div
                  className={`w-full max-w-3xl mt-2 flex items-center justify-between p-4 border rounded-lg border-gray-300 dark:border-gray-600 transition bg-black ${
                    platform === "Android" ? (isAndroid ? "hidden" : "block" ): "hidden"
                  }`}
                >
                  
                  {/* Linker Bereich mit Titel + Badge */}
                  <div className="flex flex-col">
                
                    <a
                      href="https://play.google.com/store/apps/details?id=de.haaremy.olympia&pcampaignid=web_share"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center"
                    >
                      <Image
                        src={`/images/googlebadge.png`}
                        alt="Google Play Store Badge"
                        width={150}
                        height={60}
                        className="hover:scale-105 transition-transform"
                      />
                    </a>
                  </div>
                
                  {/* Rechter Bereich mit App-Icon */}
                  <div className="flex-shrink-0 ml-4">
                    <Image
                      src={`/images/applogo.png`}
                      alt="Olympia App Icon"
                      width={80}
                      height={80}
                      className="rounded-lg shadow-md"
                    />
                  </div>
                </div>
              </div>
                
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useUI } from "./context/UIContext";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { Capacitor } from "@capacitor/core";
import { Button } from "@cooperateDesign";
import { detectPlatform } from "./common/detectPlatform";

/* -----------------------------------------------------------
   StoreBox-Komponente (DRY)
----------------------------------------------------------- */

interface StoreBoxProps {
  store: "android" | "ios";
  visible: boolean;
}

const StoreBox: React.FC<StoreBoxProps> = ({ store, visible }) => {
  if (!visible) return null;

  const isAndroid = store === "android";
  const badgeSrc = isAndroid ? "/images/googlebadge.png" : "/images/appstorebadge.png";
  const storeUrl = isAndroid
    ? "https://play.google.com/store/apps/details?id=de.haaremy.olympia&pcampaignid=web_share"
    : "https://apps.apple.com/de/app/..."; // <-- Bitte hier iOS App ID eintragen!

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-2">
        {isAndroid ? "Android Olympia App" : "iOS Olympia App"}
      </h3>

      <div className="w-full max-w-3xl mt-2 flex items-center justify-between p-4 border rounded-lg border-gray-300 dark:border-gray-600 bg-black">
        {/* Badge */}
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

        {/* App Icon */}
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
   Modal Hauptkomponente
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

  /* -----------------------------------------------------------
     Zeit-Update alle 20s
  ----------------------------------------------------------- */

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurTime(now.getHours() * 60 + now.getMinutes());
    };

    update();
    const timer = setInterval(update, 20 * 1000);
    return () => clearInterval(timer);
  }, []);

  /* -----------------------------------------------------------
     Plattform-Detect
  ----------------------------------------------------------- */
  useEffect(() => {
    detectPlatform().then(setPlatform);
  }, []);

  /* -----------------------------------------------------------
     Modal Effekte
  ----------------------------------------------------------- */
  useEffect(() => {
    setIsModalOpen(true);
    const modalEl = modalRef.current;

    // Fokus setzen
    modalEl?.focus();

    // Scrolling deaktivieren
    document.body.style.overflow = "hidden";

    // ESC schließen
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
      setIsModalOpen(false);
    };
  }, [onClose, setIsModalOpen]);

  /* -----------------------------------------------------------
     Overlay-Klick
  ----------------------------------------------------------- */

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (overlayRef.current === e.target) onClose();
  };

  /* -----------------------------------------------------------
     Timetable
  ----------------------------------------------------------- */

  const timetable = [
    { time: "16:00", key: "tt-0", start: 16 * 60, end: 18 * 60 },
    { time: "18:00", key: "tt-1", start: 18 * 60, end: 21 * 60 },
    { time: "20:00", key: "tt-5", start: 20 * 60, end: 20 * 60 + 15 },
    { time: "21:00", key: "tt-2", start: 21 * 60, end: 21 * 60 + 30 },
    { time: "21:30", key: "tt-4", start: 21 * 60 + 30, end: 22 * 60 + 30 },
    { time: "22:30", key: "tt-3", start: 22 * 60 + 30, end: 23 * 60 + 59 },
  ];

  const getEventClass = (ev: any) => {
    if (curTime < ev.start)
      return "text-pink-400 text-md py-1";
    if (curTime >= ev.start && curTime < ev.end)
      return "text-white font-bold text-lg py-2";
    return "text-blue-400 text-sm";
  };

  /* -----------------------------------------------------------
     Sichtbarkeit der StoreBoxen
  ----------------------------------------------------------- */

  const showAndroidStore = platform === "Android" && !isNative;
  const showIOSStore = platform === "iPhone" && isNative;

  /* -----------------------------------------------------------
     Render
  ----------------------------------------------------------- */

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
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-semibold">Timetable</h2>

          <Button onClick={onClose} aria-label="Modal schließen">
            X
          </Button>
        </div>

        {/* Inhalt */}
        <div className="overflow-y-auto max-h-[40vh] pr-2">
          {/* Tabelle */}
          <table className="mt-4 table-auto w-full text-left">
            <thead>
              <tr>
                <th className="text-white font-semibold pb-2 pr-8">Zeit</th>
                <th className="text-white font-semibold pb-2">Event</th>
              </tr>
            </thead>

            <tbody>
              {timetable.map((ev, idx) => (
                <tr
                  key={idx}
                  className="border-b dark:border-white/10 border-black/10"
                >
                  <td className="text-black dark:text-white pr-8">{ev.time}</td>
                  <td className={`${getEventClass(ev)} break-words`}>
                    {t(ev.key)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* App Download Boxen */}
          <StoreBox store="android" visible={showAndroidStore} />
          <StoreBox store="ios" visible={showIOSStore} />
        </div>
      </div>
    </div>
  );
};

export default Modal;                   className="hover:scale-105 transition-transform"
                      />
                    </a>
                  </div>
                
                  {/* Rechter Bereich mit App-Icon */}
                  <div className="flex-shrink-0 ml-4">
                    <Image
                      src={`/images/applogo.png`}
                      alt="Olympia App Icon"
                      width={80}
                      height={80}
                      className="rounded-lg shadow-md"
                    />
                  </div>
                </div>
              </div>
                </div>
                
                </div>
            </div>
        </div>
    );
};

export default Modal;
