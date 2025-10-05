'use client'

import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import '../lib/i18n';
import { useSession } from "next-auth/react"; 
import { useUI } from './context/UIContext';
import { Button } from '@cooperateDesign';

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
    setIsModalOpen(true);

  }, [onClose, setIsModalOpen]);

  const handleSave = async () => {


    const res = await fetch("/api/report/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gameid: game,
        teamName: session?.user?.uname,
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
        className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-8 rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-pink-600 dark:text-pink-400">
            {t("report")}
          </h2>
          <Button
            onClick={onClose}
          >
            X
          </Button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[70vh] space-y-4">
          {session ? (
        <div>
           <textarea
          className="w-full m-2 p-3 min-h-24 bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
          placeholder={t("probDes")}
          value={reportData}
          onChange={(e) => {
            if (e.target.value.length <= 100) {
              setReportData(e.target.value);
            }
          }}
          disabled={false}
        />
      <div>
            <Button
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleSave}
            >
              {t('save')}
            </Button>
            <div className={`${reportData.length === 200 ? 'text-red-600' : ''}`}>
              {reportData.length} / 100
            </div>
      </div>
        </div>
          ) : null}
        </div>
        
      </div>
    </div>
  );
};

export default Modal;
