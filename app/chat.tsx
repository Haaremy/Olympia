"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useUI } from "./context/UIContext";
import { useTranslation } from "next-i18next";

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
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<Chat[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; chat: Chat } | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  // Modal lifecycle
  useEffect(() => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
    return () => {
      setIsModalOpen(false);
      document.body.style.overflow = "auto";
    };
  }, [setIsModalOpen]);

  // Fetch messages
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

    fetchMessages();
    const interval = setInterval(fetchMessages, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollEnd = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!message.trim() || isSending) return;
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
      scrollEnd();
    }
  }, [history]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 100) {
      setMessage(e.target.value);
    }
  };

  // Long press handler
  const handleMouseDown = (chat: Chat, e: React.MouseEvent) => {
    longPressTimer.current = setTimeout(() => {
      setContextMenu({ x: e.clientX, y: e.clientY, chat });
    }, 600); // 600ms für Long Press
  };

  const handleMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const closeContextMenu = () => setContextMenu(null);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50">
  <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-3xl h-[100dvh] flex flex-col">
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
    <div className="flex-grow p-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
      {history.map((chat, i) => {
        const isOwnMessage = chat?.team?.uname === session?.user?.uname;
        return (
          <div
            key={i}
            className={`flex mb-2 ${isOwnMessage ? "justify-end" : "justify-start"}`}
            onMouseDown={(e) => handleMouseDown(chat, e)}
            onMouseUp={handleMouseUp}
            onTouchStart={(e) => handleMouseDown(chat, e)}
            onTouchEnd={handleMouseUp}
          >
            {/* Chat bubble */}
          </div>
        );
      })}
      <div ref={chatEndRef} />
    </div>

    {/* Input-Leiste */}
    <div className="sticky bottom-0 flex items-end p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 space-x-2">
      <textarea
  className="flex-grow rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-3 shadow-sm bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 dark:text-gray-100 min-h-[48px] max-h-[120px] resize-none"
  placeholder={session ? t("chatPlaceholder") : t("chatLogin")}
  value={message}
  disabled={!session}
  onChange={handleInputChange}
  onInput={(e) => {
    const target = e.currentTarget;
    target.style.height = "auto";
    target.style.height = target.scrollHeight + "px";
  }}
  maxLength={100}
/>
      {!!session && (
        <button
          onClick={handleSend}
          className="bg-pink-500 hover:bg-pink-600 text-white rounded-full p-3 transition shadow flex-shrink-0"
        >
          ➤
        </button>
      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2">
        <span className={message.length === 100 ? "text-red-600" : ""}>
          {message.length}/100
        </span>
      </div>
      )}
    </div>
  </div>
</div>


      {/* Kontextmenü */}
      {contextMenu && (
        <div
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="absolute bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-50"
          onMouseLeave={closeContextMenu}
        >
          <button className="block w-full px-4 py-2 text-left hover:bg-pink-100 dark:hover:bg-pink-600">✏️ Edit</button>
          <button className="block w-full px-4 py-2 text-left hover:bg-pink-100 dark:hover:bg-pink-600">🗑️ Delete</button>
          <button className="block w-full px-4 py-2 text-left hover:bg-pink-100 dark:hover:bg-pink-600">↩️ Reply</button>
        </div>
      )}
    </div>
  );
};

export default Modal;
