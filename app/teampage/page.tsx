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
import TeamSelfieUploader from "@/app/common/teamSelfieUploader"; 
import MusicSettings from "@/app/common/musicSettings";
import { Button, Main } from "@/cooperateDesign";
import ThemeSettings from "../common/themeSettings";
import TextInput from "@/cooperateDesign/textInput";


export default function Page() {
  const { i18n } = useTranslation();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showSaved, handleShowSaved] = useState(false);
  const [theme, setTheme] = useState<string>("auto");
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
  const contactRef = useRef<HTMLInputElement>(null);

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
        contact: contactRef.current?.value,
        language: i18n.language,
      }),
    });

    if (res.ok) {
      
      handleSavedMessage(t("teamsaved"), t("saved"), "pink");
      //await new Promise((resolve) => setTimeout(resolve, 10000));
      setUpdateData(true);
    } else {
      handleSavedMessage(t("errorOnSave")+ t("tryAgain"), t("error"), "red");
    }
  }
  };


const theming = (theme: string) => {
  setTheme(theme);
  localStorage.setItem("theme", theme);
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
        contact: response.team.contact,
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
    {(fieldKey=="user3" && (player3 || userData?.[fieldKey] || wasInput?.[fieldKey])) || (fieldKey=="user4" && (player4 || userData?.[fieldKey] || wasInput?.[fieldKey])) || (fieldKey=="user1") || (fieldKey=="user2")  ? 
    <TextInput
      ref={ref}
      placeholder={`${t("enterPlayer")} ${index + 1}>`}
      value={userData?.[fieldKey] ?? ""}
      onChange={(e) =>
        setUserData((prev) => ({ ...prev, [fieldKey]: e.target.value }))
      }
      className="mt-2 rounded-xl"
    />
 : <Button className="w-full" onClick={(e) => {
    e.preventDefault();
    handlePlayer(fieldKey);
  }} >
      +
      </Button>}
  </div>
);






  if (!session) {
    return ( <Main className="justify-between">{/* Inhalt hier einfügen */}</Main>)
  } else {
    return (
      <Main className="justify-between">
        {/* Hauptbereich */}
        <div className={`flex-1 w-full max-w-3xl transition-all duration-300  ${isAndroid ? "mt-8" : "mt-4"}`}>
        {showSaved && <InfoBox message={infoMessage} title={infoTitle} color={infoColor} onClose={handleClose}></InfoBox> }
          {/* Header-Bereich */}
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center m-4">
            Team #{session.user.uname}
            <TextInput
              ref={nameTRef}
              placeholder={t("enterTeam")}
              defaultValue={session.user.name || ""}
              disabled={!!session.user.name}
              className="mt-2 rounded-xl"
            />

          </h1>
          <div>
            {t("contact")} (Mail / WhatsApp / @Insta)
            <TextInput
              ref={contactRef}
              placeholder={t("enterContact")}
              className="mt-2 rounded-xl"
            />
          </div>

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


      <TeamSelfieUploader teamUname={session.user.uname} teamName={session.user.name}/>






          {/* Einstellungen */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{t("browserSettings")}</h2>


              {/* Theme */}
              <div className="mt-4">
                <ThemeSettings/>
              </div>


              {/* Language */}
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <Image
                    src={`/images/settingslanguage.svg`}
                    alt="Globe Icon"
                    className="h-8 w-8 object-cover rounded-lg dark:invert invert-0"
                    width={50}
                    height={50}
                    />
                <select
                  value={i18n.language}
                  onChange={(e) => handleLanguage(e.target.value)}
                  className="flex-1 p-3 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                >
                  <option value="en">English</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
          </div>
           <MusicSettings/>
            
          </div>
          
        </div>

        {/* Speichern-Button */}
        <Button
          className="fixed bottom-0 right-4 mb-4 "
          onClick={handleSave}
        >
          &#x1F4BE;
        </Button>

        {/* Logout-Button */}
        <Button
          className="fixed bottom-16 left-4 mb-4 "
          variant="danger"
          onClick={handleLogout}
        >
          Logout
        </Button>

        <Button
          className="fixed bottom-0 left-4 mb-4"
          variant="danger"
          onClick={handleDelete}
        >
          {t("deleteTeam")}
        </Button>

        {deleteConfirm && (
          <DeleteConfirmModal onClose={handleClose}/>
        )}
        
      </Main>
    );
  }
}
