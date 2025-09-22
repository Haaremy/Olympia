"use client";
import { useEffect } from "react";
import { App } from "@capacitor/app";
import { startOngoingNotification, stopOngoingNotification, updateOngoingNotification, showPopupNotification } from "@/capacitor/notificationService";

const liveUpdate = () => {
 updateOngoingNotification(new Date.now());
}

export function useOngoingNotification() {
  useEffect(() => {
    let listener: { remove: () => void } | null = null;
    const init = async () => {
      try {
        await startOngoingNotification("Die App ist aktiv");
        listener = await App.addListener("appStateChange", async (state) => {
           await showPopupNotification("","","");
            await startOngoingNotification("Die App ist aktiv");
          
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
