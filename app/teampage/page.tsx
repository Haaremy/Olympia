'use client'
import { signOut, useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import '../../lib/i18n';
import { t } from "i18next";
import { useRef } from "react";
import InfoBox from "../infoBox";
import Image from "next/image";



export default function Page() {
  const [darkMode, setDarkMode] = useState(true);
  const [showAdditionalPlayers1, setShowAdditionalPlayers1] = useState(false);
  const [showAdditionalPlayers2, setShowAdditionalPlayers2] = useState(false);
  const { i18n } = useTranslation();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showSaved, handleShowSaved] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");
  const [infoTitle, setInfoTitle] = useState("!?!?!");
  const [infoColor, setInfoColor] = useState("red");
  const [updateData, setUpdateData] = useState(false);
  const [teamData, setTeamData] = useState<{
  id?: number;
  credentials?: string;
  name?: string;
  players?: string[];
}>({
  id: 0,
  credentials: "",
  name: "",
  players: ["","","",""]
});


  const nameTRef = useRef<HTMLInputElement>(null);
  const user1Ref = useRef<HTMLInputElement>(null);
  const user2Ref = useRef<HTMLInputElement>(null);
  const user3Ref = useRef<HTMLInputElement>(null);
  const user4Ref = useRef<HTMLInputElement>(null);

  


  const handleSave = async () => {
    const name = nameTRef.current?.value || null;
    const user1 = user1Ref.current?.value || null;
    const user2 = user2Ref.current?.value || null;
    const user3 = user3Ref.current?.value || null;
    const user4 = user4Ref.current?.value || null;

    // --- Validierung ---
  if (!user1 || !user2) {
    //alert("");
    handleSavedMessage("Bitte fülle mindestens Spieler 1 und Spieler 2 aus.", "Fehler", "red");
    return;
  }


  if ((!user3 && user4)) {
    handleSavedMessage("Bitte fülle zuerst den zusätzlichen Spieler 3 aus oder lasse beide leer.", "Fehler", "red");
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

    if (res.ok) {
      
      handleSavedMessage("Team erfolgreich gespeichert.", "Gespeichert", "pink");
      //await new Promise((resolve) => setTimeout(resolve, 10000));
      setUpdateData(true);
    } else {
      handleSavedMessage("Fehler beim Speichern. Bitte versuche es erneut.", "Fehler", "red");
    }
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const handleSavedMessage = (info: string, title: string, color: string) => {
    setInfoMessage(info);
    setInfoTitle(title);
    setInfoColor(color);
    handleShowSaved(true);
  }

  const handleClose = () => {
    handleShowSaved(false);
  }

  const handleLogout = async () => {
    await signOut({ redirect: false });
    // Du kannst hier auch eine benutzerdefinierte Weiterleitung hinzufügen:
    localStorage.setItem("playedGames", "0+")
    router.push('/');
  };

 const getTeam = useCallback(async () => {
      const res = await fetch(`/api/team/search?query=${session?.user.credentials}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    }); 
    const data = await res.json();
    return data;
    },[session?.user.credentials]);

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/");
    } else if (session?.user?.credentials) {
     

   
      const fetchTeam = async () => {
      const response = await getTeam();
      setTeamData(response.team); // setze nur das team-Objekt
      
      }
      fetchTeam();
    }
    setUpdateData(false);
  }, [status, session, router, updateData, getTeam]);
  
  if (status === "loading") {
    return <div className="text-center text-gray-500 mt-10">Loading...</div>; // Oder ein Skeleton Loader
  }
  

 const renderPlayerInput = (
  label: string,
  ref: React.RefObject<HTMLInputElement | null>,
  index: number
) => (
  <div className="flex-1">
    <label className="block text-gray-800 dark:text-white text-lg">{label}</label>
    <input
      type="text"
      ref={ref}
      className="w-full mt-2 p-3 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
      placeholder={`${t("enterPlayer")} ${index + 1}>`}
      defaultValue={teamData?.players?.[index] || ""}
      disabled={!!teamData?.players?.[index]}
    />
  </div>
);




  if (!session) {
    return ( <main className={`w-full flex min-h-screen min-w-screen flex-col items-center justify-between sm:p-6 p-4 pt-20 ${darkMode ? 'bg-gray-900' : 'bg-pink-50'} transition-all duration-300`}></main>)
  } else {
    return (
      <main className={`w-full flex min-h-screen min-w-screen flex-col items-center justify-between sm:p-6 p-4 pt-20 ${darkMode ? 'bg-gray-900' : 'bg-pink-50'} transition-all duration-300`}>
        {/* Hauptbereich */}
        <div className="flex-1 w-full max-w-3xl transition-all duration-300">
        {showSaved && <InfoBox message={infoMessage} title={infoTitle} color={infoColor} onClose={handleClose}></InfoBox> }
          {/* Header-Bereich */}
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center m-4">
            Team
            <input
              type="text"
              ref={nameTRef}
              className="w-full mt-2 p-3 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder={t("enterTeam")}
              defaultValue={teamData.name || ""}
              disabled={!!teamData.name}
            />
          </h1>

         {/* Team-Mitglieder: Player 1 & 2 */}
<div className="grid grid-cols-2 gap-4 mb-6">
  {/* Player 1 */}
  <div>
    {renderPlayerInput("Player 1:", user1Ref, 0)}
  </div>

  {/* Player 2 */}
  <div>
    {renderPlayerInput("Player 2:", user2Ref, 1)}
  </div>

  {/* Player 3 */}
  <div>
    {(!showAdditionalPlayers1 && !teamData?.players?.[2]) ? (
      <button
        onClick={() => setShowAdditionalPlayers1(true)}
        className={`w-full mt-9 p-3 border rounded-lg  dark:text-white border-black-500 dark:border-white-500 ${!teamData?.name ? "bg-white dark:bg-blue-700" : "bg-gray dark:bg-gray-700"}`}
        disabled={!!teamData?.name}
      >
        + Player 3
      </button>
    ) : (
      renderPlayerInput("Player 3:", user3Ref, 2)
    )}
  </div>

  {/* Player 4 */}
  <div>
    {(!showAdditionalPlayers2 && !teamData?.players?.[3]) ? (
      <button
        onClick={() => setShowAdditionalPlayers2(true)}
        className={`w-full mt-9 p-3 border rounded-lg  dark:text-white border-black-500 dark:border-white-500 ${!teamData?.name ? "bg-white dark:bg-blue-700" : "bg-gray dark:bg-gray-700"}`}
        disabled={!!teamData?.name}
      >
        + Player 4
      </button>
    ) : (
      renderPlayerInput("Player 4:", user4Ref, 3)
    )}
  </div>
</div>





          {/* Einstellungen */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{t("browserSettings")}</h2>

            <div className="mt-4">
              <div className="flex items-center">
                <Image
                  src={`/images/globe.svg`}
                  alt="Globe Icon"
                  className="max-w-8 h-8 object-cover bg-gray-300 rounded-lg"
                  width={50}
                  height={50}
                  />
              </div>
              <select
                value={i18n.language}
                onChange={(e) => handleLanguage(e.target.value)}
                className="w-full mt-2 p-3 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                <option value="en">English</option>
                <option value="de">Deutsch</option>
              </select>
            </div>

            <div className="mt-4">
              <label className="block text-gray-800 dark:text-white">Design:</label>
              <select
                value={darkMode ? 'dark' : 'light'}
                onChange={() => toggleDarkMode()}
                className="w-full mt-2 p-3 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                <option value="light">{t("light")}</option>
                <option value="dark">{t("dark")}</option>
              </select>
            </div>
            
          </div>
          
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
}
