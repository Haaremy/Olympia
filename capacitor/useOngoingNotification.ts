"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { App } from "@capacitor/app";
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

  // Load user data + settings
  useEffect(() => {
    const loadData = async () => {
      try {
        if (session?.user?.uname) {
          const res = await fetch(`/api/team/search?query=${session.user.uname}`);
          if (!res.ok) throw new Error("Fehler beim Laden des Teams");
          const data = await res.json();
          setUserData({
            ...data.team,
            pointsTotal: data.team.pointsTotal,
          });
          setPoints(data.team.pointsTotal);
        }

        const settingsRes = await fetch("/api/settings");
        if (!settingsRes.ok) throw new Error("Fehler beim Laden der Einstellungen");
        const settings: Settings = await settingsRes.json();
        if (settings.ending) setEnding(new Date(settings.ending));
        if (typeof settings.started === "boolean") setStarted(settings.started);
      } catch (err) {
        console.error(err);
      }
    };

    loadData(); // ✅ async Funktion aufrufen
  }, [session?.user?.uname]);

  // Manage ongoing notification
  useEffect(() => {
    let listener: { remove: () => void } | null = null;

    const init = async () => {
      try {
        await startOngoingNotification("Die App ist aktiv");

        listener = await App.addListener("appStateChange", async (state) => {
          if (state.isActive) {
            await showPopupNotification("HoHoHo 🎅🏼", "Live Ticker 👆🏼");
            await updateOngoingNotification(
              `Deine Punkte: ${points} und noch ${formatTime(
                new Date(ending).getTime() - Date.now()
              )}`
            );
          } else {
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
  }, [points, ending]);

  return { started, ending, points, userData };
}
