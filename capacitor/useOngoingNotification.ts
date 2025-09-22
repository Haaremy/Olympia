"use client";
import { useEffect } from "react";
import { App } from "@capacitor/app";
import { startOngoingNotification, stopOngoingNotification } from "@/capacitor/notificationService";

export function useOngoingNotification() {
  useEffect(() => {
    let listener: { remove: () => void } | null = null;
    const init = async () => {
      try {
        await startOngoingNotification("Die App ist aktiv");
        listener = await App.addListener("appStateChange", async (state) => {
          if (!state.isActive) {
            await stopOngoingNotification();
          } else {
            await startOngoingNotification("Die App ist aktiv");
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
