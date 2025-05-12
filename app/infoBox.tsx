'use client'
import { useUI } from './context/UIContext';
import React, { useEffect, useRef } from 'react';




interface ModalProps {
    title: string;
    message: string;
    color: string;
    onClose: () => void;
}

 

const Modal: React.FC<ModalProps> = ({ title, message, color, onClose }) => {

    const { setIsModalOpen } = useUI();
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


    return (
        <div className="fixed inset-0 flex justify-center items-center bg-white/20 dark:bg-black/30 backdrop-blur-sm z-50">
            <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-6 rounded-lg shadow-lg w-96">
                <h2 className={`text-xl font-semibold text-${color}-500`}>{title}</h2>
                <br/>
                <p>{message}</p>
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                    >
                        X
                    </button>
                </div>
            </div>
        </div>
    );

};

export default Modal;
