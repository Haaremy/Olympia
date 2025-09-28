import { LocalNotifications } from "@capacitor/local-notifications";

const NOTIFICATION_ID = 2412; // feste ID, damit sie nicht dupliziert wird



export async function startOngoingNotification(body: string) {
  await LocalNotifications.schedule({
    notifications: [
      {
        id: NOTIFICATION_ID,
        title: "Olympia Live Ticker 🎄",
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
        title: "Olympia Live Ticker 🎄",
        body,
        ongoing: true,
      },
    ],
  });
}


export async function requestNotificationPermission() {
  const { display } = await LocalNotifications.checkPermissions();
if (display !== 'granted') {
  await LocalNotifications.requestPermissions();
}

}


export async function showPopupNotification(title: string, body: string) {
  await LocalNotifications.schedule({
    notifications: [
      {
        id: 1225, // Eindeutige ID
        title,
        body,
        sound: 'default', // Standard-Benachrichtigungston
        extra: null,
      },
    ],
  });
}

export async function stopOngoingNotification() {
  await LocalNotifications.cancel({
    notifications: [{ id: NOTIFICATION_ID }],
  });
}
