'use client'

import React, { useEffect, useRef, useState } from 'react';
import { useSession } from "next-auth/react"; 
import { useUI } from './context/UIContext';
import { useChatMessages } from "./common/chatCheck";

interface ModalProps {
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ onClose }) => {
  const { setIsModalOpen } = useUI();
  const { data: session } = useSession();
  const messages = useChatMessages();
  const modalRef = useRef<HTMLDivElement>(null);

  // 👉 useState für isApp
const [message, setMessage] = useState<string[]>([]);

  // Modal öffnen + Escape-Handler
  useEffect(() => {
    setIsModalOpen(true);
  document.body.style.overflow = 'hidden'; // Hintergrund scrollen sperren
  
  return () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto'; // Sperre aufheben beim Schließen
  };
  }, [onClose, setIsModalOpen]);

  useEffect(() => {
  const fetchMessages = async () => {
      try {
        const res = await fetch("/api/chat/receive");
        if (res.ok) {
          const data: string[] = await res.json();
         // setMessage(prevMessages => [...prevMessages, "Neue Nachricht"]);
          setMessage(data);
        }
      } catch (e) {
        console.error("Error fetching chat messages:", e);
      }
    };

    fetchMessages(); // Sofort beim Mount laden
    const interval = setInterval(fetchMessages, 1000); // Jede Sekunde neu laden

    return () => clearInterval(interval);
  }, [messages]);

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
      setMessage("");
     } else {
      console.log("Error on Chat");
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
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50 p-4">
  <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden">
    {/* Modal Header */}
    <div className="flex justify-between items-center py-4 px-6 border-b border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-pink-600 dark:text-pink-400">Live Chat</h2>
      <button 
        onClick={onClose} 
        aria-label="Close Modal"
        className="text-white bg-pink-500 hover:bg-pink-600 rounded-md px-4 py-2 transition"
      >
        ✕
      </button>
    </div>

    {/* Chat Viewport - wo Nachrichten angezeigt werden */}
    <div className="flex-grow p-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 rounded-b-lg min-h-[40vh]">
      {messages.map((msg, i) => (
        <p key={i}>{msg}</p>
      ))}
    </div>

    {/* Eingabe Bereich */}
    {!!session && (
    <>   
    <div className="flex items-center p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-b-lg space-x-2">
      <textarea
        className="flex-grow resize-none rounded-md border border-gray-300 dark:border-gray-600 p-3 shadow-sm bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 dark:text-gray-100"
        placeholder="Schreibe deine Nachricht..."
        value={message}
        onChange={(e) => {
          if (e.target.value.length <= 100) setMessage(e.target.value);
        }}
        rows={2}
      />
      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleSend}
        className="bg-pink-500 hover:bg-pink-600 text-white rounded-md px-5 py-2 transition shadow"
        aria-label="Send message"
      >
        ➡️
      </button>
    </div>

    {/* Zeichenanzahl */}
    <div className="px-6 pb-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
      <span className={message.length === 100 ? "text-red-600" : ""}>
        {message.length} / 100
      </span>
    </div>
    </> )}
  </div>
</div>

        
      </div>
    </div>
  );
};

export default Modal;
