'use client'
import { getSession, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import '../../lib/i18n';
import { t } from "i18next";
import { useRef } from "react";
import InfoBox from "../infoBox";
import Image from "next/image";



export default function Page() {
  const [darkMode, setDarkMode] = useState(true);
  const [showAdditionalPlayers, setShowAdditionalPlayers] = useState(false);
  const { i18n } = useTranslation();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showSaved, handleShowSaved] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");
  const [infoTitle, setInfoTitle] = useState("!?!?!");
  const [infoColor, setInfoColor] = useState("red");

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

  if ((user3 && !user4) || (!user3 && user4)) {
    handleSavedMessage("Bitte fülle entweder beide zusätzlichen Spieler (3 & 4) aus oder lasse beide leer.", "Fehler", "red");
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
      handleSavedMessage("Team erfolgreich gespeichert.", "Gespeichert", "pink");
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
    router.push('/');
  };

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/");
    }
  }, [status, session, router]);
  
  if (status === "loading") {
    return <div className="text-center text-gray-500 mt-10">Loading...</div>; // Oder ein Skeleton Loader
  }
  

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
              defaultValue={session.user?.name || ""}
              disabled={!!session.user.name}
            />
          </h1>

          {/* Team-Mitglieder nebeneinander (User 1 und User 2) */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-gray-800 dark:text-white text-lg">Player 1:</label>
              <input
                type="text"
                ref={user1Ref}
                className="w-full mt-2 p-3 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                placeholder={`${t("enterPlayer")} 1`}
                defaultValue={session.user.user1 || ""}
                disabled={!!session.user.user1}  // Disable if player already exists
              />
            </div>

            <div className="flex-1">
              <label className="block text-gray-800 dark:text-white text-lg">Player 2:</label>
              <input
                type="text"
                ref={user2Ref}
                className="w-full mt-2 p-3 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                placeholder={`${t("enterPlayer")} 2`}
                defaultValue={session.user.user2 || ""}
                disabled={!!session.user.user2}  // Disable if player already exists
              />
            </div>
          </div>

          {/* Add more players button */}
          <button
            onClick={() => setShowAdditionalPlayers(!showAdditionalPlayers)}
            className={`${!!session.user.user1 && !!session.user.user2 ? "hidden" : showAdditionalPlayers ? "hidden" : "visible"} w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition duration-300`}
          >
            {showAdditionalPlayers ? "-" : "+ 2 Players"}
          </button>

          {/* Weitere Eingabefelder erscheinen, wenn der Button gedrückt wird (User 3 und User 4 nebeneinander) */}
          {(showAdditionalPlayers || !!session.user.user3) && (
            <div className="flex gap-4 mt-6">
              <div className="flex-1">
                <label className="block text-gray-800 dark:text-white text-lg">Player 3:</label>
                <input
                  type="text"
                  ref={user3Ref}
                  className="w-full mt-2 p-3 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  placeholder={`${t("enterPlayer")} 3`}
                  defaultValue={session.user.user3 || ""}
                  disabled={!!session.user.user3}  // Disable if player already exists
                />
              </div>

              <div className="flex-1">
                <label className="block text-gray-800 dark:text-white text-lg">Player 4:</label>
                <input
                  type="text"
                  ref={user4Ref}
                  className="w-full mt-2 p-3 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  placeholder={`${t("enterPlayer")} 4`}
                  defaultValue={session.user.user4 || ""}
                  disabled={!!session.user.user4}  // Disable if player already exists
                />
              </div>
            </div>
          )}

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
