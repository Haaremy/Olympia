"use client";

import React, { useEffect, useRef } from 'react';
import Image from "next/image";
import { useUI } from './context/UIContext';
import { useTranslation } from 'react-i18next';

interface ModalProps {
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ onClose }) => {
    const { setIsModalOpen } = useUI();
    const modalRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const { i18n } = useTranslation();  // Hook innerhalb der Komponente verwenden


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
    const setLanguage = (lang: string) => {
        localStorage.setItem('language', lang);
        i18n.changeLanguage(lang || "de");
        console.log(`Sprache auf ${lang} gesetzt.`);
        onClose();
    };

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
                className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-6 rounded-lg shadow-lg w-full max-w-md max-h-[70vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside modal
                aria-labelledby="modal-title"
            >
                {/* Modal Header (Icon + Title + Close Button) */}
                <div className="flex justify-between items-center mb-4 ">
                    <div className="flex items-center">
                        <Image
                            src={`/images/globe.svg`}
                            alt="Globe Icon"
                            className="w-full h-8 object-cover bg-gray-300 rounded-lg"
                            width={50}
                            height={50}
                        />
                    </div>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                        aria-label="Modal schließen"
                    >
                        X
                    </button>
                </div>

                {/* Zwei untereinander platzierte Buttons */}
                <div className="flex flex-col space-y-4 mt-4">
                    <button
                        onClick={() => setLanguage('de')} // Setzt 'de' bei Klick
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-900 focus:outline-none"
                        aria-label="Deutsch"
                    >
                        Deutsch
                    </button>
                    <button
                        onClick={() => setLanguage('en')} // Setzt 'en' bei Klick
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-900 focus:outline-none"
                        aria-label="English"
                    >
                        English
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
