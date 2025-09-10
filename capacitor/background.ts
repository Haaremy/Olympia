import { ForegroundService } from '@capawesome-team/capacitor-android-foreground-service';
import { updateNotification } from './notification';

export async function startBackgroundApiWatcher() {
  // Service starten
  await ForegroundService.startForegroundService({
    id: 123,
    title: 'API Watcher',
    body: 'Läuft im Hintergrund...',
    smallIcon: 'ic_stat_icon_config_sample', // muss in deinem Android Projekt existieren
    notificationChannelId: 'default',       // vorher im Android-Projekt definieren
  });

  // Polling-Loop (hier 60 Sekunden)
  setInterval(async () => {
    try {
      const res = await fetch('https://example.com/api/status');
      const data = await res.json();

      // Notification aktualisieren
      await ForegroundService.updateForegroundService({
        id: 123,
        title: 'API Watcher',
        body: `Status: ${data.status}`,
        smallIcon: 'ic_stat_icon_config_sample',
        notificationChannelId: 'default',
      });

      // optional: auch deine LocalNotification updaten
      await updateNotification(`Status: ${data.status}`);
    } catch (err) {
      console.error('API Polling Fehler:', err);
    }
  }, 60_000);
}
