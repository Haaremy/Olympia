import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'de.haaremy.olympia',
  appName: 'Olympia',
  webDir: 'public',
   server: {
    url: "https://olympia.haaremy.de", // Emulator → dein Next.js Server
    cleartext: true
  },
  android: {
    allowMixedContent: true          // erlaubt HTTP Inhalte (nicht HTTPS)
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500, // Dauer in ms
      launchAutoHide: true,      // automatisch ausblenden
      backgroundColor: '#ffffff', // Hintergrundfarbe während Splash
      androidSplashResourceName: 'splash', // drawable Ressource
      showSpinner: true,
      androidSpinnerStyle: 'large',
      spinnerColor: '#999999',
    }
  }
};

export default config;
