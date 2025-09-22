"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  startOngoingNotification,
  stopOngoingNotification,
  updateOngoingNotification,
  showPopupNotification,
} from "@/capacitor/notificationService";

interface UserData {
  pointsTotal: number;
}

interface Settings {
  started?: boolean;
  ending?: string | Date;
}

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hoursStr = hours > 0 ? `${hours}h ` : "";
  const minutesStr = minutes > 0 || hours > 0 ? `${minutes}m ` : "";
  const secondsStr = `${seconds}s`;

  return `${hoursStr}${minutesStr}${secondsStr}`;
}

export function useOngoingNotification() {
  const { data: session } = useSession();
  const [started, setStarted] = useState(false);
  const [ending, setEnding] = useState<Date>(new Date());
  const [points, setPoints] = useState(0);
  const [userData, setUserData] = useState<UserData>({ pointsTotal: 0 });

  // Load user settings
  useEffect(() => {
    const loadData = async () => {
      try {
        await showPopupNotification("HoHoHo 🎅🏼", "Live Ticker 👆🏼");
        const settingsRes = await fetch("/api/settings");
        if (!settingsRes.ok) throw new Error("Fehler beim Laden der Einstellungen");
        const settings: Settings = await settingsRes.json();
        if (settings.ending) setEnding(new Date(settings.ending));
        if (typeof settings.started === "boolean") setStarted(settings.started);
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, [session?.user?.uname]);

  // Update notification every second
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const updateData = async () => {
      try {
        let lpoints = 0;
        if (session?.user?.uname) {
          const res = await fetch(`/api/team/search?query=${session.user.uname}`);
          if (!res.ok) throw new Error("Fehler beim Laden des Teams");
          const data = await res.json();
          lpoints = data.team.pointsTotal || 0;
          setPoints(lpoints);
          setUserData({ ...data.team, pointsTotal: lpoints });
        }

        await updateOngoingNotification(
          `Deine Punkte: ${lpoints} \n Verbleibend: ${formatTime(
            new Date(ending).getTime() - Date.now()
          )}`
        );
        
      } catch (e) {
        console.error("Fehler bei der Benachrichtigung:", e);
      }
    };

    // Start interval
    interval = setInterval(updateData, 1000); // jede Sekunde

    // Cleanup
    return () => {
      clearInterval(interval);
      void stopOngoingNotification();
    };
  }, [session?.user?.uname, ending]);

  return { started, ending, points, userData };
}
