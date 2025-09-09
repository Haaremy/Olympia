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
    SplashScreen: { // android/app/src/main/res/values/styles.xml // ios/App/App/Assets.xcassets/LaunchImage.imageset/
      launchShowDuration: 1500, // Millisekunden
      launchAutoHide: true,      // automatisch nach der Zeit ausblenden
      backgroundColor: "#ffffff",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      androidSpinnerStyle: "large",
      spinnerColor: "#999999",
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;
