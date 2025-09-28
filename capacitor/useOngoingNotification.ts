import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  startOngoingNotification,
  stopOngoingNotification,
  updateOngoingNotification,
  showPopupNotification,
  requestNotificationPermission
} from "@/capacitor/notificationService";

export function useOngoingNotification() {
  const { data: session } = useSession();
  const [started, setStarted] = useState(false);
  const [ending, setEnding] = useState<Date>(new Date());
  const [points, setPoints] = useState(0);



  const endingRef = useRef(ending);

  useEffect(() => { endingRef.current = ending }, [ending]);

  
const pointsRef = useRef(points);
useEffect(() => {
  pointsRef.current = points;
}, [points]);


  useEffect(() => {
  const fetchTeamPoints = async () => {
    if (!session?.user?.uname) return;

    try {
      const res = await fetch(`/api/team/search?query=${session.user.uname}`);
      if (!res.ok) throw new Error("Fehler beim Laden des Teams");

      const data = await res.json();
      setPoints(data.team.pointsTotal || 0);
    } catch (error) {
      console.error("Fehler beim Abrufen der Punkte:", error);
    }
  };

  fetchTeamPoints(); // Initial fetch

  const intervalId = setInterval(fetchTeamPoints, 60000); // Every 60 seconds

  return () => clearInterval(intervalId); // Cleanup on unmount
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
    let interval: ReturnType<typeof setInterval>;
    requestNotificationPermission();


    const initNotification = async () => {
      try {
        await showPopupNotification(
          "Notification Service gestartet", "Wir werden dich über deine Punkte und die verbleibende Zeit informieren."
        );
        await startOngoingNotification(
          `Wir laden alle Daten...`
        );

        interval = setInterval(async () => {
          

          // Notification aktualisieren
          await updateOngoingNotification(
            `Team ${session ? `${session.user.name}: ${pointsRef.current} Punkte. ${started ? `\nVerbleibende: ${formatTime(endingRef.current.getTime() - Date.now())}` : "\nWarte auf Start..."}` : ""}`
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

  return { started, ending, points };
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
