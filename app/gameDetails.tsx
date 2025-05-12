'use client'

import React, { useEffect, useRef, useState } from 'react';
import Infobox from './infoBox'; 
import { gamesEG, gamesOG } from "./common/mapPos";
import MapSection from './common/map';
import { useTranslation } from 'next-i18next';
import '../lib/i18n';
import { useSession } from "next-auth/react"; 
import { useUI } from './context/UIContext';

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
}

type PointEntry = {
  id: number;
  gameId: number;
  teamId: number;
  player: string;
  value: number;
  lastUpdated: Date;
};


const Modal: React.FC<ModalProps> = ({ message, onClose }) => {
    const { setIsModalOpen } = useUI();
    const [showSaved, setShowSaved] = useState(false); 
    const [showNotSaved, setShowNotSaved] = useState(false); 
    const [errorMessage, setErrorMessage] = useState("");
    const [showMap, setShowMap] = useState(false);
    const [points, setPoints] = useState<PointEntry[]>([]);
    let globalPoints: PointEntry[] = [];

    const { t } = useTranslation(); 

    const handleShowMap = () => setShowMap(prev => !prev); 

    const handleSavedClose = () => setShowSaved(false);
    const handleNotSavedClose = () => setShowNotSaved(false);

    type TeamUser = {
        user1?: string;
        user2?: string;
        user3?: string;
        user4?: string;
        credentials?: boolean;
      };

    const { data: session } = useSession();
    const team = session?.user as TeamUser | undefined;

    const [playerInputs, setPlayerInputs] = useState({
        user1: team?.user1 || undefined,
        user2: team?.user2 || undefined,
        user3: team?.user3 || undefined,
        user4: team?.user4 || undefined
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
            if(!playerInputs.user1 || !playerInputs.user2) {
                setErrorMessage("Nicht alle Spieler oder Punktefelder falsch ausgefüllt.");
                throw new Error("Fehler beim Speichern.");
            }
            if((team?.user3 && !playerInputs.user3) || (team?.user4 && !playerInputs.user4)) {
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
                    user1: Number(playerInputs.user1) || 0,
                    user2: Number(playerInputs.user2) || 0,
                    user3: Number(playerInputs.user3) || 0,
                    user4: Number(playerInputs.user4) || 0,
                }),
            });
    
            if (!response.ok) throw new Error("Fehler beim Speichern");
    
            setShowSaved(true);
const savedData: PointEntry[] = [
  {
    id: message.id,
    gameId: message.id,
    teamId: session?.user.id,
    player: "1",
    value: Number(playerInputs.user1) || 0,
    lastUpdated: new Date(),
  },
  {
    id: message.id,
    gameId: message.id,
    teamId: session?.user.id,
    player: "2",
    value: Number(playerInputs.user2) || 0,
    lastUpdated: new Date(),
  },
  {
    id: message.id,
    gameId: message.id,
    teamId: session?.user.id,
    player: "3",
    value: Number(playerInputs.user3) || 0,
    lastUpdated: new Date(),
  },
  {
    id: message.id,
    gameId: message.id,
    teamId: session?.user.id,
    player: "4",
    value: Number(playerInputs.user4) || 0,
    lastUpdated: new Date(),
  },
];

setPoints(savedData);
            
            setTimeout(() => setShowSaved(false), 3000);
        } catch (error) {
           // console.error("Speichern fehlgeschlagen:", error);
            setShowNotSaved(true);
            setTimeout(() => setShowNotSaved(false), 3000);
        }
    };
    
 useEffect(() => {
  const fetchData = async () => {
    if (message?.id) {
      
  try {
    const res = await fetch(`/api/points/get?gameId=${message.id}`);
    if (!res.ok) throw new Error('Fehler beim Laden der Punkte');

    const data = await res.json();
    globalPoints = data.points || []; // Speichern in der globalen Variable

    // Punkte direkt nach Reihenfolge auf user1..user4 mappen
    const inputUpdates: Partial<typeof playerInputs> = {};

    globalPoints.forEach((point: PointEntry, index: number) => {
      const key = `user${index + 1}` as keyof typeof playerInputs;
      inputUpdates[key] = String(point.value);
    });

    console.log("Global User1: "+globalPoints[1]?.value);
    setPoints(globalPoints);

    setPlayerInputs(prev => ({ ...prev, ...inputUpdates }));
  } catch (err: any) {
    console.error('Fehler beim Laden der Punkte:', err.message);
  }
};
    }


  fetchData();
}, [message?.id]);






    

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
  {team?.user1 ? (
    <>
      <br />
      <span>{message.points }</span>
      <br />
    </>
  ) : team?.credentials ? (
    <button 
    className="px-4 py-1 bg-pink-500 text-white rounded-lg hover:bg-pink-600 ml-2"
    >
        {t("Edit Team")}
  </button>
  ) : (
    <button 
    className="px-4 py-1 bg-pink-500 text-white rounded-lg hover:bg-pink-600 ml-2"
  >
        {t("Login now")}
  </button>
  )}
</p>

                

                    {/* Player Inputs */}
                    <div className={`space-y-4 ${team?.user1 ? "" : "hidden"}`}>
                        <div className='flex space-x-4'>
                            <input
                                type="number"
                                placeholder={`Player 1`}
                                value={points[0]?.value ?? playerInputs.user1}                                
                                name="user1"
                                onChange={handleInputChange}
                                disabled=  {!!points[0]?.value || points[0]?.value==0}
                                className={`w-full px-4 py-2 border-2 border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 transition dark:text-white ${team?.user1 ? "" : "hidden"}`}
                            />
                            <input
                                type="number"
                                placeholder={`Player 2`}
                                name="user2"
                                onChange={handleInputChange}
                                value={points[1]?.value ?? playerInputs.user2}
                                disabled=  {!!points[1]?.value || points[1]?.value==0}
                                className={`w-full px-4 py-2 border-2 border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 transition dark:text-white ${team?.user2 ? "" : "hidden"}`}
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
                                className={`w-full px-4 py-2 border-2 border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 transition dark:text-white ${team?.user3 ? "" : "hidden"}`}
                            />
                            <input
                                type="number"
                                placeholder={`Player 4`}
                                name="user4"
                                onChange={handleInputChange}
                                value={points[3]?.value ?? playerInputs.user4}
                                disabled=  {!!points[3]?.value  || points[3]?.value==0}
                                className={`w-full px-4 py-2 border-2 border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 transition dark:text-white ${team?.user4 ? "" : "hidden"}`}
                            />
                        </div>
                        {!points[1]?.value && <div className={`text-right `}>
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
