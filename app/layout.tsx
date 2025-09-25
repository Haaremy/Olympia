import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navigation from "./navigation";
import SessionProvider from "./session-provider";
import "./globals.css";
import Footer from "./footer";
import { UIProvider } from "./context/UIContext";
import OngoingNotificationClient from "../app/common/useOngoingNotifications";
import { MusicProvider } from "./common/music";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
import { Inter } from "next/font/google";


const inter = Inter({ subsets: ["latin"] });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        className={`${geistSans.variable} ${geistMono.variable} ${inter.className} antialiased`}
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
