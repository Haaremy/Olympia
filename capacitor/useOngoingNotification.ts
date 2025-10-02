import { useEffect, useState, useRef, use } from "react";
import { useSession } from "next-auth/react";
import socket from "../lib/socket";
import {
  startOngoingNotification,
  stopOngoingNotification,
  updateOngoingNotification,
  requestNotificationPermission,
} from "@/capacitor/notificationService";
import { App } from '@capacitor/app';
import { PluginListenerHandle } from "@capacitor/core";

export function useOngoingNotification() {
  const { data: session } = useSession();
  const [started, setStarted] = useState(false);
  const [ending, setEnding] = useState<Date>(new Date());
  const [points, setPoints] = useState(0);
  const [pos, setPos] = useState(0);
  const [isAppInBackground, setIsAppInBackground] = useState(false); // New state to track background status

  const endingRef = useRef(ending);
  const pointsRef = useRef(points);
  const posRef = useRef(pos);

  useEffect(() => {
    endingRef.current = ending;
  }, [ending]);

  useEffect(() => {
    pointsRef.current = points;
  }, [points]);

  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

 

  useEffect(() => {
    const fetchTeamPoints = async () => {
      if (!session?.user?.uname) return;

      try {
        const res = await fetch("/api/scoreboard");
        if (!res.ok) throw new Error("Fehler beim Laden des Teams");

        const data = await res.json(); // <-- await hier!
        let count = 1;
        for (const team of data) {   // <-- for...of, nicht for...in
          count++;
          if (team.uname === session.user.uname) {
            setPoints(team.pointsTotal || 0);
            setPos(count);
            return;
          }
        }

      } catch (err) {
        console.error("Scoreboard konnte nicht geladen werden:", err);
        setPoints(0); // optional Fallback
      }

    };

    fetchTeamPoints(); // Initial fetch
    socket.on("scoreboard", fetchTeamPoints);

    //const intervalId = setInterval(fetchTeamPoints, 60000); // Every 60 seconds

    return () => {
      socket.off("scoreboard", fetchTeamPoints);
      //clearInterval(intervalId); // Cleanup on unmount
    }
  }, [session?.user?.uname]);

  // Load settings once
  useEffect(() => {
    const loadData = async () => {
      try {
        const settingsRes = await fetch("/api/settings");
        if (!settingsRes.ok) throw new Error("Fehler beim Laden der Einstellungen");
        const settings = await settingsRes.json();
        if (settings.ending) setEnding(new Date(settings.ending));
        if (typeof settings.started === "boolean") setStarted(settings.started);
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, [session?.user?.uname]);

  // Notification Intervall (nur einmal starten)
  useEffect(() => {
    requestNotificationPermission();

    const initNotification = async () => {
      try {
        await startOngoingNotification(`Wir laden alle Daten...`);
      } catch (err) {
        console.error(err);
      }
    };

    const triggerUpdate = () =>  {
      updateOngoingNotification(
        `${session ? `Team ${session.user.name}: ${pointsRef.current} Punkte. ${started ? `\nVerbleibende: ${formatTime(endingRef.current.getTime() - Date.now())}` : "\nWarte auf Start..."}` : "Login für Live Daten."}`
      );
    }

    socket.on("scoreboard", triggerUpdate);

    triggerUpdate();
    initNotification();

    return () => {
      socket.off("scoreboard", triggerUpdate);
      void stopOngoingNotification();
    };
  }, [session?.user?.uname]);

   // Monitor visibility change to detect when the app goes into the background
  useEffect(() => {
  let listenerHandle: PluginListenerHandle | null = null;

  (async () => {
    listenerHandle = await App.addListener('appStateChange', ({ isActive }) => {
      if (isActive) {
        setIsAppInBackground(false);
        updateOngoingNotification(
          session 
            ? `Team ${session.user.name}: ${pointsRef.current} Punkte - Platz ${posRef.current} ${started ? `\nVerbleibende: ${formatTime(endingRef.current.getTime() - Date.now())}` : "\nWarte auf Start..."}`
            : "Login für Live Daten."
        );
      } else {
        setIsAppInBackground(true);
        updateOngoingNotification("Kehre zur App zurück, um Updates zu erhalten.");
      }
    });
  })();

  return () => {
    listenerHandle?.remove(); // nun korrekt
  };
  }, [session, points, ending, started]);

  return { started, ending, points, isAppInBackground };
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
