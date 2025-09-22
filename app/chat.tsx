'use client'

import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import '../lib/i18n';
import { useSession } from "next-auth/react"; 
import { useUI } from './context/UIContext';

interface ModalProps {
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ onClose }) => {
  const { setIsModalOpen } = useUI();
  const { t } = useTranslation();
  const { data: session } = useSession();

  const modalRef = useRef<HTMLDivElement>(null);

  // 👉 useState für isApp
  const [message, setMessage] = useState("");

  // Modal öffnen + Escape-Handler
  useEffect(() => {
    setIsModalOpen(true);
  }, [onClose, setIsModalOpen]);

  

  const handleSend = async () => {
    
    const res = await fetch("/api/chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: message,
      }),
    });

    if (res.ok) {
      
      console.log("Chat send");
      onClose();
    } else {
      console.log("Error on Chat");
    }
  
  };

  return (
    <div className="absolute inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50">
      <div
        ref={modalRef}
        tabIndex={-1}
        className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-8 rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-pink-600 dark:text-pink-400">
            Live Chat
          </h2>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
          >
            X
          </button>
        </div>
        <div className="min-h-[24v] min-w-full rounded-lg shadown-lg mb-2 border border-gray-300 dark:border-gray-600">
        
        </div>
        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[70vh] space-y-4">
          {session ? (
        <div> 
          <div className="inline-flex">
           <textarea
          className="w-full bottom-2 m-2 p-3 bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="..."
          value={reportData}
          onChange={(e) => {
            if (e.target.value.length <= 100) {
              setMessage(e.target.value);
            }
          }}
          disabled={false}
        />
     
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleSend}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition mt-4"
            >
              ➡️
            </button>
      </div>
            <div className={`${reportData.length === 200 ? 'text-red-600' : ''}`}>
              {reportData.length} / 100
            </div>
      
        </div>
          ) : null}
        </div>
        
      </div>
    </div>
  );
};

export default Modal;
