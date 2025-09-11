import { LocalNotifications } from "@capacitor/local-notifications";

const NOTIFICATION_ID = 99; // feste ID, damit sie nicht dupliziert wird

export async function startOngoingNotification(body: string) {
  await LocalNotifications.schedule({
    notifications: [
      {
        id: NOTIFICATION_ID,
        title: "Olympia läuft 🏃",
        body,
        ongoing: true, // 👈 macht die Notification permanent
      },
    ],
  });
}

export async function updateOngoingNotification(body: string) {
  await LocalNotifications.schedule({
    notifications: [
      {
        id: NOTIFICATION_ID,
        title: "Olympia läuft 🏃",
        body,
        ongoing: true,
      },
    ],
  });
}

export async function stopOngoingNotification() {
  await LocalNotifications.cancel({
    notifications: [{ id: NOTIFICATION_ID }],
  });
}
