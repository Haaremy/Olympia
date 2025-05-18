"use client";

import { useSession, signOut } from "next-auth/react"; 
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import InfoBox from "../infoBox";

export default function Page() {
  const [searchedTeam, setSearchedTeam] = useState<SearchedTeam | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showSaved, setShowSaved] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");

  // Hier string als datetime-local speichern (z.B. "2025-05-18T14:00")
  const [ending, setEnding] = useState('');
  const [started, setStarted] = useState(false);

  const nameTRef = useRef<HTMLInputElement>(null);
  const user1Ref = useRef<HTMLInputElement>(null);
  const user2Ref = useRef<HTMLInputElement>(null);
  const user3Ref = useRef<HTMLInputElement>(null);
  const user4Ref = useRef<HTMLInputElement>(null);

  type SearchedTeam = {
    id: number;
    credentials: string;
    name: string;
    players: string[];
    games: {
      gameId: number;
      title: string;
      points: {
        player: string;
        value: number;
      }[];
    }[];
  };

  type Settings = {
    started: boolean;
    ending: string; // string statt Date
  }

  // Hilfsfunktion: Datum aus ISO oder Date zu datetime-local String konvertieren
  const toDateTimeLocalString = (dateString: string | Date): string => {
    const date = new Date(dateString);
    const pad = (num: number) => num.toString().padStart(2, '0');
    const offsetMinutes = date.getTimezoneOffset()/60;
    date.setHours(date.getHours() + offsetMinutes);

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    fetch('/api/settings')
      .then(res => {
        if (!res.ok) throw new Error('Fehler beim Laden der Einstellungen');
        return res.json();
      })
      .then((data: Settings) => {
        if (data) {
          if (data.ending) setEnding(toDateTimeLocalString(data.ending));
          if (typeof data.started === 'boolean') setStarted(data.started);
        }
      })
      .catch(err => console.error(err));
  }, []);

  // Session & Role Handling (wie gehabt)
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/");
    } else {
      const role = session.user?.role;
      if (role !== "ADMIN") {
        router.push(role === "USER" ? "/teampage" : "/");
      }
    }
  }, [session, status, router]);

  if (!session) {
    return <div>Loading...</div>; 
  }

  const getOffset = (ending: string) => {
  const date = new Date(ending);
  const offsetMs = new Date().getTimezoneOffset() * 60 * 1000;
  const correctedDate = new Date(date.getTime() - offsetMs);
  return correctedDate.toISOString();
};


  const handleSaveSettings = async () => {
    // Validierung des Datumsstrings für datetime-local (YYYY-MM-DDTHH:mm)
    if (!ending.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) {
      handleSavedMessage('Bitte gib ein gültiges Datum im Format YYYY-MM-DDTHH:mm ein!');
      return;
    }

  

    try {
      const end = getOffset(ending);
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          started,
          ending: end,  // String direkt senden
        }),
      });

      if (!res.ok) throw new Error('Fehler beim Speichern');
      handleSavedMessage('Einstellungen gespeichert ✅');
    } catch (error) {
      console.error(error);
      handleSavedMessage('Fehler beim Speichern ❌');
    }
  };

  // Restliche Funktionen wie handleSave, handleLogout, handleSearch etc. bleiben gleich
  // (siehe deinen Originalcode, ich kürze hier aus Platzgründen)

  const handleSave = async () => {
    // wie gehabt
  };

  const handleSavedMessage = (info: string) => {
    setInfoMessage(info);
    setShowSaved(true);
  };

  const handleClose = () => {
    setShowSaved(false);
  };

  const handleLogout = () => {
    signOut();
  };

  const handleSearch = async () => {
    if (!searchQuery) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/team/search?query=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();

      if (data.found) {
        setSearchedTeam(data.team);
      } else {
        setSearchedTeam(null);
      }
    } catch (error) {
      console.error('Error while fetching team:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full flex min-h-screen flex-col items-center justify-between sm:p-6 p-4 pt-8 bg-gray-900 text-white">
      <div className="flex flex-col w-full max-w-3xl justify-center text-center">
        {showSaved && (
          <InfoBox
            message={infoMessage}
            title="Info"
            color="red"
            onClose={handleClose}
          />
        )}

        <div className="w-full flex justify-center px-4 py-2 mt-20 mb-10">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>

        {/* Suchleiste */}
        <div className="inline-flex mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Team ID or Team Name"
            className="p-2 w-full max-w-md rounded-lg bg-gray-800 text-white border border-gray-600"
          />
          <button
            onClick={handleSearch}
            className="ml-4 py-2 px-4 bg-blue-500 hover:bg-blue-400 text-white rounded-lg"
          >
            Suche
          </button>
        </div>

        {loading && <p className="text-center">Loading...</p>}

        {searchedTeam && !loading && (
          <div className="w-full mt-8 p-4 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold">{`Team <${searchedTeam?.credentials}>`}</h2>
            <input
              type="text"
              className="w-full mt-2 p-3 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
              defaultValue={searchedTeam?.name || ''}
              ref={nameTRef}
            />

            <div className="mt-4">
              <h3 className="font-semibold">Player:</h3>
              <ul className="list-disc ml-4">
                {searchedTeam.players.map(
                  (player, index) =>
                    player !== '' && (
                      <li key={index}>
                        <input
                          type="text"
                          className="w-full mt-2 p-3 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                          defaultValue={player || ''}
                          ref={
                            [user1Ref, user2Ref, user3Ref, user4Ref][index]
                          }
                        />
                      </li>
                    )
                )}
              </ul>
            </div>

            {/* Spiele und Punkte */}
            <div className="mt-6">
              <h3 className="font-semibold">Games and Points:</h3>
              {searchedTeam.games && searchedTeam.games.length > 0 ? (
                searchedTeam.games.map((game) => (
                  <div key={game.gameId} className="mt-4">
                    <h4 className="font-bold">{game.title}</h4>
                    <ul className="list-disc ml-4">
                      {game.points.map((point, index) => (
                        <li key={index}>
                          {point.player}: {point.value} points
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p>No games found for this team.</p>
              )}
            </div>
            <button
              onClick={handleSave}
              className="py-2 px-6 bg-green-600 hover:bg-green-500 rounded-lg text-white"
            >
              Einstellungen speichern
            </button>
          </div>
        )}

        {/* Spieleinstellungen */}
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Spieleinstellungen</h2>

          <div>
            <label className="block mb-1">Spielende:</label>
            <input
              type="datetime-local"
              value={ending}
              onChange={(e) => setEnding(e.target.value)}
              className="p-2 w-full max-w-md rounded-lg bg-gray-800 text-white border border-gray-600 mb-4"
            />

            <label className="block mb-1">Spiele starten:</label>
            <input
              type="checkbox"
              checked={started}
              onChange={() => setStarted(!started)}
              className="mb-4"
            />

            <button
              onClick={handleSaveSettings}
              className="py-2 px-6 bg-green-600 hover:bg-green-500 rounded-lg text-white"
            >
              Einstellungen speichern
            </button>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="py-2 px-6 bg-red-600 hover:bg-red-500 rounded-lg text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}
