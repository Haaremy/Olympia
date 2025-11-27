"use client";
// Info für die Navigation: der benutzte Button wird gegen "Spiele" ausgetauscht
import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { useTranslation } from "next-i18next";
import { usePathname, useRouter } from "next/navigation";
import { Capacitor, PluginListenerHandle } from "@capacitor/core";
import Image from "next/image";
import socket from "@/lib/socket";
import { Button, Main } from "@/cooperateDesign";
import { App } from '@capacitor/app';
import Language from "./language";
import Login from "./login";
import PlannedTime from "./timeTable";
import Chat from "./chat";
import "../lib/i18n";
import Link from "next/link";
import ThemeSettings from "./common/themeSettings";
import { isIOS, isAndroid, isIPhoneSimulator, isNativeIOSSimulator } from "./common/devices";

export default function Navigation() {
  const [showLanguage, setShowLanguage] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [timePlan, setTimePlan] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [newChat, setNewChat] = useState(false);
  //const [isAndroid, setIsAndroid] = useState(false);
  //const [isIOS, setIsIOS] = useState(false);

  const { t, i18n } = useTranslation();
  const { data: session, status } = useSession();
  const user = session?.user as Session["user"];
  const currentPath = usePathname();
  const router = useRouter();

  //useEffect(() => {
    //setIsAndroid(Capacitor.getPlatform() === "android");
    //setIsIOS(Capacitor.getPlatform() === "iOS");
  //}, []);

  const handleLoginOpen = useCallback(() => {
    if (!session) setShowLogin(true);
  }, [session]);

  const handleLoginClose = () => setShowLogin(false);
  const handleChatClose = () => setShowChat(false);
  const handleChatOpen = () => {
    setShowChat(true);
    setNewChat(false);
  };
  const handleLanguageClose = () => setShowLanguage(false);
  const handleTimePlanOpen = () => setTimePlan(true);
  const handleTimePlanClose = () => setTimePlan(false);

  const lastBackPress = useRef(0);

  useEffect(() => {
    let listenerHandle: PluginListenerHandle | undefined;

    const handler = () => {

      if (currentPath !== '/') {
        // Navigate back if not on home page
        if(showLogin || showChat || showLanguage || timePlan){
          setShowChat(false);
          setShowLanguage(false);
          setShowLogin(false);
          setTimePlan(false);
        } else {
          router.back();
        }

      } else {
        // If on start page, handle double press to exit
        const now = Date.now();
        if (now - lastBackPress.current < 2000) {
          App.exitApp(); // exit app on second press
        } else {
          console.log('Press back again to exit');
          lastBackPress.current = now;
        }
      }
    };

    // ✅ Actually add the listener
    App.addListener('backButton', handler).then(handle => {
      listenerHandle = handle;
    });

    // ✅ Cleanup listener on unmount
    return () => {
      listenerHandle?.remove();
    };
  }, [router]);


  const navButtonGroup = () => {
    return(
      user ? (
                user.role === "ADMIN" ? (
                  <Button variant="navigation" onClick={() => router.push("/adminpage")}>
                    <Image
                      src="/images/navbuttongroup.svg"
                      alt="Admin"
                      width={24}
                      height={24}
                      className="dark:invert invert-0 truedark:invert"
                    />
                    <p className="text-xs sm:text-sm md:text-lg font-semibold">Admin</p>
                  </Button>
                ) : (
                  <Button variant="navigation" onClick={() => router.push("/teampage")}>
                    <Image
                      src="/images/navbuttongroup.svg"
                      alt="Team"
                      width={24}
                      height={24}
                      className="dark:invert invert-0 truedark:invert"
                    />
                    <p className="text-xs sm:text-sm md:text-lg font-semibold">Team</p>
                  </Button>
                )
              ) : (
                <Button variant="navigation" onClick={handleLoginOpen}>
                  <Image
                    src="/images/navbuttongroup.svg"
                    alt="Login"
                    width={24}
                    height={24}
                    className="dark:invert invert-0 truedark:invert"
                  />
                  <p className="text-xs sm:text-sm md:text-lg font-semibold">Login</p>
                </Button>
              )
    )
  }

  const navButtonRank = () => {
    return (
      <Button
              variant="navigation"
              onClick={() =>
                router.push(currentPath === "/scoreboard" ? "/" : "/scoreboard")
              }
            >
              <Image
                src={
                  currentPath === "/scoreboard"
                    ? "/images/navbuttongames.svg"
                    : "/images/navbuttonrank.svg"
                }
                alt="Rank"
                width={24}
                height={24}
                className="dark:invert invert-0 truedark:invert"
              />
              <p className="text-xs sm:text-sm md:text-lg font-semibold">
                {currentPath === "/scoreboard" ? t("games") : t("rank")}
              </p>
            </Button>
    )
  }

  const navButtonGames = () => {
    return (
      <Button variant="navigation" onClick={() => router.push("/")}>
                <Image
                  src="/images/navbuttongames.svg"
                  alt="Games"
                  width={24}
                  height={24}
                  className="dark:invert invert-0 truedark:invert"
                />
                <p className="text-xs sm:text-sm md:text-lg font-semibold">{t("games")}</p>
              </Button>
    )
  }

  const navButtonMap = () => {
    return (
      <Button
              variant="navigation"
              onClick={() => router.push(currentPath === "/map" ? "/" : "/map")}
            >
              <Image
                src={
                  currentPath === "/map"
                    ? "/images/navbuttongames.svg"
                    : "/images/navbuttonmap.svg"
                }
                alt="Map"
                width={24}
                height={24}
                className="dark:invert invert-0 truedark:invert"
              />
              <p className="text-xs sm:text-sm md:text-lg font-semibold">
                {currentPath === "/map" ? t("games") : t("map")}
              </p>
            </Button>
    )
  }

  const navButtonChat = () => {
    return (
      <Button variant="navigation" onClick={handleChatOpen} className="relative flex flex-col items-center">
        <div className="relative">
          <Image
            src="/images/navbuttonchat.svg"
            alt="Chat"
            width={24}
            height={24}
            className="dark:invert invert-0 truedark:invert"
          />
          {(newChat && !showChat) && (
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-600 border-2 border-white"></span>
          )}
        </div>
        <p className="text-xs sm:text-sm md:text-lg font-semibold">Chat</p>
      </Button>
    );
  };


  useEffect(() => {
    socket.on("chat message", () => {
      if (!showChat) setNewChat(true);
    });

    if (typeof window !== "undefined") {
      const handleScroll = () => setIsScrolled(window.scrollY > 10);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }

    return () => {
      socket.off("chat message");
    };
  }, [showChat]);

  useEffect(() => {
    if (typeof window !== "undefined") {

      const lang = localStorage.getItem("language");
      i18n.changeLanguage(lang || "de");
      if (!lang) setShowLanguage(true);
    }
  }, [i18n]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const lang = localStorage.getItem("language");
      i18n.changeLanguage(lang || "de");

      const time = new Date().getHours() * 60 + new Date().getMinutes();
      const lastChecked = sessionStorage.getItem("timePlanChecked");
      if (lastChecked) {
        const diff = time - parseInt(lastChecked, 10);
        if (diff > 15 || diff < 0) {
          handleTimePlanOpen();
          sessionStorage.setItem("timePlanChecked", time.toString());
        }
      } else {
        handleTimePlanOpen();
        sessionStorage.setItem("timePlanChecked", time.toString());
      }
    }
  }, [status, user?.uname, i18n, handleLoginOpen]);

  return (
    <Main className="!min-h-0 z-50">
      <header
        className={`fixed top-0 left-0 w-full border-b shadow-md z-50 transition-transform duration-300
        bg-white border-gray-300 
        dark:bg-gray-800 dark:border-gray-700 
        truedark:bg-black truedark:border-white
        `}
      >
        <div
          className={`container mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-3 ${
            isAndroid() ? "mt-6" : ""
          } ${isIOS() || isIPhoneSimulator() || isNativeIOSSimulator() ? "mt-10" : ""} gap-4`}
        >
          {/* Headline */}
          <div
            className={`${
              isScrolled ? "hidden sm:inline-flex" : "inline-flex"
            } text-white rounded-lg items-center justify-center`}
          >
            <Link
              href={"/"}
              className="bg-transparent hover:bg-transparent text-gray-800 dark:text-gray-200 truedark:text-white"
            >
              <p className="text-lg font-semibold ">
                FSR INS&nbsp;
                <code className="font-mono font-bold text-blue-400 dark:text-pink-500 truedark:text-white">
                  AdGames{t("calender")}
                </code>
              </p>
            </Link>
          </div>

          {/* Navigation Buttons */}
          <div
            className={`flex flex-wrap gap-1 sm:gap-2 justify-center sm:justify-end`}
          >

            <div
            className={`flex flex-wrap gap-2 justify-center sm:justify-end ${
              currentPath !== "/credits" ? "hidden" : "visible"
            }`}
          >
            {navButtonGames()}
          </div>
            {/* ADMIN / TEAM / LOGIN */}
            {currentPath !== "/adminpage" && currentPath !== "/teampage" ? 
              navButtonGroup()
            : navButtonGames()
            }

            {/* SCOREBOARD */}
            {navButtonRank()}

            {/* MAP */}
            {navButtonMap()}

            {/* CHAT */}
            {navButtonChat()}
          </div>
          <div
            className={`flex flex-wrap gap-2 justify-center sm:justify-end ${
              currentPath === "/credits" ? "visible" : "hidden"
            }`}
          >
          </div>

          {/* Modals */}
          {timePlan && <PlannedTime onClose={handleTimePlanClose} />}
          {showLanguage && <Language onClose={handleLanguageClose} />}
          {showLogin && <Login onClose={handleLoginClose} />}
          {showChat && <Chat onClose={handleChatClose} />}
        </div>
      </header>
      <div className="hidden">
        <ThemeSettings />
      </div>
      
    </Main>
  );
}
