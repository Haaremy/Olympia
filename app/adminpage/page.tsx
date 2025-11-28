"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import InfoBox from "../infoBox";
import { Capacitor } from "@capacitor/core";
import { Button, CLink, Main, TextInput} from "@cooperateDesign";
import DeleteConfirmModal from "../confirmDelete";

type SearchedTeam = {
  id: number;
  uname: string;
  name: string;
  players: string[];
  cheatPoints: number;
  contact: string;
  games: {
    id: number;
    title: string;
    points: { player: string; value: number }[];
  }[];
};


type Settings = {
  started: boolean;
  ending: string;
};

interface Report {
  id: number;
  gameId: number;
  message: string;
  createdAt: string;
  teamId: number;
  teamName: string;
}

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
  const [showReports, setShowReports] = useState(false);
  const gamesMap = new Map(searchedTeam?.games?.map(g => [g.id, g]));
  const [reports, setReports] = useState<Report[][]>([]);
    const [deleteConfirm, setDeleteConfirm] = useState(false);


const allGameIds = Array.from({ length: 24 }, (_, i) => i + 1); // 1..24

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
  const handleCloseDelete = () => setDeleteConfirm(false);

  const handleLogout = () => {
    localStorage.setItem("playedGames", "");
    signOut();
    router.push("/");
  }

    useEffect(() => {
    let isMounted = true; // verhindert setState nach Unmount
    const fetchReports = async () => {
      const temp: Report[][] = [];

      for (let index = 1; index <= 24; index++) {
        try {
          const res = await fetch(`/api/report/get?query=${index}`);
          const data = await res.json();
          if (data.success && data.reports) {
            temp[index - 1] = data.reports; // Array von Arrays, index-1 für 0-basiert
          } else {
            temp[index - 1] = [];
          }
        } catch (err) {
          console.error(`Error fetching reports for index ${index}:`, err);
          temp[index - 1] = [];
        }
      }

      if (isMounted) setReports(temp);
    };

    fetchReports(); // initial
    const interval = setInterval(fetchReports, 30000); // alle 30 Sekunden

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

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
      const res = await fetch(`/api/admin/team/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: searchedTeam.id, name, players }),
      });
      if (!res.ok) throw new Error("Fehler beim Speichern");
      handleSavedMessage("Team gespeichert ✅");
    } catch (err) {
      console.error(err);
      handleSavedMessage("Fehler beim Speichern ❌");
    }
  };

  const handlePointsUpdate = async (gameId: number) => {
  if (!searchedTeam) return;

  const inputs = Array.from(
    document.querySelectorAll(`div[data-game-id="${gameId}"] input[type="number"]`)
  ) as HTMLInputElement[];

  if (inputs.length === 0) return;

  const points = inputs.map((input) => ({
    value: parseInt(input.value) || 0,
  }));
  const user1 = points[0]?.value ?? 0;
  const user2 = points[1]?.value ?? 0;
  const user3 = points[2]?.value ?? 0;
  const user4 = points[3]?.value ?? 0;

  try {
    const res = await fetch(`/api/admin/team/points`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId, user1,user2,user3,user4, teamId: searchedTeam.id }),
    });

    if (!res.ok) throw new Error("Fehler beim Speichern");

    handleSavedMessage(`Punkte für Spiel ${gameId} gespeichert ✅`);
  } catch (err) {
    console.error(err);
    handleSavedMessage(`Fehler beim Speichern der Punkte für Spiel ${gameId} ❌`);
  }
};


  const handleCheater = async () => {
     if (!searchedTeam) return;
     let cheatNum = 50;
     if(searchedTeam.cheatPoints>=12){
      cheatNum = 0;
     } 
    try {
      const res = await fetch(`/api/team/cheat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cheatNum, searchedTeam }),
      });
      if (!res.ok) throw new Error("Fehler beim Speichern");
      searchedTeam.cheatPoints = cheatNum;
      handleSavedMessage("Team Cheating gespeichert ✅");
    } catch (err) {
      console.error(err);
      handleSavedMessage("Fehler beim Speichern ❌");
    }
  }

  const handleTeamDelete = async () => {
     if (!searchedTeam) return;
      setDeleteConfirm(true);
  }

  const handleImageDelete = async () => {
     if (!searchedTeam) return;
    try {   
      const res = await fetch(`/api/image/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageName: searchedTeam.uname.toLowerCase()+".jpg" }),
      });
      if (!res.ok) throw new Error("Fehler beim Löschen");
      handleSavedMessage("Team Image gelöscht ✅");
    }
    catch (err) {
      console.error(err);
      handleSavedMessage("Fehler beim Löschen ❌");
    }
  }

// Bericht löschen

  const deleteReport = async (id: number) => {
  if (!id) return;

  try {
    const res = await fetch("/api/report/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error || "Fehler beim Löschen");
    }

    // ✅ Optimistisch aus dem State löschen
    setReports((prev) =>
      prev.map((reportArr) =>
        reportArr.filter((item) => item.id !== id) // <-- hier `id` statt `r.id`
      )
    );

    const data = await res.json();
    return data; // { success: true, report: {...} }
  } catch (err) {
    console.error("deleteReport error:", err);
    return null;
  }
};



  if (!session) return <div>Loading...</div>;

 return (
  <Main>
    {showSaved && <InfoBox message={infoMessage} title="Info" color="red" onClose={handleClose} />}
    
    <h1 className={`text-3xl font-bold mb-6 text-center ${isAndroid ? "mt-16" : "mt-4"}`}>Admin Dashboard</h1>
    
    {/* Buttons for switching views */}
    <div className="inline-flex overflow-hidden w-full justify-center mb-6">
      <Button
        onClick={() => setShowReports(!showReports)}
        switchOn={!showReports}
      variant="switch"
      className="rounded-l-lg rounded-r-none"
      >
        Team suchen
      </Button>
      <Button
        onClick={() => setShowReports(!showReports)}
        switchOn={showReports}
      variant="switch"
      className="rounded-r-lg rounded-l-none"
      >
        Meldungen sehen
      </Button>
    </div>

    {/* SEARCH */}
    {!showReports ? (
      <>
        <div className="flex flex-col sm:flex-row items-center mb-6 gap-4 w-full max-w-lg">
          <TextInput
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Team ID or Name"
            className="flex-1"
          />
          <Button
            onClick={handleSearch}
          >
            Suche
          </Button>
        </div>
        
        {loading && <p>Loading...</p>}

        {/* TEAM CARD */}
        {searchedTeam && (
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-3xl mb-6">
            <h2 className="text-xl font-bold mb-4">{`Team <${searchedTeam.uname}>`}</h2>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Team Name:</label>
              <TextInput
                type="text"
                ref={nameTRef}
                defaultValue={searchedTeam.name}
                
              />
              <div className="mb-4">
              <label className="block font-semibold mb-1">Kontakt:</label>
              <TextInput
                type="text"
                ref={nameTRef}
                defaultValue={searchedTeam.contact}
                
              />

            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2">Players:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {searchedTeam.players.map((p, i) => (
                  <div key={i}>
                    <label className="block text-sm mb-1 text-white">{`Player ${i + 1}`}</label>
                    <TextInput
                      type="text"
                      defaultValue={p}
                      ref={userRefs[i]}
                      
                    />

                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 mt-4">
              <Button onClick={handleSaveTeam} className="w-full sm:w-auto">
                Team speichern
              </Button>

              <Button
                onClick={handleCheater}
                variant="warn"
                className="w-full sm:w-auto"
              >
                {searchedTeam.cheatPoints >= 12
                  ? "Team re-qualifizieren"
                  : "Team disqualifizieren"}
              </Button>

              <Button
                onClick={handleTeamDelete}
                variant="danger"
                className="w-full sm:w-auto"
              >
                Team löschen
              </Button>

              <Button
                onClick={handleImageDelete}
                className="w-full sm:w-auto"
              >
                Delete Team Image
              </Button>
            </div>
          </div>
        )}

        {searchedTeam && allGameIds.map((id: number) => {
  const game = gamesMap.get(id);

  // Prepare points (default to -1 if empty)
  const points =
    game?.points ??
    searchedTeam?.players.map((name: string) => ({ player: name, value: -1 })) ??
    [];

  return (
    <div
      key={id}
      data-game-id={id}
      className="text-white border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg p-4 mb-4 w-full"
    >
      <details>
        <summary className="w-full font-bold text-lg mb-4">
          Spiel {id}
        </summary>

        {points.map((p, idx) => (
          <div
            key={`${id}-${idx}`}
            className="grid grid-cols-2 gap-4 mb-3"
          >
            <div>
              <label className="block text-sm mb-1 text-white">
                {p.player}
              </label>
              <TextInput
                type="number"
                defaultValue={p.value}
                className="p-2 rounded-lg"
              />

            </div>
          </div>
        ))}

        <Button
          onClick={() => handlePointsUpdate(id)}
          className="py-2 px-6 bg-pink-500 hover:bg-pink-600 rounded-lg text-white"
        >
          Speichern
        </Button>
      </details>
    </div>
  );
})}

      </>
    ) : (
      <div>
      {reports.map((reportArr, i) => (
  <div
    key={i}
    className={`${
      reportArr.length > 0 ? "" : "hidden"
    } mb-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow`}
  >
    <details className="p-4">
      <summary className="cursor-pointer text-lg font-semibold text-gray-800 dark:text-gray-200">
        Spiel {i + 1} ({reportArr.length} Reports)
      </summary>

      <div className="mt-4 space-y-3">
        {reportArr.length > 0 ? (
          reportArr.map((r) => (
            <div
              key={r.id}
              className="relative rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 shadow-sm"
            >
              {/* ❌ Delete Button */}
              <Button
                onClick={() => deleteReport(r.id)}
                variant="danger"
                className="absolute top-2 right-2 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow"
                title="Löschen"
              >
                🗑️
              </Button>

              <p className="text-sm text-gray-700 dark:text-gray-300">
                {r.message}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Sender: <span className="italic">{r.teamName}</span>
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {new Date(r.createdAt).toLocaleString("de-DE", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">Keine Reports vorhanden.</p>
        )}
      </div>
    </details>
  </div>
))}
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
      <Button onClick={handleSaveSettings} variant="primary">
        Einstellungen speichern
      </Button>
    </div>

    {/* LOGOUT */}
    <Button onClick={handleLogout} variant="danger">
      Logout
    </Button>
    <CLink
      href="/fire"
      className="mt-4"
    >
      <p className="text">Olympia-Feuer</p>
    </CLink>
    <Button
      onClick={() => router.push('/teampage')}
      className="mt-4"
    >
      Teampage
    </Button>
    {deleteConfirm && (
      <DeleteConfirmModal onClose={handleCloseDelete} teamName={searchedTeam?.uname}/>
    )}
  </Main>
);

}
