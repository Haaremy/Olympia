"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import InfoBox from "../infoBox";
import Link from "next/link";
import { Capacitor } from "@capacitor/core";

type SearchedTeam = {
  id: number;
  uname: string;
  name: string;
  players: string[];
  games: {
    gameId: number;
    title: string;
    points: { player: string; value: number }[];
  }[];
};

type Settings = {
  started: boolean;
  ending: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [searchedTeam, setSearchedTeam] = useState<SearchedTeam | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");
  const [ending, setEnding] = useState("");
  const [started, setStarted] = useState(false);
    const [isAndroid, setIsAndroid] = useState(false);
  

  const nameTRef = useRef<HTMLInputElement>(null);
  const userRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

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


  const handleSavedMessage = (msg: string) => {
    setInfoMessage(msg);
    setShowSaved(true);
  };

  const handleClose = () => setShowSaved(false);

  const handleLogout = () => {
    localStorage.setItem("playedGames", "");
    signOut();
    router.push("/");
  }

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/");
    else if (session.user?.role !== "ADMIN") {
      router.push(session.user.role === "USER" ? "/teampage" : "/");
    }
      setIsAndroid(Capacitor.getPlatform() === 'android');
    
    fetch("/api/settings")
      .then((res) => {
        if (!res.ok) throw new Error("Fehler beim Laden der Einstellungen");
        return res.json();
      })
      .then((data: Settings) => {
        if (data.ending) setEnding(toDateTimeLocalString(data.ending));
        if (typeof data.started === "boolean") setStarted(data.started);
      })
      .catch(console.error);
  }, [session, status, router]);

  const handleSearch = async () => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/team/search?query=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setSearchedTeam(data.found ? data.team : null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!ending.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) {
      handleSavedMessage("Bitte gib ein gültiges Datum im Format YYYY-MM-DDTHH:mm ein!");
      return;
    }
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ started, ending: getOffsetISO(ending) }),
      });
      if (!res.ok) throw new Error("Fehler beim Speichern");
      handleSavedMessage("Einstellungen gespeichert ✅");
    } catch (err) {
      console.error(err);
      handleSavedMessage("Fehler beim Speichern ❌");
    }
  };

  const handleSaveTeam = async () => {
    if (!searchedTeam) return;
    const name = nameTRef.current?.value || "";
    const players = userRefs.map(ref => ref.current?.value || "");
    try {
      const res = await fetch(`/api/team/update?id=${searchedTeam.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, players }),
      });
      if (!res.ok) throw new Error("Fehler beim Speichern");
      handleSavedMessage("Team gespeichert ✅");
    } catch (err) {
      console.error(err);
      handleSavedMessage("Fehler beim Speichern ❌");
    }
  };

  if (!session) return <div>Loading...</div>;

  return (
    <main className="w-full flex flex-col items-center min-h-screen p-6 bg-gray-900 text-white">
      {showSaved && <InfoBox message={infoMessage} title="Info" color="red" onClose={handleClose} />}
      <h1 className={`text-3xl font-bold mb-6 text-center ${isAndroid ? "mt-8" : "mt-4"}`}>Admin Dashboard</h1>

      {/* SEARCH */}
      <div className="flex flex-col sm:flex-row items-center mb-6 gap-4 w-full max-w-lg">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Team ID or Name"
          className="flex-1 p-2 rounded-lg bg-gray-800 text-white border border-gray-600"
        />
        <button
          onClick={handleSearch}
          className="py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-lg"
        >
          Suche
        </button>
      </div>
      {loading && <p>Loading...</p>}

      {/* TEAM CARD */}
      {searchedTeam && (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-3xl mb-6">
          <h2 className="text-xl font-bold mb-4">{`Team <${searchedTeam.uname}>`}</h2>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Team Name:</label>
            <input type="text" ref={nameTRef} defaultValue={searchedTeam.name} className="w-full p-2 rounded-lg text-white border border-gray-300 dark:border-gray-600 
            rounded-xl shadow-lg 
            focus:outline-none focus:ring-2 focus:ring-pink-500" />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Players:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {searchedTeam.players.map((p, i) => (
                <div key={i}>
                  <label className="block text-sm mb-1 text-white">{`Player ${i + 1}`}</label>
                  <input type="text" defaultValue={p} ref={userRefs[i]} className="w-full p-2 rounded-lg text-white border border-gray-300 dark:border-gray-600 
            rounded-xl shadow-lg 
            focus:outline-none focus:ring-2 focus:ring-pink-500" />
                </div>
              ))}
            </div>
          </div>
          <button onClick={handleSaveTeam} className="py-2 px-6 bg-pink-500 hover:bg-pink-600 rounded-lg text-white mt-2 mr-2">
            Team speichern
          </button>
          <button onClick={handleSaveTeam} className="py-2 px-6 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-white mt-2 mr-2">
            Team disqualifizieren
          </button>
          <button onClick={handleSaveTeam} className="py-2 px-6 bg-red-500 hover:bg-red-600 rounded-lg text-white mt-2">
            Team löschen
          </button>
        </div>
      )}

      {/* GAME SETTINGS CARD */}
       <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-3xl mb-6">
        <h2 className="text-xl font-bold mb-4">Spieleinstellungen</h2>
        <div className="mb-4">
          <label className="block mb-1">Spielende:</label>
          <input
            type="datetime-local"
            value={ending}
            onChange={(e) => setEnding(e.target.value)}
            className="w-full p-2 rounded-lg text-white"
          />
        </div>
        <div className="mb-4 flex items-center gap-2">
          <input type="checkbox" checked={started} onChange={() => setStarted(!started)} />
          <label>Spiele starten</label>
        </div>
        <button onClick={handleSaveSettings} className="py-2 px-6 bg-pink-500 hover:bg-pink-600 rounded-lg text-white">
          Einstellungen speichern
        </button>
      </div>

      {/* LOGOUT */}
      <button onClick={handleLogout} className="mt-6 py-2 px-6 bg-red-600 hover:bg-red-700 rounded-lg text-white">
        Logout
      </button>
      <Link
        href="/fire"
        className="px-4 py-2 mt-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
        >
        <p className="text">Olympia-Feuer</p>
      </Link>
    </main>
  );
}
