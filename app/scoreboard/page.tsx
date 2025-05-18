'use client';

import React, { useEffect, useState } from "react";

// Deine bestehenden Interfaces
interface Team {
  id: number;
  name: string;
  user1: string;
  user2: string;
  user3: string;
  user4: string;
  pointsTotal: number;
  entries: {
    id: number;
    value: number;
    player: string;
    lastUpdated: Date;
    game: {
      id: number;
      language: string;
      hidden: boolean;
      tagged: string;
    };
  }[];
}

interface Record {
  gameId: number,
      language: string,
      hidden: boolean,
      tagged: string | "",
      topPlayer: string,
      topPoints: number,
      topEntries: number,
      team: Team
}

// Main Component
export default function ScoreboardTabs() {
  const [activeTab, setActiveTab] = useState<"scoreboard" | "records">("scoreboard");

  const [teams, setTeams] = useState<Team[]>([]);
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScoreboardAndRecords = async () => {
      try {
        // Hole sowohl die Scoreboard- als auch die Records-Daten in parallelen API-Aufrufen
        const [scoreboardRes, recordsRes] = await Promise.all([
          fetch("/api/scoreboard"),
          fetch("/api/records"),
        ]);
  
        // Verarbeite die JSON-Antworten, wenn sie erfolgreich sind
        const scoreboardData = await scoreboardRes.json();
        const recordsData = await recordsRes.json();
  
        setTeams([...scoreboardData]); // neuer Array → re-render

        setRecords([...recordsData]); // neuer Array → re-render

      } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
        // Hier könntest du auch Fehlerbehandlung einfügen, falls API-Aufrufe fehlschlagen
      } finally {
        setLoading(false); // Ladezustand zurücksetzen
      }
    };
    
    
    const interval = setInterval(() => {
    fetchScoreboardAndRecords();
  }, 3000);

  // Intervall beim Unmount aufräumen
  return () => clearInterval(interval);
  }, []);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <main className="min-h-screen pt-20 bg-pink-50 dark:bg-gray-900 transition-all duration-300 p-4 sm:p-8">
      {/* Tabs */}
      <div className="flex justify-center mb-8  mt-4">
        <div className="inline-flex bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <button
            onClick={() => setActiveTab("scoreboard")}
            className={`px-6 py-2 text-sm font-medium transition ${
              activeTab === "scoreboard"
                ? "bg-pink-500 text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-gray-700"
            }`}
          >
            Scoreboard
          </button>
          <button
            onClick={() => setActiveTab("records")}
            className={`px-6 py-2 text-sm font-medium transition ${
              activeTab === "records"
                ? "bg-pink-500 text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-gray-700"
            }`}
          >
            Weltrekorde
          </button>
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
                <th className="px-6 py-4">Rang</th>
                <th className="px-6 py-4">Team</th>
                <th className="px-6 py-4">Punkte</th>
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
                      <td className="px-6 py-4">{team.name}</td>
                      <td className="px-6 py-4">{team.pointsTotal}</td>
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
      <th className="border px-2 py-1">Spiel</th>
      <th className="border px-2 py-1">{team.user1}</th>
      <th className="border px-2 py-1">{team.user2}</th>
      <th className="border px-2 py-1">{team.user3 || "Spieler 3"}</th>
      <th className="border px-2 py-1">{team.user4 || "Spieler 4"}</th>
      <th className="border px-2 py-1">Letztes Update</th>
    </tr>
  </thead>
  <tbody>
    {[...new Set(team.entries.map((p) => p.game.id))].map((gameId) => {
      const pointsForGame = team.entries.filter((p) => p.game.id === gameId);
      const getValue = (player: string | undefined) =>
        pointsForGame.find((p) => p.player === player)?.value ?? "-";
      const updated = pointsForGame[0]?.lastUpdated
        ? formatDate(pointsForGame[0].lastUpdated)
        : "-";

      return (
        <tr key={gameId} className="even:bg-gray-50 dark:even:bg-gray-800">
          <td className="border px-2 py-1">{gameId}</td>
          <td className="border px-2 py-1">{team.entries[i].game.hidden ? "????" : getValue(team.user1)==-1  ? "-" : getValue(team.user1)}</td>
          <td className="border px-2 py-1">{team.entries[i].game.hidden ? "????" : getValue(team.user2)==-1 || team.entries[i].game.tagged.includes("field1")? "-" : getValue(team.user1)}</td>
          <td className="border px-2 py-1">{team.entries[i].game.hidden ? "????" : getValue(team.user3)==-1 || team.entries[i].game.tagged.includes("field1")? "-" : getValue(team.user1)}</td>
          <td className="border px-2 py-1">{team.entries[i].game.hidden ? "????" : getValue(team.user4)==-1 || team.entries[i].game.tagged.includes("field1")? "-" : getValue(team.user1)}</td>
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











        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {records.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">Keine Weltrekorde gefunden.</p>
          ) : (
            records.map((record) => record.topPlayer && !record.tagged.includes("hidden") && (
              <div
                key={record.gameId}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 transition duration-300 hover:shadow-xl hover:scale-105"
              >
                <h3 className="text-lg font-semibold text-pink-500 dark:text-pink-500 mb-2">
                  Spiel {record.gameId}
                </h3>
                <p className="text-grey-900 dark:text-grey-900 mt-2 font-medium">
                  👑 {record.team.name} {!record.tagged.includes("overridePlayer") ? `- ${record.topPlayer}` : ""}
                </p>
                <p className="text-grey-900 dark:text-grey-900 mt-2 font-medium">
                  Rekord: {record.topEntries} {record.tagged ? record.tagged.split(":unit:")[1] : ""} <br/>
                  ({record.topPoints} Punkte)
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </main>
  );
}
