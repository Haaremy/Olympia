'use client';

import { useState, useMemo, useEffect } from "react";
import InfoBox from "./gameDetails";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import '../lib/i18n';
import { useUI } from "./context/UIContext";
import { useSession } from "next-auth/react"; // Import der useSession Hook
import { Session } from "next-auth";

type Game = {
  id: number;
  url: string;
  languages: Record<string, TransformedLanguage>;
  tagged: string | null;
};

type Settings = {
  started: boolean;
  ending: Date;
}

// Typ für die transformierte Sprache
type TransformedLanguage = {
  content: string;
  points: string;
  title: string;
  story: string;
  capacity: string;
  station: string;
};

// Typisierung für die Spiele-Daten
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





export default function GamesPage({ games, settings }: { games: Game[], settings: Settings }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [selectedGame, setSelectedGame] = useState<GameData | null>(null);
  const [language, setLanguage] = useState("de"); // Default
  const { isModalOpen } = useUI();
  const { data: session } = useSession();
  const team = session?.user as Session["user"];
  const { i18n } = useTranslation();  // Hook innerhalb der Komponente verwenden
  const [gamePointsMap, setGamePointsMap] = useState<Record<number, boolean>>({});
  const [fetchPointsForGames, setfetchPointsForGames] = useState(false);


  // Setze die Sprache basierend auf i18n
  useEffect(() => {
    setLanguage(i18n.language);
  }, [i18n.language]);


  // Filtere Spiele basierend auf der Suche
  const filteredGames = useMemo(() => {
  return games.filter((game) => {
    const gameIdString = game.id < 10 ? "0" + game.id : game.id.toString();
    const matchesId = gameIdString.includes(searchQuery);
    const matchesTitle = game.languages[language]?.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesId || matchesTitle;
  });
}, [games, searchQuery, language]);

  const [randomizedGames, setRandomizedGames] = useState(games);

  useEffect(() => {
    // 1. Versuche, die gespeicherte Reihenfolge aus localStorage zu laden
    const storedShuffledIds = localStorage.getItem("shuffledGameIds");
  
    let orderedGames: typeof filteredGames = [];
  
    if (storedShuffledIds) {
      // 2. Wenn eine Reihenfolge bereits gespeichert wurde, benutze sie
      const storedIds = JSON.parse(storedShuffledIds) as string[];
  
      // Map von gefilterten Spielen (mit ID als Schlüssel)
      const gameMap: Record<string, (typeof filteredGames)[number]> = {};
      filteredGames.forEach(game => {
        gameMap[game.id] = game;
      });
  
      // Spiele nach gespeicherter Reihenfolge ordnen
      orderedGames = storedIds
        .map(id => gameMap[id])
        .filter((game): game is (typeof filteredGames)[number] => !!game);
    } else {
      // 3. Wenn noch keine Reihenfolge gespeichert wurde, dann mische die Spiele
      const shuffled = [...filteredGames];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
  
      // 4. Speichere die gemischte Reihenfolge in localStorage
      localStorage.setItem(
        "shuffledGameIds",
        JSON.stringify(shuffled.map(game => game.id))
      );
  
      orderedGames = shuffled;
    }
  
    // 5. Sortiere die Spiele mit Punkten nach unten
    const sorted = orderedGames.sort((a, b) => {
      const hasPointsA = gamePointsMap[a.id] ? 1 : 0;
      const hasPointsB = gamePointsMap[b.id] ? 1 : 0;
      return hasPointsA - hasPointsB;
    });
  
    // 6. Setze die Spiele in den Zustand
    setRandomizedGames(sorted);
  }, [filteredGames, gamePointsMap]); // Add dependencies to prevent infinite loop
  
  
  
  

  
  

  const [isScrolled, setIsScrolled] = useState(false); // Default: false
  const [hydrated, setHydrated] = useState(false); // Flag für Hydration

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && typeof window !== "undefined") {
      const handleScroll = () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const docHeight = document.body.scrollHeight;
        const remaining = docHeight - (scrollY + windowHeight);
        setIsScrolled(remaining < 50);
      };

      window.addEventListener("scroll", handleScroll);
      handleScroll(); // Initial call

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [hydrated]);

  // Öffnet die InfoBox mit den Daten des Spiels
  const handleInfoOpen = (game: Game, settings:Settings) => {
    const selectedLanguage = game.languages[language];
    const gameData: GameData = {
      id: game.id,
      title: selectedLanguage?.title || "Unbekannt",
      story: selectedLanguage?.story || "Keine Beschreibung verfügbar",
      capacity: selectedLanguage?.capacity || "Keine Kapazität verfügbar",
      content: selectedLanguage?.content || "Keine Anleitung verfügbar",
      points: selectedLanguage?.points || "Keine Punkte verfügbar",
      station: selectedLanguage?.station || "Keine Station verfügbar",
      timeLeft: (settings.ending.getTime() - Date.now()),
      started: !!settings.started,
      tagged: game.tagged || "",
      url: game.url,
      languages: Object.keys(game.languages).map((key) => ({
        language: key,
        title: game.languages[key].title,
        story: game.languages[key].story,
      })),
    };
    setSelectedGame(gameData);
    setShowInfo(true);
  };

  const handleInfoClose = () => {
    setShowInfo(false);
    setSelectedGame(null);
  };


const handleFetchPointsForGames = () => {
  setfetchPointsForGames(true);
}

useEffect(() => {
    const teamId = Number(team?.id);
    const isValidTeamId = !isNaN(teamId) && teamId > 0;
    console.log("team?.id:", team?.id);
    console.log("isValidTeamId:", isValidTeamId);

    if (!isValidTeamId) return;

    const loadGamePoints = async () => {
      const temp = localStorage.getItem("playedGames") || "";
      let playedGames = temp || "0+";

      const map: Record<number, boolean> = {};

      await Promise.all(
        games.map(async (game) => {
          try {
            if (temp.includes("0+") && !temp.includes(team.id)) {
              const res = await fetch(`/api/hasPoints?teamId=${teamId}&gameId=${game.id}`);
              if (!res.ok) return;

              const text = await res.text();
              const data = text ? JSON.parse(text) : { hasPoints: false };

              if (data.hasPoints || temp.includes("+"+team.id+"+")) {
                playedGames += `+${game.id}+`;
              }
            }

            if (
              playedGames.includes(
                game.id < 10 ? `0${game.id}` : game.id.toString()
              )
            ) {
              map[game.id] = true;
            }
          } catch (err) {
            console.error(`Fehler bei Spiel ${game.id}:`, err);
            map[game.id] = false;
          }
        })
      );

      localStorage.setItem("playedGames", playedGames);
      setGamePointsMap(map);


    };

    loadGamePoints();
    setfetchPointsForGames(false);
  }, [team?.id, games, fetchPointsForGames]);



  

  return (
    <main className="flex min-h-screen flex-col p-1 sm:p-8 pt-20 bg-pink-50 dark:bg-gray-900">
      <div className="flex-1 w-full transition-all duration-300">
        <input
          type="text"
          placeholder="Suche nach Spielnummer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`${isModalOpen ? "hidden" : "block"} 
            fixed z-50 
            left-1/2 transform -translate-x-1/2 
            sm:top-20 sm:bottom-auto 
            p-3 pl-6 pr-6 w-full max-w-md 
            text-gray-800 dark:text-white 
            bg-white dark:bg-gray-700 
            border border-gray-300 dark:border-gray-600 
            rounded-xl shadow-lg 
            focus:outline-none focus:ring-2 focus:ring-pink-500 transition ${isScrolled ? "bottom-40" : "bottom-5"}
            `}
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 mt-10">
          {randomizedGames.length === 0 && !searchQuery && (
            <p className="col-span-full text-center text-gray-500">Keine Spiele gefunden.</p>
          )}

          {randomizedGames.map((game) => (
            
            <div
              key={game.id}
              className="relative flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden group cursor-pointer transition duration-300 ease-in-out hover:shadow-xl hover:scale-105"
              onClick={() => handleInfoOpen(game, settings)}
            >
              <Image
                src={`/images/christmas_calender${game.id % 5}.jpg`}
                alt="Türchen Cover"
                className={`w-full h-64 object-cover bg-gray-300 ${gamePointsMap[game.id] === true ? "grayscale" : "" }`}
                width={500}
                height={500}
              />
              <div className="absolute inset-0 flex items-center justify-center text-white text-5xl font-bold">
                {game.id < 10 ? "0" : ""}{game.id}
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black to-transparent text-white">
                <h2 className="text-xl font-semibold">{game.languages[language]?.title}</h2>
              </div>
            </div>
          ))}
        </div>
        {showInfo && selectedGame && <InfoBox message={selectedGame} onClose={handleInfoClose} onSave={handleFetchPointsForGames} />}
      </div>
    </main>
  );
}
