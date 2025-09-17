'use client'
import { signOut, useSession } from "next-auth/react";
import { useCallback, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import '../../lib/i18n';
import { t } from "i18next";
import InfoBox from "../infoBox";
import Image from "next/image";
import { Capacitor } from "@capacitor/core";
import DeleteConfirmModal from "../confirmDelete";



export default function Page() {
  const { i18n } = useTranslation();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showSaved, handleShowSaved] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");
  const [infoTitle, setInfoTitle] = useState("!?!?!");
  const [infoColor, setInfoColor] = useState("red");
  const [updateData, setUpdateData] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [player3, setPlayer3] = useState(false);
  const [player4, setPlayer4] = useState(false);
  const [userData, setUserData] = useState({
  id: 0,
  uname: "Loading...",
  name: "",
  user1: "",
  user2: "",
  user3: "",
  user4: "",
});
const [wasInput, setWasInput] = useState({
  id: 0,
  user3: "",
  user4: "",
});

const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    setIsAndroid(Capacitor.getPlatform() === 'android');
  }, []);


  const nameTRef = useRef<HTMLInputElement>(null);
  const user1Ref = useRef<HTMLInputElement>(null);
  const user2Ref = useRef<HTMLInputElement>(null);
  const user3Ref = useRef<HTMLInputElement>(null);
  const user4Ref = useRef<HTMLInputElement>(null);

  type playerKey = "user1" | "user2" | "user3" | "user4";

  


  const handleSave = async () => {
    const name = nameTRef.current?.value || null;
    const uname = user1Ref.current?.value || null;


 


    if (!user1Ref.current?.value || !user2Ref.current?.value) {
      handleSavedMessage("Bitte fülle mindestens Player 1 und 2 aus.", "Fehler", "red");
    } else {

    const res = await fetch("/api/team/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        uname,
        user1: user1Ref.current?.value,
        user2: user2Ref.current?.value,
        user3: user3Ref.current?.value,
        user4: user4Ref.current?.value,
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
  }
  };



  


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
    setDeleteConfirm(false);
  }

  const handleLogout = async () => {
    localStorage.setItem("playedGames", "");
    await signOut({ redirect: false });
    // Du kannst hier auch eine benutzerdefinierte Weiterleitung hinzufügen:
    router.push('/');
  };

  const handleDelete = async () => {
    setDeleteConfirm(true);
  };



 const getUser = useCallback(async () => {
      const res = await fetch(`/api/team/search?query=${session?.user.uname}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    }); 
    const data = await res.json();
    return data;
    },[session?.user.uname]);

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/");
    } else if (session?.user?.uname) {
     

   
      const fetchUser = async () => {
      const response = await getUser();
      console.log(response);
      setUserData({
        ...response.team,
        name: response.team.name,
        user1: response.team.players[0],
        user2: response.team.players[1],
        user3: response.team.players[2],
        user4: response.team.players[3],
      }); // setze nur das team-Objekt
      setWasInput({
        ...response.team,
        user3: response.team.players[2],
        user4: response.team.players[3],
      })
      
      }
      fetchUser();
    }
    setUpdateData(false);
  }, [status, session, router, updateData, getUser]);
  
  if (status === "loading") {
    return <div className="text-center text-gray-500 mt-10">Loading...</div>; // Oder ein Skeleton Loader
  }
  
  const handlePlayer = (key: string) => {
     if (key === "user3") {
    setPlayer3(true);
  } else if (key === "user4") {
    if (player3) {
      setPlayer4(true);
    } else {
      setPlayer3(true);
    }
  } else {
    setPlayer3(true);
  }
  }

const renderPlayerInput = (
  label: string,
  fieldKey: "user1" | "user2" | "user3" | "user4",
  ref: React.RefObject<HTMLInputElement | null>, // <-- allow null
  index: number
) => (
  <div className="flex-1">
    <label className="block text-gray-800 dark:text-white text-lg">{label}</label>
    {(fieldKey=="user3" && (player3 || userData?.[fieldKey] || wasInput?.[fieldKey])) || (fieldKey=="user4" && (player4 || userData?.[fieldKey] || wasInput?.[fieldKey])) || (fieldKey=="user1") || (fieldKey=="user2")  ? <input
      type="text"
      ref={ref}
      className={`w-full mt-2 p-3 bg-white border rounded-lg dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 
            rounded-xl shadow-lg 
            focus:outline-none focus:ring-2 focus:ring-pink-500 `}
      placeholder={`${t("enterPlayer")} ${index + 1}>`}
      value={userData?.[fieldKey] ?? ""}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setUserData((prev) => ({ ...prev, [fieldKey]: e.target.value }))
      }
      disabled={!!userData?.name || userData?.name != "" ? false : true}
    /> : <button  onClick={(e) => {
    e.preventDefault();
    handlePlayer(fieldKey);
  }} className=" w-full px-4 py-2 bg-blue-300 dark:bg-pink-500 text-white rounded-lg hover:bg-blue-400 hover:dark:bg-pink-500">
      +
      </button>}
  </div>
);






  if (!session) {
    return ( <main className={`w-full flex min-h-screen min-w-screen flex-col items-center justify-between sm:p-6 p-4 pt-20 dark:bg-gray-900 transition-all duration-300`}></main>)
  } else {
    return (
      <main className={`w-full flex min-h-screen min-w-screen flex-col items-center justify-between sm:p-6 p-4 pt-20 dark:bg-gray-900 transition-all duration-300`}>
        {/* Hauptbereich */}
        <div className={`flex-1 w-full max-w-3xl transition-all duration-300  ${isAndroid ? "mt-8" : "mt-4"}`}>
        {showSaved && <InfoBox message={infoMessage} title={infoTitle} color={infoColor} onClose={handleClose}></InfoBox> }
          {/* Header-Bereich */}
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center m-4">
            Team #{session.user.uname}
            <input
              type="text"
              ref={nameTRef}
              className="w-full mt-2 p-3 bg-white border rounded-lg dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 
            rounded-xl shadow-lg 
            focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder={t("enterTeam")}
              defaultValue={session.user.name || ""}
              disabled={session.user.name}
            />
          </h1>

         {/* Team-Mitglieder: Player 1 & 2 */}
<div className="grid grid-cols-2 gap-4 mb-6">
  {[
    { label: "Player 1", key: "user1", ref: user1Ref },
    { label: "Player 2", key: "user2", ref: user2Ref },
    { label: "Player 3", key: "user3", ref: user3Ref },
    { label: "Player 4", key: "user4", ref: user4Ref },
  ].map((p, idx) => (
    <div key={p.key}>
      {renderPlayerInput(p.label, p.key as playerKey, p.ref, idx)}
    </div>
  ))}
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

      
            
          </div>
          
        </div>

        {/* Speichern-Button */}
        <button
          className={`fixed bottom-20 right-6 px-6 py-3 bg-pink-500 text-white rounded-lg shadow-lg hover:bg-pink-900 transition duration-300`}
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

        <button
          className="fixed bottom-4 left-6 px-6 py-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-pink-500 transition duration-300"
          onClick={handleDelete}
        >
          Team löschen
        </button>

        {deleteConfirm && (
          <DeleteConfirmModal onClose={handleClose}/>
        )}
        
      </main>
    );
  }
}
