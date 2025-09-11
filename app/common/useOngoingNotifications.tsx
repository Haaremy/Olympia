// src/components/OngoingNotificationClient.tsx
"use client";

import { useOngoingNotification } from "@/capacitor/useOngoingNotification";

export default function OngoingNotificationClient() {
  useOngoingNotification();
  return null; // rendert nichts, nur Hook
}
