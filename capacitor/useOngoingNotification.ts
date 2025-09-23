import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  startOngoingNotification,
  stopOngoingNotification,
  updateOngoingNotification,
  showPopupNotification,
} from "@/capacitor/notificationService";

export function useOngoingNotification() {
  const { data: session } = useSession();
  const [started, setStarted] = useState(false);
  const [ending, setEnding] = useState<Date>(new Date());



  const endingRef = useRef(ending);

  useEffect(() => { endingRef.current = ending }, [ending]);

  // Load settings once
  useEffect(() => {
    const loadData = async () => {
      try {
        const settingsRes = await fetch("/api/settings");
        if (!settingsRes.ok) throw new Error("Fehler beim Laden der Einstellungen");
        const settings = await settingsRes.json();
        if (settings.ending) setEnding(new Date(settings.ending));
        if (typeof settings.started === "boolean") setStarted(settings.started);

        await showPopupNotification("HoHoHo 🎅🏼", "Live Ticker 👆🏼");
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, [session?.user?.uname]);

  // Notification Intervall (nur einmal starten)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const initNotification = async () => {
      try {
        await startOngoingNotification(
          `Deine Punkte: 0 \n Verbleibend: ${formatTime(
            endingRef.current.getTime() - Date.now()
          )}`
        );

        interval = setInterval(async () => {
          if (!session?.user?.uname) return;

          // Daten abrufen
          const res = await fetch(`/api/team/search?query=${session.user.uname}`);
          if (!res.ok) throw new Error("Fehler beim Laden des Teams");
          const data = await res.json();
          const lpoints = data.team.pointsTotal || 0;

          // Notification aktualisieren
          await updateOngoingNotification(
            `Deine Punkte: ${lpoints} \n Verbleibend: ${formatTime(
              endingRef.current.getTime() - Date.now()
            )}`
          );
        }, 60000);
      } catch (err) {
        console.error(err);
      }
    };

    initNotification();

    return () => {
      clearInterval(interval);
      void stopOngoingNotification();
    };
  }, [session?.user?.uname]);

  return { started, ending, points, userData };
}

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hoursStr = hours > 0 ? `${hours}h ` : "";
  const minutesStr = minutes > 0 || hours > 0 ? `${minutes}m ` : "";

  return `${hoursStr}${minutesStr}`;
}
