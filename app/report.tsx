'use client'

import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import '../lib/i18n';
import { useSession } from "next-auth/react"; 
import { useUI } from './context/UIContext';

interface ModalProps {
  onClose: () => void;
  game: number;
}

const Modal: React.FC<ModalProps> = ({ onClose, game }) => {
  const { setIsModalOpen } = useUI();
  const { t } = useTranslation();
  const { data: session } = useSession();

  const modalRef = useRef<HTMLDivElement>(null);

  // 👉 useState für isApp
  const [reportData, setReportData] = useState("");

  // Modal öffnen + Escape-Handler
  useEffect(() => {
    const modal = modalRef.current;
    setIsModalOpen(true);

    if (modal) modal.focus();
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      setIsModalOpen(false);
      document.body.style.overflow = 'auto';
    };
  }, [onClose, setIsModalOpen]);

  const handleSave = async () => {


    const res = await fetch("/api/report/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gameid: game,
        message: reportData,
      }),
    });

    if (res.ok) {
      
      console.log("Report send");
      onClose();
    } else {
      console.log("Error on Report");
    }
  
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50">
      <div
        ref={modalRef}
        tabIndex={-1}
        className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-8 rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-pink-600 dark:text-pink-400">
            {t("Chat")}
          </h2>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
          >
            X
          </button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[70vh] space-y-4">
          {session ? (
        <div>
            <h1>
              {t("report")}
            </h1>
            <p>
              Beschreibe das Probem.
            </p>
           <input
      type="text"
      className={`w-full mt-2 p-3 bg-white border rounded-lg dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 
            rounded-xl shadow-lg 
            focus:outline-none focus:ring-2 focus:ring-pink-500 `}
      placeholder={t("Beschreibe...")}
      value={reportData}
      onChange={(e) => { 
            setReportData(e.target.value); 
          }}
      disabled={false}
    /> 
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
            >
              {t('save')}
            </button>
        </div>
          ) : null}
        </div>
        
      </div>
    </div>
  );
};

export default Modal;
