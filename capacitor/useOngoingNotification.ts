"use client";
import { useEffect, useState } from "react";
import { useSession} from "next-auth/react";
import { App } from "@capacitor/app";
import {
  startOngoingNotification,
  stopOngoingNotification,
  updateOngoingNotification,
  showPopupNotification
} from "@/capacitor/notificationService";

const [started, setStarted] = useState(false);
const [ending, setEnding] = useState<Date>(new Date());
const [points, setPoints] = useState(0);
 const [userData, setUserData] = useState({
  pointsTotal: 0,
});

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hoursStr = hours > 0 ? `${hours}h ` : '';
  const minutesStr = minutes > 0 || hours > 0 ? `${minutes}m ` : '';
  const secondsStr = `${seconds}s`;


  return `${hoursStr}${minutesStr}${secondsStr}`;
};

useEffect(() => {
   const res = await fetch(`/api/team/search?query=${session?.user.uname}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    }); 
    const data = await res.json();
     
  fetch("/api/settings")
      .then((res) => {
        if (!res.ok) throw new Error("Fehler beim Laden der Einstellungen");
        return res.json();
      })
      .then((data: Settings) => {
        if (data.ending) setEnding(data.ending);
        if (typeof data.started === "boolean") setStarted(data.started);
      })
  
}

export function useOngoingNotification() {
  useEffect(() => {
    let listener: { remove: () => void } | null = null;
    const init = async () => {
      try {
        // Ongoing-Notification beim Start anzeigen
        await startOngoingNotification("Die App ist aktiv");

        // Listener für App-State-Änderungen
        listener = await App.addListener("appStateChange", async (state) => {
          if (state.isActive) {
            // Popup nur anzeigen, wenn App wieder aktiv wird
            await showPopupNotification("HoHoHo 🎅🏼", "Live Ticker 👆🏼");
            // Optional: Ongoing-Notification aktualisieren
            await updateOngoingNotification(`Deine Punkte: ${points} und noch ${formatTime(new Date(ending).getTime() - Date.now())}`);
          } else {
            // Optional: Ongoing-Notification aktualisieren
            await updateOngoingNotification("App im Hintergrund");
          }
        });
      } catch (e) {
        console.error("Fehler bei der Benachrichtigung:", e);
      }
    };
    init();
    return () => {
      if (listener) listener.remove();
      void stopOngoingNotification();
    };
  }, []);
}
