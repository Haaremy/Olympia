"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import "../lib/i18n";
import { useUI } from "./context/UIContext";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { Main } from "@cooperateDesign";
import clsx from "clsx";
import SearchBar from "../common/searchbar";

type TransformedLanguage = {
  content: string;
  points: string;
  title: string;
  story: string;
  capacity: string;
  station: string;
};

type Game = {
  id: number;
  url: string;
  languages: Record<string, TransformedLanguage>;
  tagged: string | null;
};

type GameData = {
  id: number;
  title: string;
  story: string;
  capacity: string;
  content: string;
  points: string;
  station: string;
  timeLeft: number;
  started: boolean;
  url: string;
  tagged: string;
  languages: { language: string; title: string; story: string }[];
};

type Settings = {
  started: boolean;
  ending: string;
};

export default function GamesPage({
  games,
  searchQueryRef,
}: {
  games: Game[];
  searchQueryRef: string;
}) {
  const { t, i18n } = useTranslation();
  const { isModalOpen } = useUI();
  const { data: session } = useSession();
  const team = session?.user as Session["user"] | undefined;

  const [searchQuery, setSearchQuery] = useState(searchQueryRef || "");
  const [language, setLanguage] = useState<string>(i18n.language || "de");
  const [randomizedGames, setRandomizedGames] = useState<Game[]>(games);
  const [playedMap, setPlayedMap] = useState<Record<number, boolean>>({});
  const [showInfo, setShowInfo] = useState(false);
  const [selectedGame, setSelectedGame] = useState<GameData | null>(null);
  const [ending, setEnding] = useState<string>("");
  const [started, setStarted] = useState<boolean>(false);
  const [hydrated, setHydrated] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Hydration flag
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Load settings & set language on mount / language change
  useEffect(() => {
    setLanguage(i18n.language);
    setSearchQuery(searchQueryRef || "");

    fetch("/api/settings")
      .then((res) => {
        if (!res.ok) throw new Error("Fehler beim Laden der Einstellungen");
        return res.json();
      })
      .then((data: Settings) => {
        if (data.ending) setEnding(data.ending);
        if (typeof data.started === "boolean") setStarted(data.started);
      })
      .catch(() => {
        // ignore
      });
  }, [i18n.language, searchQueryRef]);

  // --- Randomize once (Option A)
  useEffect(() => {
    try {
      const key = "shuffledGameIds_v1";
      const stored = localStorage.getItem(key);
      if (stored) {
        const ids: number[] = JSON.parse(stored);
        // Map current games by id for resilience if games list changed
        const map = new Map<number, Game>();
        games.forEach((g) => map.set(g.id, g));
        const ordered = ids.map((id) => map.get(id)).filter(Boolean) as Game[];
        // Append any new games not present in stored order
        const missing = games.filter((g) => !ids.includes(g.id));
        setRandomizedGames([...ordered, ...missing]);
      } else {
        const shuffled = [...games];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        localStorage.setItem(key, JSON.stringify(shuffled.map((g) => g.id)));
        setRandomizedGames(shuffled);
      }
    } catch (e) {
      // fallback: keep original order
      setRandomizedGames(games);
    }
    // only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load played games (hasPoints) efficiently: only for missing IDs
  useEffect(() => {
    const loadPlayed = async () => {
      const teamId = Number(team?.id);
      if (!teamId || isNaN(teamId)) return;

      const playedRaw = localStorage.getItem("playedGames") || "";
      const playedSet = new Set(playedRaw.split("+").filter(Boolean));

      const map: Record<number, boolean> = {};
      const toCheck: number[] = [];

      for (const g of games) {
        if (playedSet.has(String(g.id))) {
          map[g.id] = true;
        } else {
          toCheck.push(g.id);
        }
      }

      // Fetch only for games that are not known
      await Promise.all(
        toCheck.map(async (gameId) => {
          try {
            const res = await fetch(`/api/hasPoints?teamId=${teamId}&gameId=${gameId}`);
            if (!res.ok) {
              map[gameId] = false;
              return;
            }
            const data = await res.json();
            if (data.hasPoints) {
              playedSet.add(String(gameId));
              map[gameId] = true;
            } else {
              map[gameId] = false;
            }
          } catch (e) {
            map[gameId] = false;
          }
        })
      );

      localStorage.setItem("playedGames", Array.from(playedSet).join("+"));
      setPlayedMap((prev) => ({ ...prev, ...map }));
    };

    loadPlayed();
  }, [team?.id, games]);

  // Filtered games based on search and language
  const filteredGames = useMemo(() => {
    const q = (searchQuery || "").trim().toLowerCase();
    if (!q) return randomizedGames;

    return randomizedGames.filter((game) => {
      const idString = game.id < 10 ? `0${game.id}` : `${game.id}`;
      const title = game.languages[language]?.title || "";
      return idString.includes(q) || title.toLowerCase().includes(q);
    });
  }, [randomizedGames, searchQuery, language]);

  // Scroll detection for UI tweaks
  useEffect(() => {
    if (!hydrated) return;
    const onScroll = () => {
      const remaining = document.body.scrollHeight - (window.scrollY + window.innerHeight);
      setIsScrolled(remaining < 50);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [hydrated]);

  const openInfo = (game: Game) => {
    const lang = game.languages[language];
    const data: GameData = {
      id: game.id,
      title: lang?.title || "Unbekannt",
      story: lang?.story || "Keine Beschreibung",
      capacity: lang?.capacity || "—",
      content: lang?.content || "—",
      points: lang?.points || "—",
      station: lang?.station || "—",
      timeLeft: new Date(ending).getTime() - Date.now(),
      started,
      url: game.url,
      tagged: game.tagged || "",
      languages: Object.keys(game.languages).map((key) => ({
        language: key,
        title: game.languages[key].title,
        story: game.languages[key].story,
      })),
    };
    setSelectedGame(data);
    setShowInfo(true);
  };

  const closeInfo = () => {
    setShowInfo(false);
    setSelectedGame(null);
  };

  return (
    <Main className="flex flex-col p-1">
      <div className="flex-1 w-full transition-all duration-300">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
          {filteredGames.length === 0 && !searchQuery && (
            <p className="col-span-full text-center text-gray-500">Keine Spiele gefunden.</p>
          )}

          {filteredGames.map((game) => {
            const last = filteredGames[filteredGames.length - 1]?.id === game.id;
            return (
              <div key={game.id} className={`${last ? "mb-4 sm:mb-0" : ""}`}>
                <div
                  className="relative flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden group cursor-pointer transition duration-300 ease-in-out hover:shadow-xl hover:scale-105"
                  onClick={() => openInfo(game)}
                >
                  <Image
                    src={`/images/christmas_calender${game.id % 5}.jpg`}
                    alt={`Cover ${game.id}`}
                    className={clsx(
                      "w-full h-64 object-cover object-right bg-gray-300",
                      playedMap[game.id] === true ? "grayscale truedark:contrast-200" : ""
                    )}
                    width={500}
                    height={500}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-white text-5xl font-bold">
                    {game.id < 10 ? "0" : ""}
                    {game.id}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black to-transparent text-white">
                    <h2 className="text-lg md:text-xl font-semibold">{game.languages[language]?.title}</h2>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {showInfo && selectedGame && <InfoBox message={selectedGame} onClose={closeInfo} />}
      </div>

      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} isModalOpen={isModalOpen} />
    </Main>
  );
}
