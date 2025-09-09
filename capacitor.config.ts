import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'de.haaremy.olympia',
  appName: 'Weihnachtsolympiade',
  webDir: 'public',
   server: {
    url: "https://olympia.haaremy.de", // Emulator → dein Next.js Server
    cleartext: true
  },
  android: {
    allowMixedContent: true          // erlaubt HTTP Inhalte (nicht HTTPS)
  }
};

export default config;
