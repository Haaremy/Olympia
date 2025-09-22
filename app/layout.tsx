import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navigation from "./navigation";
import SessionProvider from "./session-provider";
import "./globals.css";
import Footer from "./footer";
import Chat from "./chat";
import { UIProvider } from "./context/UIContext";
import OngoingNotificationClient from "../app/common/useOngoingNotifications";
import { useChatMessages } from "../app/common/chatCheck";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

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
  const message = useChatMessages();
  return (
    <html lang="de" className="">
        
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
              
          <SessionProvider>
            <UIProvider>
              <Navigation/>
                <OngoingNotificationClient />
                <Chat messages=message/>
                {children}
              <Footer/>
            </UIProvider>
        </SessionProvider>
      </body>
    </html>  
  );
}
