import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navigation from "./navigation";
import SessionProvider from "./session-provider";
import "./globals.css";
import Footer from "./footer";
import { UIProvider } from "./context/UIContext";
import OngoingNotificationClient from "../app/common/useOngoingNotifications";
import { MusicProvider } from "./common/music";
import localFont from "next/font/local";

const rubicRegular = localFont({
  src: "./fonts/rubic/regular.ttf",
  variable: "--font-rubic-regular",
  weight: "400",
});


export const metadata: Metadata = {
  title: "Olympia",
  description: "Weihnachtsolympiade des Fachschaftsrat INS der Hochschule Anhalt. Website und Implementierung von @Haaremy.",
   icons: {
    icon: "/images/android-chrome-512x512.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" >
        
      <body
        className={` ${rubicRegular.className} antialiased`}
      >
              
          <SessionProvider>
            <UIProvider>
              <Navigation/>
                <OngoingNotificationClient />
                <MusicProvider>
                  {children}
                </MusicProvider>
              <Footer/>
            </UIProvider>
        </SessionProvider>
      </body>
    </html>  
  );
}
