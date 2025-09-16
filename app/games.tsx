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

type Settings = {
  started: boolean;
  ending: string;
};



export default function GamesPage({ games, searchQueryRef }: { games: Game[], searchQueryRef: string }) {
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
  const [ending, setEnding] = useState("");
  const [started, setStarted] = useState(false);

 // Anzeige für datetime-local (nur lokale Zeit)
const toDateTimeLocalString = (dateString: string | Date): string => {
    const date = new Date(dateString);
    const pad = (num: number) => num.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

// Speichern: datetime-local -> UTC ISO
const getOffsetISO = (dtLocal: string): string => {
    const date = new Date(dtLocal);
    return date.toISOString();
};

  // Setze die Sprache basierend auf i18n und bereits gespielte Spiele
  useEffect(() => {
    setLanguage(i18n.language);
    setfetchPointsForGames(true);
    setSearchQuery(searchQueryRef);
     fetch("/api/settings")
      .then((res) => {
        if (!res.ok) throw new Error("Fehler beim Laden der Einstellungen");
        return res.json();
      })
      .then((data: Settings) => {
        if (data.ending) setEnding(toDateTimeLocalString(data.ending));
        if (typeof data.started === "boolean") setStarted(data.started);
      })
  }, [i18n.language, searchQueryRef]);


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
  if (!fetchPointsForGames) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}, [fetchPointsForGames]);


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
  const handleInfoOpen = (game: Game) => {
    const selectedLanguage = game.languages[language];
    const gameData: GameData = {
      id: game.id,
      title: selectedLanguage?.title || "Unbekannt",
      story: selectedLanguage?.story || "Keine Beschreibung verfügbar",
      capacity: selectedLanguage?.capacity || "Keine Kapazität verfügbar",
      content: selectedLanguage?.content || "Keine Anleitung verfügbar",
      points: selectedLanguage?.points || "Keine Punkte verfügbar",
      station: selectedLanguage?.station || "Keine Station verfügbar",
      timeLeft: (ending.getTime() - Date.now()),
      started: started,
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
    setfetchPointsForGames(true);
    setShowInfo(false);
    setSelectedGame(null);
  };



useEffect(() => {
  const teamId = Number(team?.id);
  if (!teamId || isNaN(teamId)) return;

  const loadGamePoints = async () => {
    const temp = localStorage.getItem("playedGames") || "";
    const playedGamesSet = new Set(temp.split("+").filter(Boolean));

    const map: Record<number, boolean> = {};

    await Promise.all(
      games.map(async (game) => {
        try {
          if (!playedGamesSet.has(String(game.id))) {
            const res = await fetch(`/api/hasPoints?teamId=${teamId}&gameId=${game.id}`);
            if (!res.ok) return;

            const data = await res.json();
            if (data.hasPoints) playedGamesSet.add(String(game.id));
          }

          map[game.id] = playedGamesSet.has(String(game.id));
        } catch (err) {
          console.error(`Fehler bei Spiel ${game.id}:`, err);
          map[game.id] = false;
        }
      })
    );

    localStorage.setItem("playedGames", Array.from(playedGamesSet).join("+"));
    setGamePointsMap(map);
    setfetchPointsForGames(false);
  };

  if (fetchPointsForGames) loadGamePoints();
}, [team?.id, games, fetchPointsForGames]);



  

  return (
    <main className="flex min-h-screen flex-col p-1 sm:p-8 pt-20 bg-pink-50 dark:bg-gray-900">
      <div className="flex-1 w-full transition-all duration-300">
        
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 mt-10">
          {randomizedGames.length === 0 && !searchQuery && (
            <p className="col-span-full text-center text-gray-500">Keine Spiele gefunden.</p>
          )}

          {randomizedGames.map((game) => (
            <div 
            key={game.id} 
            className={` ${randomizedGames[randomizedGames.length - 1].id == game.id ? "mb-4 sm:mb-0" : ""}`}>
            <div
              className={`relative  flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden group cursor-pointer transition duration-300 ease-in-out hover:shadow-xl hover:scale-105 `}
              onClick={() => handleInfoOpen(game)}
            >
              <Image
                src={`/images/christmas_calender${game.id % 5}.jpg`}
                alt="Türchen Cover"
                className={`w-full h-64 object-cover object-right bg-gray-300 dark:brightness-100 brightness-120 ${gamePointsMap[game.id] === true ? "grayscale" : "" }`}
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
            </div>
          ))}
          
        </div>
        {showInfo && selectedGame && <InfoBox message={selectedGame} onClose={handleInfoClose}  />}
        
      </div>
      <input
          type="text"
          placeholder="Suche nach Spielnummer..."
          value={searchQuery}
          onChange={(e) => { 
            setSearchQuery(e.target.value); 
           setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 10);
          }}
          className={`${isModalOpen ? "hidden" : "block"} 
            ${isScrolled ? "mx-auto flex items-center justify-center relative sm:-translate-x-1/2 sm:left-1/2 sm:fixed" : "fixed left-1/2 -translate-x-1/2  bottom-5"} z-50 
               transform
            sm:top-15 sm:bottom-auto lg:top-4 
            w-[95%] sm:w-full lg:w-[25%] sm:w-[50%]
            p-3 pl-6 pr-6  max-w-md 
            text-gray-800 dark:text-white 
            bg-white dark:bg-gray-700 
            border border-gray-300 dark:border-gray-600 
            rounded-xl shadow-lg 
            focus:outline-none focus:ring-2 focus:ring-pink-500 transition 
            `}
        />
    </main>
  );
}
