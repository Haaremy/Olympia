'use client'

import React, { useEffect, useRef, useState } from 'react';
import Saved from './infoBox'; 
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

const Modal: React.FC<ModalProps> = ({ message, onClose }) => {
    const { setIsModalOpen } = useUI();
    
    const [showSaved, setShowSaved] = useState(false); 
    const [showNotSaved, setShowNotSaved] = useState(false); 
    //const [errorMessage, setErrorMessage] = useState("");
    const [showMap, setShowMap] = useState(false);

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
        user1: team?.user1 || "",
        user2: team?.user2 || "",
        user3: team?.user3 || "",
        user4: team?.user4 || "",
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
            setTimeout(() => setShowSaved(false), 3000);
        } catch (error) {
            console.error("Speichern fehlgeschlagen:", error);
            setShowNotSaved(true);
            setTimeout(() => setShowNotSaved(false), 3000);
        }
    };
    
    

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
                                type="text"
                                placeholder={`Player 1`}
                                defaultValue={team?.user1 || ""}
                                value={playerInputs.user1}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2 border-2 border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 transition dark:text-white ${team?.user1 ? "" : "hidden"}`}
                            />
                            <input
                                type="text"
                                placeholder={`Player 2`}
                                value={team?.user2 || ""}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2 border-2 border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 transition dark:text-white ${team?.user2 ? "" : "hidden"}`}
                            />
                        </div>
                        <div className='flex space-x-4'>
                            <input
                                type="text"
                                placeholder={`Player 3`}
                                value={team?.user3 || ""}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2 border-2 border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 transition dark:text-white ${team?.user3 ? "" : "hidden"}`}
                            />
                            <input
                                type="text"
                                placeholder={`Player 4`}
                                value={team?.user4 || ""}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2 border-2 border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 transition dark:text-white ${team?.user4 ? "" : "hidden"}`}
                            />
                        </div>
                        <div className="text-right">
                            <button
                            className="ml-auto inline-flex px-2 py-1 bg-pink-500 text-white text-xl rounded-lg shadow-lg hover:bg-pink-600 transition duration-300"
                            onClick={handleSave}
                             aria-label="Save settings"
                            >
                                &#x1F4BE;<div className="text-xl">{t('save')}</div>
                            </button>

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
                </div>
            </div>
                    
            

            {/* Speicherbestätigung Popup */}
            {showSaved && (
                <Saved onClose={handleSavedClose} message="Speichern erfolgreich!" />
            )}

            {/* Speicherfehler Popup */}
            {showNotSaved && (
                <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
                    <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-6 rounded-lg shadow-lg w-full max-w-xs">
                        <h2 className="text-xl font-semibold text-red-500">Fehler!</h2>
                        <p>{/*errormessage*/}</p>
                        <button
                            onClick={handleNotSavedClose}
                            className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                        >
                            X
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Modal;
