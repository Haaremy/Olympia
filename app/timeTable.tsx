"use client";

import React, { useEffect, useRef } from 'react';
import { useUI } from './context/UIContext';
import { useTranslation } from 'react-i18next';

interface ModalProps {
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ onClose }) => {
    const { setIsModalOpen } = useUI();
    const modalRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();  // Hook innerhalb der Komponente verwenden
    const hour = new Date().getHours();
    const min = new Date().getMinutes();
    const curTime = hour*60+min;

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


    // Close modal if clicked outside of modal content
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (overlayRef.current === e.target) {
            onClose();
        }
    };


    return (
        <div 
            ref={overlayRef}
            id="modal"
            tabIndex={-1}  // Fokus auf das Modal setzen
            className="fixed inset-0 flex justify-center items-center bg-white/20 dark:bg-black/30 backdrop-blur-sm z-100"
            role="dialog"
            aria-labelledby="modal-title"
            aria-hidden="false"
            onClick={handleOverlayClick} // Close modal on overlay click
        >
            <div
                ref={modalRef}
                className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-6 rounded-lg shadow-lg w-full max-w-md max-h-[70vh] overflow-hidden flex flex-col m-4"
                onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside modal
                aria-labelledby="modal-title"
            >
                {/* Modal Header (Icon + Title + Close Button) */}
                <div className="flex justify-between items-center mb-4 ">
                    <h2 className="flex items-center text-3xl text-white-500">
                        Timetable
                    </h2>
                    
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                        aria-label="Modal schließen"
                    >
                        X
                    </button>
                </div>
 
                {/* Ist event Zeit : vor nächstem event Zeit : nach Event Zeit*/ }
                <div className="overflow-y-auto max-h-[40vh] pr-2">
<table className="mt-4 table-auto w-full max-w-md text-left border-collapse">
  <thead>
    <tr>
      <th className="text-white font-semibold pb-2 pr-8">Zeit</th>
      <th className="text-white font-semibold pb-2">Event</th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b border-white/10">
      <td className="text-white pr-8">16:00</td>
      <td className={`${curTime < (17*60) ? "text-white-500 text-lg py-4" : curTime >= (17*60) ? "text-blue-500 text-sm" : "text-pink-500 text-md py-1"} break-words whitespace-normal `}>
        {t("tt-0")}
      </td>
    </tr>
    <tr className="border-b border-white/10">
      <td className="text-white pr-8">17:00</td>
      <td className={`${curTime < (19*60+30) && curTime >= (17*60) ? "text-white-500 text-lg py-4" : curTime >= (19*60+30)? "text-blue-500 text-sm" : "text-pink-500 text-md py-1"} break-words whitespace-normal`}>
        {t("tt-1")}
      </td>
    </tr>
    <tr className="border-b border-white/10">
      <td className="text-white pr-8">19:30</td>
      <td className={`${curTime < (22*60) && curTime >= (19*60+30) ? "text-white-500 text-lg py-4"  : curTime >= (22*60) ? "text-blue-500 text-sm" : "text-pink-500 text-md py-1"} break-words whitespace-normal`}>
        {t("tt-2")}
      </td>
    </tr>
    <tr className="border-b border-white/10">
      <td className="text-white pr-8">20:30</td>
      <td className={`${curTime < (22*60) && curTime >= (20*60+30) ? "text-white-500 text-lg py-4" : curTime >= (22*60) ? "text-blue-500 text-sm" : "text-pink-500 text-md py-1"} break-words whitespace-normal`}>
        {t("tt-3")}
      </td>
    </tr>
    <tr className="border-b border-white/10">
      <td className="text-white pr-8">22:00</td>
      <td className={`${curTime < (23*60+30) && curTime >= (22*60) ? "text-white-500 text-lg py-4" : curTime >= (23*60+30) ? "text-blue-500 text-sm" : "text-pink-500 text-md py-1"} break-words whitespace-normal`}>
        {t("tt-4")}
      </td>
    </tr>
    <tr className="border-b border-white/10">
      <td className="text-white pr-8">23:30</td>
      <td className={`${curTime < (1*60)? "text-white-500 text-lg py-4" : curTime >= (1*60) && curTime < (2*60) ? "text-blue-500 text-sm" : "text-pink-500 text-md py-1"} break-words whitespace-normal`}>
        {t("tt-5")}
      </td>
    </tr>
    <tr className="border-b border-white/10">
      <td className="text-white pr-8">01:00</td>
      <td className={`${curTime < (3*60) ? "text-white-500 text-lg py-4" : curTime >= (3*60) && curTime < (3*60) ? "text-blue-500 text-sm" : "text-pink-500 text-md py-1"} break-words whitespace-normal`}>
        {t("tt-6")}
      </td>
    </tr>
  </tbody>
</table>
</div>


            </div>
        </div>
    );
};

export default Modal;
