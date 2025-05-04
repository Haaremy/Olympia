"use client";

import { useSession, signOut, getSession } from "next-auth/react"; 
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRef } from "react";
import InfoBox from "../infoBox";
import i18n from "@/lib/i18n";


export default function Page() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showSaved, handleShowSaved] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");

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

  const [searchedTeam, setSearchedTeam] = useState<SearchedTeam | null>(null);

  // Umschalten des Darkmode
  const { data: session, status } = useSession();

  // Sicherstellen, dass die Session geladen ist und den Benutzer weiterleiten
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

  const handleSave = async () => {
      const name = nameTRef.current?.value || null;
      const user1 = user1Ref.current?.value || null;
      const user2 = user2Ref.current?.value || null;
      const user3 = user3Ref.current?.value || null;
      const user4 = user4Ref.current?.value || null;
  
      // --- Validierung ---
    if (!user1 || !user2) {
      //alert("");
      handleSavedMessage("Bitte fülle mindestens Spieler 1 und Spieler 2 aus.");
      return;
    }
  
    if ((user3 && !user4) || (!user3 && user4)) {
      handleSavedMessage("Bitte fülle entweder beide zusätzlichen Spieler (3 & 4) aus oder lasse beide leer.");
      return;
    }
  
      const res = await fetch("/api/team/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          user1,
          user2,
          user3,
          user4,
          language: i18n.language,
        }),
      });
  
      const result = await res.json();
      console.log(result);
  
      // 🌀 Session neuladen nach erfolgreichem Speichern (optional)
      if (res.ok) {
        await getSession(); // Session neu holen
        router.refresh(); // ⬅️ Nur bei App Router (du verwendest `useRouter` also passt es!)
        handleSavedMessage("Team erfolgreich gespeichert.");
      } else {
        handleSavedMessage("Fehler beim Speichern. Bitte versuche es erneut.");
      }
    };

   const handleSavedMessage = (info: string) => {
      setInfoMessage(info);
      handleShowSaved(true);
    }
  
    const handleClose = () => {
      handleShowSaved(false);
    }
  
    const handleLogout = () => {
      signOut(); // Abmelden
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
      {showSaved && <InfoBox message={infoMessage} onClose={handleClose}></InfoBox> }
      <div className="w-full flex justify-center items-center px-4 py-2 mt-20 mb-10">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>
        {/* Suchleiste */}
        <div className="inline-flex mb-4 items-center">
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

        {/* Loading oder Ergebnisse */}
        {loading && <p className="text-center">Loading...</p>}

        {searchedTeam && !loading && (
          <div className="w-full mt-8 p-4 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold">{`Team <${searchedTeam?.credentials}>`} 
              <input
                type="text"
                className="w-full mt-2 p-3 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                defaultValue={searchedTeam?.name || ""}
              />
            </h2>
            <div className="mt-4">
              <h3 className="font-semibold">Player:</h3>
              <ul className="list-disc ml-4">
                {searchedTeam.players.map((player, index) =>
                  player !== "" ? <li key={index}>
                    <input
                type="text"
                className="w-full mt-2 p-3 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                defaultValue={player || ""}
              />
                    </li> : null
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
          </div>
        )}
      </div>
      {/* Speichern-Button */}
      <button
          className={`${!!session.user.user1 && !!session.user.user2 && !!session.user.name ? "hidden" : "fixed"} bottom-20 right-6 px-6 py-3 bg-pink-500 text-white rounded-lg shadow-lg hover:bg-pink-900 transition duration-300`}
          onClick={handleSave}
        >
          &#x1F4BE;
        </button>

        {/* Logout-Button */}
        <button
          className="fixed bottom-4 right-6 px-6 py-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-pink-500 transition duration-300"
          onClick={handleLogout}
        >
          Logout
        </button>
    </main>
  );
}
