"use client";

import { useEffect } from "react";
import { App } from "@capacitor/app";
import { startOngoingNotification, stopOngoingNotification } from "@/capacitor/notificationService";

export function useOngoingNotification() {
  useEffect(() => {
    let listener: { remove: () => void } | null = null;

    const init = async () => {
      // Notification starten
      await startOngoingNotification("Die App ist aktiv");

      // Listener registrieren und awaiten
      listener = await App.addListener("appStateChange", (state) => {
        if (!state.isActive) {
          stopOngoingNotification();
        }
      });
    };

    init();

    return () => {
      if (listener) {
        listener.remove(); // Listener sauber entfernen
      }
      stopOngoingNotification(); // Notification stoppen
    };
  }, []);
}
