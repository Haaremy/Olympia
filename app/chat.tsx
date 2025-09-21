'use client'

import React, {useEffect, useRef, useState } from 'react';
import Infobox from './infoBox'; 
import { useTranslation } from 'next-i18next';
import '../lib/i18n';
import { useSession } from "next-auth/react"; 
import { useUI } from './context/UIContext';
import Link from 'next/link';
import { Capacitor } from '@capacitor/core';




interface ModalProps {
    onClose: () => void;
}




const Modal: React.FC<ModalProps> = ({ onClose }) => {
    const { setIsModalOpen } = useUI();
  
    const [isApp, setIsApp] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    
    

    const { t } = useTranslation(); 

    


    const { data: session } = useSession();

    
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
      }); // Nur das user-Objekt setzen
    } catch (error) {
      console.error("User-Fehler:", error);
    } finally {
    }
  };

  fetchTeam();
}, [session]);




useEffect(() => {
  setIsApp(Capacitor.isNativePlatform());
}, []);



   

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
    
                  {session  ? (
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
    
}
    {timeLeft>0 && message.started && !message.tagged.includes("noGame") && !(points[0]?.value >= 0) && userData?.user1!="" && userData?.user1!=""  &&(
    <div className="text-right mt-2">
      <button
        className="ml-auto inline-flex px-2 py-1 bg-pink-500 text-white text-xl rounded-lg shadow-lg hover:bg-pink-600 transition duration-300 mt-3"
        onClick={console.log("todo")}
        aria-label="Save"
      >
        &#x1F4BE;<br/>
        
        <div className="text-xl">{t("save")}</div>
      </button>
    </div>
  )}
  </div>
    );
};

export default Modal;
