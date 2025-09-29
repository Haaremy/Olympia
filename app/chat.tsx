"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useUI } from "./context/UIContext";
import { useTranslation } from "next-i18next";  // Importiere die Übersetzungsfunktion

interface ModalProps {
  onClose: () => void;
}

interface Chat {
  message: string;
  createdAt: string;
  team: {
    uname: string;
    name: string;
    cheatPoints: number;
  };
}

const Modal: React.FC<ModalProps> = ({ onClose }) => {
  const { setIsModalOpen } = useUI();
  const { data: session } = useSession();
  const { t } = useTranslation(); // Verwende die Übersetzungsfunktion
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<Chat[]>([]);
  const [error, setError] = useState<string | null>(null);  // Fehlerstatus für Chat-Nachrichten
  const [isSending, setIsSending] = useState(false); // Verhindert das doppelte Senden von Nachrichten
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Modal lifecycle
  useEffect(() => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
    return () => {
      setIsModalOpen(false);
      document.body.style.overflow = "auto";
    };
  }, [setIsModalOpen]);

  const historyRef = useRef(history);
  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  // Fetch messages periodically
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/chat/receive");
        if (res.ok) {
          const data: Chat[] = await res.json();
          setHistory(data);
        } else {
          setError("Fehler beim Abrufen der Nachrichten.");
        }
      } catch (e) {
        setError("Es gab ein Problem beim Abrufen der Nachrichten.");
        console.error("Error fetching chat messages:", e);
      }
    };

    fetchMessages(); // initial load
    const interval = setInterval(fetchMessages, 1000);

    return () => clearInterval(interval);
  }, []); // ❌ don't depend on history

  const scrollEnd = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!message.trim() || isSending) return;  // Verhindert mehrfaches Senden

    setIsSending(true);

    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (res.ok) {
        setMessage("");
      } else {
        console.error("Error on Chat send");
      }
    } catch (e) {
      console.error("Error on Chat:", e);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (history.length > 0) {
      scrollEnd(); // Automatisch zum neuesten Chat scrollen
    }
  }, [history]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 100) {
      setMessage(e.target.value);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
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

        {/* Nachrichten */}
        <div className="flex-grow h-[60vh] p-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 rounded-md">
          {error && <div className="text-red-500">{error}</div>} {/* Fehleranzeige */}
          {history.map((chat, i) => {
            const isOwnMessage = chat?.team?.uname === session?.user?.uname;
            return (
              <div key={i} className={`flex mb-2 ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl shadow 
                    ${isOwnMessage
                      ? "bg-pink-500 text-white rounded-br-none"
                      : "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none"}`}
                >
                  {!isOwnMessage && (
                    <div className="flex items-center space-x-1 text-s font-semibold text-pink-600 dark:text-pink-400 mb-1">
                      <Image
                        src={"/uploads/" + chat.team.uname.toLowerCase() + ".jpg"}
                        alt=""
                        width={32}
                        height={32}
                        className="rounded-full object-cover bg-white shadow-lg object-cover w-8 h-8 mr-4"
                        unoptimized
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.src = "/images/teamplaceholder.png";
                        }}
                      />
                      <span>{chat.team.name}</span>
                    </div>
                  )}
                  <div>{chat.message}</div>
                  <div className="text-[10px] opacity-70 mt-1 text-right">
                    {new Date(chat.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
          <button
            className="rounded-full bg-pink-500 fixed bottom-60"
            onClick={() => scrollEnd()}
            aria-label="Scroll to bottom"
          >
            👇🏼
          </button>
        </div>

        {/* Input */}
        {!!session && (
          <div className="flex items-center p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 space-x-2">
            <textarea
              className="flex-grow resize-none rounded-md border border-gray-300 dark:border-gray-600 p-3 shadow-sm bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 dark:text-gray-100"
              placeholder={!session ? t("chatLogin") : t("chatPlaceholder")}
              value={message}
              disabled={!session}
              onChange={handleInputChange}
              rows={2}
            />
            <button
              onClick={handleSend}
              className="bg-pink-500 hover:bg-pink-600 text-white rounded-md px-5 py-2 transition shadow"
              aria-label="Send message"
            >
              ➡️
            </button>

            {/* Char counter */}
            <div className="px-6 pb-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
              <span className={message.length === 100 ? "text-red-600" : ""}>
                {message.length} / 100
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
