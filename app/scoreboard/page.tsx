'use client';

import { Capacitor } from "@capacitor/core";
import React, { useEffect, useState } from "react";
import Carousel from 'react-easy-carousel';
import { useTranslation } from 'next-i18next';
import {i18n} from 'i18next';
import '../../lib/i18n';
import { Slot } from '@prisma/client';
import Image from 'next/image';
import socket from "../../lib/socket";
import { Button, Main } from "@/cooperateDesign";
import { useSession } from "next-auth/react";
 


// Deine bestehenden Interfaces
interface Team {
  id: number;
  name: string;
  uname: string;
  user1: string;
  user2: string;
  user3: string;
  user4: string;
  pointsTotal: number;
  cheatPoints: number;
  entries: { 
    id: number;
    value: number;
    slot: Slot;
    lastUpdated: Date;
    game: {
      id: number;
      language: string;
      tagged: string;
    };
  }[];
}

interface GameRecord {
  gameId: number;
  gameName: string;
  language: string;
  tagged: string | "no tagging returned";
  topPlayer: string;
  topTeam: string;
  topPoints: number;
  topEntries: number;
  team: Team;
}

type Settings = {
  started: boolean;
  ending: Date;
}

export default function ScoreboardTabs() {
  const [activeTab, setActiveTab] = useState<"scoreboard" | "records">("scoreboard");
  const [teams, setTeams] = useState<Team[]>([]);
  const [records, setRecords] = useState<GameRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isAndroid, setIsAndroid] = useState(false);
  const [teamImages, setTeamImages] = useState<string[]>([]);
  const [teamNames, setTeamNames] = useState<string[]>([]);
  const { t, i18n  } = useTranslation();  // Hook innerhalb der Komponente verwenden
  const { data: session } = useSession();
  const getLangID = (i18n: i18n) => {
  switch (i18n.language) {
    case "de":
      return 0;
    case "en":
      return 1;
    default:
      return 0; // Default ID if language is not "de" or "en"
  }
};



  // Fetch Settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsAndroid(Capacitor.getPlatform() === 'android');
        const settingsRes = await fetch("/api/settings");
        if (!settingsRes.ok) throw new Error("Fehler beim Laden der Einstellungen");
        const settings: Settings = await settingsRes.json();
        if (settings.ending) {
          const newEnding = new Date(settings.ending);
          setTimeLeft(newEnding.getTime() - Date.now());  // Using getTime() here for a clean calculation
        }

      } catch (err) {
        console.error(err);
      }
    };
    fetchSettings();
  }, []);

  // Load Files and Names
  const loadFiles = async () => {
    try {
      const res = await fetch('https://olympia.haaremy.de/uploads/files.php');
      if (!res.ok) throw new Error('Fehler beim Laden der Dateien');
      const files = await res.json();
      return files;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const loadNames = async (files: string[]) => {
    const names: string[] = [];
    for (const file of files) {
      try {
        const pathname = new URL(file).pathname;
        const name = pathname.split('/').pop()?.split('.').shift() || '';
        const res = await fetch(`/api/team/searchunique?query=${encodeURIComponent(name)}`);
        if (!res.ok) throw new Error('Fehler beim Laden der Namen');
        const data = await res.json();
        names.push(data.user.name);
      } catch (err) {
        names.push("Santas Secret Wish");
        console.error('Fehler bei Name', file, ':', err);
      }
    }
    return names;
  };

  // Fetch Files and Names when Component Mounts
  useEffect(() => {
    const fetchFilesAndNames = async () => {
      const files = await loadFiles();
      const names = await loadNames(files);
      setTeamImages(files);
      setTeamNames(names);
    };
    fetchFilesAndNames();
  }, []);

  // Countdown and Async Image Update Every Second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1000) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1000;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format Time
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours > 0 ? `${hours}h ` : ''}${minutes > 0 || hours > 0 ? `${minutes}m ` : ''}${seconds}s`;
  };

 
  
  // Fetch Scoreboard and Records
  useEffect(() => {


    const fetchScoreboardAndRecords = async () => {
      try {
        const [scoreboardRes, recordsRes] = await Promise.all([
          fetch("/api/scoreboard"),
          fetch("/api/records"),
        ]);

        if (!scoreboardRes.ok || !recordsRes.ok) {
          throw new Error("Fehler beim Laden der Daten");
        }

        const scoreboardData = await scoreboardRes.json();
        const recordsData = await recordsRes.json();

        setTeams(scoreboardData);
        setRecords(recordsData);
      } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
        setTeams([]); // Reset teams in case of error
        setRecords([]); // Reset records in case of error
      } finally {
        setLoading(false); // Set loading to false once data is fetched or fails
      }
      
    };

    fetchScoreboardAndRecords();
    
    socket.on("scoreboard", fetchScoreboardAndRecords);
    
    return () => {
    socket.off("scoreboard", fetchScoreboardAndRecords);
  };
  }, []); // Only run once when the component mounts

  // Format Date
  const formatDate = (date: Date | string) => {
    if (!date || new Date(date).toString() === "Invalid Date") return "-";
    let lang = i18n.language;
    switch (lang){
      case "de": lang = "de-DE"; break;
      case "en": lang = "en-US"; break;
      default : lang = "de-DE"; break;
    }
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(date).toLocaleDateString(lang, options);
  };

const imageLoader = ({ src }: { src: string }) => {
  return src;
}

  return (
    <Main>
      {/* Tabs */}
     <div className={`${isAndroid ? "mt-16" : "mt-4"} mb-8`}>
  {/* Carousel Container */}
  <div className="mb-4 inline-flex w-full justify-center flex-1 w-full space-x-4 overflow-hidden">
     <Carousel
      animation="slide"
      animationDuration={600}
      auto={4000}        // autoplay alle 4 Sekunden
      dots={false}        // Punkte-Indikatoren
    >
       {teamImages.map((src, idx) => (
          <div
            key={idx}
            className={`relative  flex flex-col bg-white dark:bg-gray-800  shadow-md overflow-hidden group cursor-pointer transition duration-300 ease-in-out hover:shadow-xl hover:scale-105 `}
          >
            <Image
              src={teamImages[((idx+0)%teamImages.length)]}
              loader={imageLoader}
              alt={`Team ${teamNames[((idx+0)%teamImages.length)]} ${((idx+0)%teamImages.length)}`}
              className="sm:h-64 h-32"
            />
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black to-transparent text-white">
                <h2 className="text-xs sm:text-sm md:text-xl font-semibold">{teamNames[((idx+0)%teamImages.length)]}</h2>
              </div>
          </div>
      
        ))}
    </Carousel>
    <Carousel
      animation="slide"
      animationDuration={600}
      auto={4000}        // autoplay alle 4 Sekunden
      dots={false}        // Punkte-Indikatoren
    >
       {teamImages.map((src, idx) => (
          <div
            key={idx}
            className={`relative  flex flex-col bg-white dark:bg-gray-800 shadow-md overflow-hidden group cursor-pointer transition duration-300 ease-in-out hover:shadow-xl hover:scale-105 `}
          >
            <Image
              src={teamImages[((idx+1)%teamImages.length)]}
              loader={imageLoader}
              alt={`Team ${teamNames[((idx+1)%teamImages.length)]} ${((idx+1)%teamImages.length)}`}
              className="sm:h-64 h-32"
            />
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black to-transparent text-white">
                <h2 className="text-xs sm:text-sm md:text-xl font-semibold">{teamNames[((idx+1)%teamImages.length)]}</h2>
              </div>
          </div>
        ))}
    </Carousel>
    <Carousel
      animation="slide"
      animationDuration={600}
      auto={4000}        // autoplay alle 4 Sekunden
      dots={false}        // Punkte-Indikatoren
    >
       {teamImages.map((src, idx) => (
          <div
            key={idx}
            className={`relative  flex flex-col bg-white dark:bg-gray-800  shadow-md overflow-hidden group cursor-pointer transition duration-300 ease-in-out hover:shadow-xl hover:scale-105 `}
          >
            <Image
              src={teamImages[((idx+2)%teamImages.length)]}
              loader={imageLoader}
              alt={`Team ${teamNames[((idx+2)%teamImages.length)]} ${((idx+2)%teamImages.length)}`}
              className="sm:h-64 h-32"
            />
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black to-transparent text-white">
                <h2 className="text-xs sm:text-sm md:text-xl font-semibold">{teamNames[((idx+2)%teamImages.length)]}</h2>
              </div>
          </div>
        ))}
    </Carousel>
  </div>

  {/* Tab Buttons */}
  <div className="inline-flex  overflow-hidden w-full justify-center">
    <Button
      onClick={() => setActiveTab("scoreboard")}
      switchOn={activeTab === "scoreboard"}
      variant="switch"
      className="rounded-l-lg rounded-r-none"
    >
      Scoreboard
    </Button>
    <Button
      onClick={() => setActiveTab("records")}
      switchOn={activeTab === "records"}
      variant="switch"
      className="rounded-r-lg rounded-l-none"
    >
      {t("worldrecords")}
    </Button>
  </div>
</div>


      {/* Timer */}
      <div className="flex justify-center">
        <div className="inline-flex bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-md overflow-hidden text-bold pr-8 pl-8 mb-4">
          {timeLeft > 0 ? formatTime(timeLeft) : "👑"}
        </div>
      </div>

      

      {/* Tab Content */}
      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-300">Lädt...</p>
      ) : activeTab === "scoreboard" ? (
        <div className="overflow-x-auto w-full rounded-xl shadow-md bg-white dark:bg-gray-800">
          <table className="min-w-full text-left text-sm text-gray-700 dark:text-gray-200">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">{t("rank")}</th>
                <th className="px-6 py-4">Team</th>
                <th className="px-6 py-4">{t("Punkte")}</th>
               {session?.user?.role == "ADMIN" && <th className="px-6 py-4">{t("Cheated")}</th>}
                <th className="px-6 py-4">Update</th>
              </tr>
            </thead>
            <tbody>
              {teams.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center">
                    Nichts zu sehen.
                  </td>
                </tr>
              ) : (
                teams.map((team, i) => (
                  <React.Fragment key={team.id}>
                    <tr className="border-t border-gray-200 dark:border-gray-600">
                      <td className="px-6 py-4 font-medium">#{i + 1}</td>
                      {session?.user?.role == "ADMIN" ? <td className="px-6 py-4">#{team.uname}</td> : <td className="px-6 py-4">{team.name}</td> }
                      <td className="px-6 py-4">{team.pointsTotal}</td>
                     {session?.user?.role == "ADMIN" && <td className="px-6 py-4">{team.cheatPoints}</td>}
                      <td className="px-6 py-4"></td>
                      <td className="px-6 py-4">
                        {team.entries.length > 0 && formatDate(team.entries[team.entries.length - 1].lastUpdated)}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <td colSpan={4} className="px-6 py-2">
                        <details>
                          <summary className="cursor-pointer text-pink-600 dark:text-pink-400 hover:underline">
                            Details anzeigen
                          </summary>
                          <table className="w-full mt-4 text-xs text-center border rounded-md">
                            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                              <tr>
                                <th className="border px-2 py-1">{t("game")}</th>
                                <th className="border px-2 py-1">{team.user1}</th>
                                <th className="border px-2 py-1">{team.user2}</th>
                                <th className="border px-2 py-1">{team.user3 || "-"}</th>
                                <th className="border px-2 py-1">{team.user4 || "-"}</th>
                                <th className="border px-2 py-1">Updated</th>
                              </tr>
                            </thead>
                            <tbody>
                             {[...new Set(team.entries.map((p) => p.game.id))].map((gameId) => {
  const pointsForGame = team.entries.filter((p) => p.game.id === gameId);
  const game = pointsForGame[0]?.game;

  // Map each slot to its value for this game
   const slotValues: Record<Slot, number | "-"> = {
      [Slot.USER1]: "-",
      [Slot.USER2]: "-",
      [Slot.USER3]: "-",
      [Slot.USER4]: "-",
    };


  pointsForGame.forEach((p) => {
  slotValues[p.slot] = p.value === -1 ? "-" : p.value;
});


  const updated = pointsForGame[0]?.lastUpdated
    ? formatDate(pointsForGame[0].lastUpdated)
    : "-";

  return (
    <tr key={gameId} className="even:bg-gray-50 dark:even:bg-gray-800">
      <td className="border px-2 py-1">{gameId}</td>
      <td className="border px-2 py-1">
        {(game?.tagged?.includes("hidden") && !session?.user?.role=="ADMIN")
          ? "????"
          : slotValues["USER1"]}
      </td>
      <td className="border px-2 py-1">
        {((game?.tagged?.includes("hidden") || game?.tagged?.includes("field1")) && !session?.user?.role=="ADMIN")
          ? "????"
          : slotValues["USER2"]}
      </td>
      <td className="border px-2 py-1">
        {((game?.tagged?.includes("hidden") || game?.tagged?.includes("field1")) && !session?.user?.role=="ADMIN")
          ? "????"
          : slotValues["USER3"]}
      </td>
      <td className="border px-2 py-1">
        {((game?.tagged?.includes("hidden") || game?.tagged?.includes("field1")) && !session?.user?.role=="ADMIN")
          ? "????"
          : slotValues["USER4"]}
      </td>
      <td className="border px-2 py-1">{updated}</td>
    </tr>
  );
})}

                            </tbody>
                          </table>
                        </details>
                      </td>
                    </tr>
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 space-y-4 min-h-[16vh]">

          {records.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">Keine Weltrekorde gefunden.</p>
          ) : (
            records.map((record) => (
             <div key={record.gameId} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 transition duration-300 hover:shadow-xl hover:scale-105">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-pink-500">
                  {record.gameId} - {record.gameName.split(", ")[getLangID(i18n)]}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  {/* Show team if "field1" is in gameName, otherwise show team + player */}
                  {record?.tagged?.includes("field1") ? `👑 ${record.topTeam}` : `👑 ${record.topTeam} - ${record.topPlayer}`}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  {record.topPoints} {t(record.tagged.split(":unit:")[1])}
                </p>
              </div>


            ))
          )}
        </div>
      )}
    </Main>
  );
}
