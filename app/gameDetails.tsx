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
import { fetchData } from 'next-auth/client/_utils';

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
        languages: { language: string; title: string; story: string }[];
    };
    onClose: () => void;
    onSave: () => void;
}

type PointEntry = {
  id: number;
  gameId: number;
  teamId: number;
  player: string;
  value: number;
  lastUpdated: Date;
};



const Modal: React.FC<ModalProps> = ({ message, onClose, onSave }) => {
    const { setIsModalOpen } = useUI();
    const [showSaved, setShowSaved] = useState(false); 
    const [showNotSaved, setShowNotSaved] = useState(false); 
    const [errorMessage, setErrorMessage] = useState("");
    const [showMap, setShowMap] = useState(false);
    const [points, setPoints] = useState<PointEntry[]>([]);
    const globalPointsRef = useRef<PointEntry[]>([]);

    const { t } = useTranslation(); 

    const handleShowMap = () => setShowMap(prev => !prev); 

    const handleSavedClose = () => setShowSaved(false);
    const handleNotSavedClose = () => setShowNotSaved(false);
    const [updateSite, setUpdateSite] = useState(false);
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
        console.log(playerInputs["user1"]);
     
        try {
            if((!playerInputs.user1 || playerInputs.user1=="-1") || !playerInputs.user2) {
                setErrorMessage("Nicht alle Spieler oder Punktefelder falsch ausgefüllt.");
                throw new Error("Fehler beim Speichern.");
            }
            if((teamData.players?.[2] && !playerInputs.user3) || (teamData.players?.[3] && !playerInputs.user4)) {
                setErrorMessage("Nicht alle Spieler oder Punktefelder falsch ausgefüllt.");
                throw new Error("Fehler beim Speichern.");
            }
            const response = await fetch("/api/points/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    game: message.id,
                    user1: Number(playerInputs.user1) || -1,
                    user2: Number(playerInputs.user2) || -1,
                    user3: Number(playerInputs.user3) || -1,
                    user4: Number(playerInputs.user4) || -1,
                }),
            });
    
            if (!response.ok) throw new Error("Fehler beim Speichern");
    
            setShowSaved(true);

            setUpdateSite(true);
            const playedGames = localStorage.getItem("playedGames");
            const tempGames = playedGames+"+"+(message.id<10? "0"+message.id : message.id);
            localStorage.setItem("playedGames", tempGames);
            setTimeout(() => setShowSaved(false), 3000);
            onSave();
        } catch (error) {
            console.log("Speichern fehlgeschlagen:", error);
            setShowNotSaved(true);
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

    globalPointsRef.current.forEach((point, index) => {
      const key = `user${index + 1}` as keyof typeof playerInputs;
      inputUpdates[key] = String(point.value);
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
},[]); 

useEffect(() => {
  if (updateSite) {
    fetchData();
    setUpdateSite(false);
  }
}, [updateSite, fetchData]);

  useEffect(() => {
  if (!session?.user?.credentials) return;

  const fetchTeam = async () => {
    try {
      const res = await fetch(`/api/team/search?query=${session.user.credentials}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Fehler beim Laden des Teams");

      const data = await res.json();
      setTeamData(data.team); // Nur das team-Objekt setzen
    } catch (error) {
      console.error("Team-Fehler:", error);
    } finally {
      setUpdateData(false); // Immer nach dem Versuch zurücksetzen
    }
  };

  fetchTeam();
}, [session, updateData]);


const [showLogin, setShowLogin] = useState(false);
const handleLoginClose = () => setShowLogin(false);
const handleShowLogin = () => setShowLogin(true);
    

    return (
        
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50">
            <div className='hidden'>{playerInputs.user1}</div>
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
                    
                    {/* Map Toggle Button */}
                    <button
                        onClick={handleShowMap}
                        className="w-full p-1 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 text-l font-bold text-pink-600 dark:text-pink-400"
                        >
                        &#x1F449; {message.station}
                    </button>

                    {showMap && (
                        <MapSection
                            title=""
                            imageSrc={`/images/map_${(message.station?.startsWith("E") ? "eg" : message.station?.startsWith("G")) ? "gr" : message.station?.startsWith("O") ? "og" : "1st"}.jpg`}
                            games={message.station?.startsWith("E") || message.station?.startsWith("G") ? gamesEG : gamesOG}
                            searchQuery={`${message.id < 10 ? "0" : ""}${message.id}`}
                        />
                    )}

                    {/* Capacity */}
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 mt-4">{t("capacity")}<br />{message.capacity}</p>

                    {/* Instructions */}
                    <p className="text-sm mb-4">
                        {t("howTo")}
                        <br />
                        <span  />{ message.content}
                    </p>

                    {/* Points Description */}
                    <p className="text-sm mb-4">
                    {t("descriptionPoints")} 
                    {teamData.players?.[0] ? (
                    <>
                        <br />
                        <span>{message.points }</span>
                        <br />
                    </>
                    ) : !teamData.name ? (
                        <Link
                            href="/teampage"
                            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                        >
                            {t("Edit Team")}
                        </Link> 
                    ) : (
                        <button className="px-4 py-1 bg-pink-500 text-white rounded-lg hover:bg-pink-600 ml-2" onClick={handleShowLogin}>
                            {t("Login now")}
                        </button>
                        
                    )}
                    
                    </p>

                

                    {/* Player Inputs */}
                    <div className={`space-y-4 ${teamData.players?.[0] ? "" : "hidden"}`}>
                        <div className='flex space-x-4'>
                            <input
                                type="number"
                                placeholder={`Player 1`}
                                value={points[0]?.value ?? playerInputs.user1 ?  playerInputs.user1 : ""}                                
                                name="user1"
                                onChange={handleInputChange}
                                disabled=  {!!points[0]?.value || points[0]?.value==0}
                                className={`w-full px-4 py-2 border-2 border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 transition dark:text-white ${teamData.players?.[0] ? "" : "hidden"}`}
                            />
                            <input
                                type="number"
                                placeholder={`Player 2`}
                                name="user2"
                                onChange={handleInputChange}
                                value={points[1]?.value ?? playerInputs.user2}
                                disabled=  {!!points[1]?.value || points[1]?.value==0}
                                className={`w-full px-4 py-2 border-2 border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 transition dark:text-white ${teamData.players?.[1] ? "" : "hidden"}`}
                            />
                        </div>
                        <div className='flex space-x-4'>
                            <input
                                type="number"
                                placeholder={`Player 3`}
                                name="user3"
                                onChange={handleInputChange}
                                value={points[2]?.value ?? playerInputs.user3}
                                disabled=  {!!points[2]?.value  || points[2]?.value==0}
                                className={`w-full px-4 py-2 border-2 border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 transition dark:text-white ${teamData.players?.[2] ? "" : "hidden"}`}
                            />
                            <input
                                type="number"
                                placeholder={`Player 4`}
                                name="user4"
                                onChange={handleInputChange}
                                value={points[3]?.value ?? playerInputs.user4}
                                disabled=  {!!points[3]?.value  || points[3]?.value==0}
                                className={`w-full px-4 py-2 border-2 border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 transition dark:text-white ${teamData.players?.[3] ? "" : "hidden"}`}
                            />
                        </div>
                        {!points[0]?.value && <div className={`text-right `}>
                            <button
                            className={`ml-auto inline-flex px-2 py-1 bg-pink-500 text-white text-xl rounded-lg shadow-lg hover:bg-pink-600 transition duration-300`}
                            onClick={handleSave}
                             aria-label="Save"
                            >
                                &#x1F4BE;<div className="text-xl">{t('save')}</div>
                            </button>

                        </div>
                        }
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
                </div>
            </div>
                    
            

            {/* Speicherbestätigung Popup */}
            {showLogin && (
                <Login onClose={handleLoginClose} />
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


