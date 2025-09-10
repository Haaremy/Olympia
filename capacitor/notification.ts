import { LocalNotifications } from '@capacitor/local-notifications';

export async function initNotifications() {
  await LocalNotifications.requestPermissions();

  await LocalNotifications.schedule({
    notifications: [
      {
        id: 1,
        title: 'API Status',
        body: 'Wird aktualisiert...',
        ongoing: true,
      },
    ],
  });
}

export async function updateNotification(message: string) {
  await LocalNotifications.schedule({
    notifications: [
      {
        id: 1,
        title: 'API Update',
        body: message,
        ongoing: true,
      },
    ],
  });
}
