'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Infobox from './infoBox'; 
import { gamesEG, gamesOG } from "./common/mapPos";
import MapSection from './common/map';
import { useTranslation } from 'next-i18next';
import '../lib/i18n';
import { useSession } from "next-auth/react"; 
import { useUI } from './context/UIContext';
import Login from "./login";
import Link from 'next/link';
import Report from "./report";
import { Haptics, ImpactStyle} from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';
import confetti from 'canvas-confetti';



interface ModalProps {
    message: {
        id: number;
        title: string;
        capacity: string;
        story: string;
        content: string;
        points: string;
        station: string;
        url: string;
        tagged: string;
        timeLeft: number;
        started: boolean;
        languages: { language: string; title: string; story: string }[];
    };
    onClose: () => void;
}

type PointEntry = {
  id: number;
  gameId: number;
  userId: number;
  name: string;
  value: number;
  slot: number;
  lastUpdated: Date;
};



const Modal: React.FC<ModalProps> = ({ message, onClose }) => {
    const { setIsModalOpen } = useUI();
    const [showSaved, setShowSaved] = useState(false); 
    const [showNotSaved, setShowNotSaved] = useState(false); 
    const [errorMessage, setErrorMessage] = useState("");
    const [showMap, setShowMap] = useState(false);
    const [points, setPoints] = useState<PointEntry[]>([]);
    const globalPointsRef = useRef<PointEntry[]>([]);
    const [isApp, setIsApp] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [showReport, setShowReport] = useState(false);
    
    

    const { t } = useTranslation(); 

    const handleShowMap = () => setShowMap(prev => !prev); 
    const handleReportOpen = () => setShowReport(true);
    const handleReportClose = () => setShowReport(false);
    const handleSavedClose = () => setShowSaved(false);
    const handleNotSavedClose = () => setShowNotSaved(false);
    
    const [updateSite, setUpdateSite] = useState(true);
const [userData, setUserData] = useState({
  id: 0,
  uname: "Loading...",
  name: "",
  user1: "",
  user2: "",
  user3: "",
  user4: "",
});



    const { data: session } = useSession();

    const [playerInputs, setPlayerInputs] = useState({
        user1: "",
        user2: "",
        user3: "",
        user4: ""
    });

    const modalRef = useRef<HTMLDivElement>(null);
    

    useEffect(() => {
        const modal = modalRef.current;
        setIsModalOpen(true);
        
        // Fokus auf das Modal setzen
        if (modal) {
            modal.focus();
        }

        // Scrollen im Hintergrund deaktivieren
        document.body.style.overflow = 'hidden';

        // Escape-Taste zum Schließen des Modals
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        // Cleanup: Entfernen des Event Listeners und Aktivieren des Scrollens
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            setIsModalOpen(false);

            // Scrollen wieder aktivieren, wenn das Modal geschlossen wird
            document.body.style.overflow = 'auto';
        };
    }, [onClose, setIsModalOpen]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPlayerInputs(prev => ({ ...prev, [name]: value }));
    };

  const handleSave = async () => {
  try {
    const players: { [key: string]: number } = {
      user1: Number(playerInputs.user1) || -1,
      user2: Number(playerInputs.user2) || -1,
      user3: Number(playerInputs.user3) || -1,
      user4: Number(playerInputs.user4) || -1,
    };


    // Senden
    const response = await fetch("/api/points/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ game: message.id, ...players }),
    });

    if (!response.ok) throw new Error("Fehler beim Speichern");
    if(isApp) await Haptics.impact({ style: ImpactStyle.Medium });

    confetti({
      particleCount: 150,
      spread: 360,
      origin: { y: 0.5, x:0.5 },
      colors: ["#ec4899", "#3b82f6", "#ffffff"],
    });
    setShowSaved(true);
    setUpdateSite(true);
    

    const playedGames = localStorage.getItem("playedGames") || "";
    //const formattedId = message.id < 10 ? `0${message.id}` : message.id;
    localStorage.setItem("playedGames", `${playedGames}+${message.id}+`);

    setTimeout(() => setShowSaved(false), 3000);

  } catch (error) {
    console.log("Speichern fehlgeschlagen:", error);
    setShowNotSaved(true);
    setErrorMessage("Fehler");
    setTimeout(() => setShowNotSaved(false), 3000);
  }
};


   const fetchData = useCallback(async () => {
  try {
    const res = await fetch(`/api/points/get?gameId=${message.id}`);
    if (!res.ok) throw new Error('Fehler beim Laden der Punkte');

    const data = await res.json();
    globalPointsRef.current = data.points || []; // Speichern des Werts in useRef

    // Punkte direkt nach Reihenfolge auf user1..user4 mappen
    const inputUpdates: Partial<typeof playerInputs> = {};

    globalPointsRef.current.forEach((point) => {
      const slot = point.slot; 
      if (!slot || slot < 1 || slot > 4) return; // Sicherheit
      

      const key = `user${slot}` as keyof typeof playerInputs;
      inputUpdates[key] = String(point.value);
      console.log(point);
    });

    setPoints(globalPointsRef.current);
    setPlayerInputs(prev => ({ ...prev, ...inputUpdates }));
  } catch (err) {
    // Typisiere den Fehler als Instanz von Error
    if (err instanceof Error) {
      console.error('Fehler beim Laden der Punkte:', err.message);
    } else {
      // Wenn der Fehler kein Error ist (z. B. bei unerwarteten Fehlern)
      console.error('Unbekannter Fehler:', err);
    }
  }
},[message.id]); 

useEffect(() => {
  if (updateSite) {
    setUpdateSite(false);
  }
  fetchData();
}, [updateSite, fetchData]);

  useEffect(() => {
  if (!session?.user?.uname) return;

  const fetchTeam = async () => {
    try {
      const res = await fetch(`/api/team/search?query=${session.user.uname}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Fehler beim Laden des Teams");

      const response = await res.json();
      setUserData({
        ...response.team,
        name: response.team.name,
        user1: response.team.players[0],
        user2: response.team.players[1],
        user3: response.team.players[2],
        user4: response.team.players[3],
      }); // Nur das user-Objekt setzen
    } catch (error) {
      console.error("User-Fehler:", error);
    } finally {
    }
  };

  fetchTeam();
}, [session]);


const [showLogin, setShowLogin] = useState(false);
const handleLoginClose = () => setShowLogin(false);
const handleShowLogin = () => setShowLogin(true);
const offsetMinutes = new Date().getTimezoneOffset()* 60 * 1000;
const [timeLeft, setTimeLeft] = useState(message.timeLeft + offsetMinutes);

useEffect(() => {
  const interval = setInterval(() => {
    setTimeLeft((prevTime) => {
      if (prevTime <= 1000) {
        clearInterval(interval);
        return 0;
      }
      return prevTime - 1000;
    });
  }, 1000);

  return () => clearInterval(interval);
});



useEffect(() => {
  setIsApp(Capacitor.isNativePlatform());
}, []);



const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hoursStr = hours > 0 ? `${hours}h ` : '';
  const minutesStr = minutes > 0 || hours > 0 ? `${minutes}m ` : '';
  const secondsStr = `${seconds}s`;


  return `${hoursStr}${minutesStr}${secondsStr}`;
};
   

    return (
        
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50">
            <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-8 rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-pink-600 dark:text-pink-400">{message.title}</h2>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
                    >
                        X
                    </button>
                </div>

                {/* Modal Content */}
                <div className="overflow-y-auto max-h-[70vh]">
                    <p className="text-sm mb-4">{message.story}</p>
                    <hr className="my-6 border-gray-300 dark:border-gray-600" />
                    {/* Map Toggle Button */}
                    <details   onToggle={e => setIsDetailsOpen((e.target as HTMLDetailsElement).open)}
>
                    <summary
                      onClick={handleShowMap}
                      className="flex items-center gap-2 w-full p-1 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 text-l font-bold text-pink-600 dark:text-pink-400 justify-center text-center"
                  >
                      {isDetailsOpen ? '👇' : '👉'}
                      <span className="flex-1 text-center">{message.station}</span>
                  </summary>
                    {showMap && (
                        
                    <MapSection
                      title=""
                      imageSrc={`/images/map_${message.station.includes("Erdgeschoss") || message.station.includes("Ground") || message.station.includes("INS") ? t('mapImageGR') : t('mapImage1st') }.jpg`}
                      games={message.station.includes("Erdgeschoss") || message.station.includes("Ground") || message.station.includes("INS") ? gamesEG : gamesOG}
                      searchQuery={`${message.id < 10 ? "0" : ""}${message.id}`} 
                    />
                    )}
                    </details>

                    {/* Capacity */}
                     <hr className="my-6 border-gray-300 dark:border-gray-600" />
                    <h3 className="text-lg text-gray-700 dark:text-gray-300 mb-2 mt-4">{t("capacity")}</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{message.capacity}</p>
                    { !points[0]?.value && (
                      <>
                        {/* Instructions */}
                        <hr className="my-6 border-gray-300 dark:border-gray-600" />
                        <h3 className="text-lg text-gray-700 dark:text-gray-300 mb-2 mt-4">
                          {t("howTo")}
                        </h3>
                        <p
                          className="text-sm text-gray-700 dark:text-gray-300 mb-4"
                          dangerouslySetInnerHTML={{ __html: message.content }}
                        />

                        {/* Points Description */}
                        <hr className="my-6 border-gray-300 dark:border-gray-600" />
                        <h3 className="text-lg text-gray-700 dark:text-gray-300 mt-4 mb-4">
                          {t("descriptionPoints")}
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                                      
                   {!message.started ? <button className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 ml-2 "> {t("notStarted")}</button> : 
                    userData && !!userData?.user1 && !!userData?.user2 ? (
                    <>
                        <br />
                        <span>{message.points }</span>
                        <br />
                    </>
                    ) : session  ? (
                        <Link
                            href="/teampage"
                            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 mt-2"
                        >
                            {t("Edit Team")}
                        </Link> 
                    ) :(
                        <button className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 mt-2" onClick={handleShowLogin}>
                            {t("Login")}
                        </button>
                        
                    )}
                    
                         {/* Hier ggf. Text oder weitere Inhalte */}
                        </p>
                      </>
                    )}
        { !!points[0]?.value && (
          <h3>Punkte Auswertung</h3>
        )}
                

                    {/* Player Inputs */}
<div className={`space-y-4 ${userData && userData.name ? "" : "hidden"}`}>
  <div >
    { !message.tagged.includes("noGame") && !message.tagged.includes("noScoreboard") &&
    <div className="grid grid-cols-2 gap-4">
    {(!message.tagged.includes("noGame") ) && message.started && userData?.user1 != "" && < input
      type={`${!!points[0]?.value || points[0]?.value == 0 ? message.tagged.includes("hidden")?  "password" : "text" : "number"}`}
      placeholder={t("f1w")}
      value={points[0]?.value  || points[0]?.value == 0 ? message.tagged.includes("hidden") ? "00000" : points[0].value : (playerInputs.user1 ?? "")}
      name="user1"
      disabled={points[0]?.value || points[0]?.value == 0 ? true : false}
      onChange={handleInputChange}
      className="w-full px-4 py-2 border-2 border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 transition dark:text-white"
    />}
    
    {(userData?.user2 != "" && !!userData?.user2 || message.tagged.includes("overridePlayers") || message.tagged.includes("showF2")  && !message.tagged.includes("hideF2") && !message.tagged.includes("noGame")) && message.started && < input
      type={`${!!points[1]?.value || points[1]?.value == 0 ? message.tagged.includes("hidden")?  "password" : "text" : "number"}`}
      placeholder={t("f2w")}
      value={points[1]?.value   || points[1]?.value == 0 ? message.tagged.includes("hidden") ? "00000" : points[1].value : (playerInputs.user2 ?? "")}
      name="user2"
      disabled={points[0]?.value || points[0]?.value == 0 ? true : false}
      onChange={handleInputChange}
      className="w-full px-4 py-2 border-2 border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 transition dark:text-white"
    />}
    
    {(userData?.user3 != "" && !!userData?.user3 || message.tagged.includes("overridePlayers") || message.tagged.includes("showF3") && !message.tagged.includes("hideF3") && !message.tagged.includes("noGame"))  && message.started && < input
      type={`${!!points[2]?.value || points[2]?.value == 0 ? message.tagged.includes("hidden") ?  "password" : "text" : "number"}`}
      placeholder={t("f3w")}
      value={points[2]?.value || points[2]?.value == 0 ? message.tagged.includes("hidden") ? "00000" : points[2].value: (playerInputs.user3 ?? "")}
      name="user3"
      disabled={points[0]?.value || points[0]?.value == 0 ? true : false}
      onChange={handleInputChange}
      className="w-full px-4 py-2 border-2 border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 transition dark:text-white"
    />}
    
    {(userData?.user4 != "" && !!userData?.user4 || message.tagged.includes("overridePlayers") || message.tagged.includes("showF4") && !message.tagged.includes("noGame") )  && message.started && < input
      type={`${!!points[3]?.value || points[3]?.value == 0 ? (message.tagged.includes("hidden") ?  "password" : "text") : "number"}`}
      placeholder={t("f4w")}
      value={points[3]?.value || points[3]?.value == 0 ? message.tagged.includes("hidden") ? "Secret" : points[3].value : (playerInputs.user4 ?? "")}
      name="user4"
      disabled={points[0]?.value || points[0]?.value == 0 ? true : false}
      onChange={handleInputChange}
      className="w-full px-4 py-2 border-2 border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 transition dark:text-white"
    />}
    </div>
}
    {timeLeft>0 && message.started && !message.tagged.includes("noGame") && !(points[0]?.value >= 0) && userData?.user1!="" && userData?.user1!=""  &&(
    <div className="text-right mt-2">
      <button
        className="ml-auto inline-flex px-2 py-1 bg-pink-500 text-white text-xl rounded-lg shadow-lg hover:bg-pink-600 transition duration-300 mt-3"
        onClick={handleSave}
        aria-label="Save"
      >
        &#x1F4BE;<br/>
        
        <div className="text-xl">{t("save")}</div>
      </button>
      <br/>
      <label className='mt-2'>
        ({formatTime(timeLeft)})

      </label>
    </div>
  )}
  </div>

  
</div>

                    

                    {/* Tutorial-Link */}
                    {message.url && (
                        <p className="text-sm text-blue-500 hover:underline mt-4">
                            <a
                                href={message.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                            </a>
                        </p>
                    )}

                    {/* Responsive Video (optional) */}
                    {message.url && (
                        <div className="aspect-w-16 aspect-h-9 mb-4">
                            <iframe
                                className="w-full h-full rounded-lg shadow-lg"
                                src={message.url}
                                title="Tutorial"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            />
                        </div>
                    )}
                    <div className="items-center justify-center w-full">
                        <button className="text-sm text-blue-500 hover:underline mt-4" onClick={handleReportOpen}>
                            Report Problem
                        </button>
                    </div>
                </div>
            </div>
                    
            

            {/* Speicherbestätigung Popup */}
            {showLogin && (
                <Login onClose={handleLoginClose} />
            )}

            {showReport && (
                <Report onClose={handleReportClose} />
            )}
            
            {showSaved && (
                <Infobox onClose={handleSavedClose} message="Speichern erfolgreich!" title='Gespeichert' color="pink" />
            )}

            {/* Speicherfehler Popup */}
            {showNotSaved && (
                <Infobox onClose={handleNotSavedClose} message={errorMessage} title='Fehler' color="red" />
            )}
        </div>
    );
};

export default Modal;


