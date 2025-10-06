"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useUI } from "./context/UIContext";
import { useTranslation } from "next-i18next";
import socket from "../lib/socket";
import { Button } from "@/cooperateDesign";

interface ModalProps {
  onClose: () => void;
}

interface Chat {
  id: number;
  message: string;
  createdAt: string;
  edited: boolean;
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
  const [lastContextMenu, setLastContextMenu] = useState<Chat | undefined>(undefined);

  const [editing, setEditing] = useState(false);

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

  // define a handler
  const handleChatMessage = () => {
    fetchMessages();
  };

  // subscribe
  socket.on("chat message", handleChatMessage);

  // initial fetch
  fetchMessages();

  // polling fallback
  //const interval = setInterval(fetchMessages, 100000);

  // cleanup
  return () => {
    //clearInterval(interval);
    socket.off("chat message", handleChatMessage);
  };
}, []);


  const scrollEnd = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendEdit = async () => {
    if(!lastContextMenu) return;
    const chat = lastContextMenu;
    chat.message = message;
    chat.edited = true;
    try {
      const res = await fetch("/api/chat/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat }),
      });
      

      if (res.ok) {
        setMessage("");
        socket.emit("chat message");
      } else {
        console.error("Error on Chat send");
      }
    } catch (e) {
      console.error("Error on Chat:", e);
    } finally {
      setIsSending(false);
    }
  }


  const handleSend = async () => {
    if(editing){
      handleSendEdit();
      return;
    }
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
        socket.emit("chat message");
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

  const openOptions = (chat: Chat, e: React.MouseEvent | React.TouchEvent) => {
  const target = e.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();

  setContextMenu({
    x: rect.left,          // linke Kante der Message
    y: rect.bottom + 4,    // knapp unter der Message
    chat,
  });

  setLastContextMenu(chat);
};

const handleDelete = async () => {
  if (!contextMenu) return;
  const chat = contextMenu.chat;
  try {
    const res = await fetch(`/api/chat/delete?id=${chat.id}`, {
  method: "DELETE",
});
    if (res.ok) {
      socket.emit("chat message");
      setContextMenu(null);
    }
  } catch (e) {
    console.error("Error deleting chat message:", e);
  } finally {
    setContextMenu(null);
  } 
};

const handleEdit = () => {
 if (!contextMenu) return;
  const chat = contextMenu.chat;
  setMessage(chat.message);
  setEditing(true);
}

const handleCancel = () => {
  setMessage("");
  setEditing(false);
}



  const closeContextMenu = () => { if(contextMenu) {setContextMenu(null)}; };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50" >
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-3xl h-[100dvh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center py-4 px-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-pink-600 dark:text-pink-400">Live Chat</h2>
          <Button
            onClick={onClose}
            aria-label="Close Chat"
          >
            ✕
          </Button>
        </div>

        {/* Nachrichten */}
        <div className="flex-grow p-4 overflow-y-auto bg-gray-50 dark:bg-gray-800" onClick={closeContextMenu}>
          {error && <div className="text-red-500">{error}</div>}
          {history.map((chat, i) => {
            const isOwnMessage = chat?.team?.uname === session?.user?.uname;
            return (
              <div
                key={i}
                className={`flex items-end mb-3 ${
                  isOwnMessage ? "justify-end" : "justify-start"
                }`}
                onClick={(e) =>
                  ( session?.user?.role === "ADMIN") && openOptions(chat, e) // isOwnMessage ||
                }
              >

                {/* Avatar */}
                {!isOwnMessage && (
                  <Image
                    src={`/uploads/${chat.team.uname.toLowerCase()}.jpg`}
                    alt={chat.team.name}
                    width={36}
                    height={36}
                    className="rounded-full object-cover bg-white shadow w-9 h-9 mr-2"
                    unoptimized
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.src = "/images/teamplaceholder.png";
                    }}
                  />
                )}

                <div
                  className={`max-w-[50%] px-4 py-2 rounded-2xl shadow relative
                    ${isOwnMessage
                      ? "bg-pink-500 text-white rounded-br-none"
                      : "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none"} 
                    break-words whitespace-normal`}
                >
                  {!isOwnMessage && (
                    <div className="text-xs font-semibold text-pink-600 dark:text-pink-400 mb-1">
                      {chat.team.name}
                    </div>
                  )}
                  <div>{chat.message}</div>
                  <div className="text-[10px] opacity-70 mt-1 text-right">
                    {chat.edited ? t("edited") : ""} {new Date(chat.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>


                {/* Avatar rechts für eigene Messages */}
                {isOwnMessage && (
                  <Image
                    src={
                      session
                        ? `/uploads/${session.user.uname.toLowerCase()}.jpg`
                        : "/images/teamplaceholder.png"
                    }
                    alt={session?.user?.uname || "user"}
                    width={36}
                    height={36}
                    className="rounded-full object-cover bg-white shadow w-9 h-9 ml-2"
                    unoptimized
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.src = "/images/teamplaceholder.png";
                    }}
                  />
                )}
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
            <div className="flex space-x-2">
            { editing && 
            <Button
              onClick={handleCancel}
            >
              X
            </Button> 
            }
            <Button
              onClick={handleSend}
            >
              ➤
            </Button>
            </div>
          )}

          {/* Counter */}
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2">
            <span className={message.length === 100 ? "text-red-600" : ""}>
              {message.length}/100
            </span>
          </div>
        </div>
      </div>

      {/* Kontextmenü */}
      {contextMenu && (
        <div
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="absolute bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-50"
        >
          <Button onClick={handleEdit}>✏️</Button>
          <Button onClick={handleDelete}>🗑️</Button>
        </div>
      )}
    </div>
  );
};

export default Modal;
