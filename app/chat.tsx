"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useUI } from "./context/UIContext";
import { useTranslation } from "next-i18next";
import socket from "../lib/socket";
import { Button } from "@/cooperateDesign";
import { Capacitor } from "@capacitor/core";
import { Keyboard } from "@capacitor/keyboard";
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

const ChatModal: React.FC<ModalProps> = ({ onClose }) => {
  const { setIsModalOpen } = useUI();
  const { data: session } = useSession();
  const { t } = useTranslation();

  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<Chat[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [editing, setEditing] = useState(false);
  const [contextChat, setContextChat] = useState<Chat | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

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

  // Fetch chat messages
  useEffect(() => {
  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/chat/receive");
      if (res.ok) {
        const data: Chat[] = await res.json();
        setHistory(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handler für eingehende Nachrichten
  const handleChatMessage = () => {
    fetchMessages();
  };

  // Subscribe
  socket.on("chat message", handleChatMessage);

  // Initial fetch
  fetchMessages();

  // Cleanup
  return () => {
    socket.off("chat message", handleChatMessage);
  };
}, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // Keyboard handling for iOS/Android
  useEffect(() => {
  if (Capacitor.getPlatform() === "ios" || Capacitor.getPlatform() === "android") {
    // addListener liefert direkt ein Listener-Objekt mit remove()
    const showListener = Keyboard.addListener("keyboardWillShow", (info) => {
      setKeyboardHeight(info.keyboardHeight);
    });

    const hideListener = Keyboard.addListener("keyboardWillHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }
}, []);

  // Send message
  const sendMessage = async () => {
    if (!message.trim() || isSending) return;
    setIsSending(true);

    const url = editing ? "/api/chat/edit" : "/api/chat/send";
    const body = editing
      ? { chat: { ...contextChat, message, edited: true } }
      : { message };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setMessage("");
        setEditing(false);
        setContextChat(null);
        socket.emit("chat message");
      }
    } finally {
      setIsSending(false);
    }
  };

  const startEdit = (chat: Chat) => {
    setMessage(chat.message);
    setContextChat(chat);
    setEditing(true);
  };

  const deleteMessage = async (chat: Chat) => {
    try {
      await fetch(`/api/chat/delete?id=${chat.id}`, { method: "DELETE" });
      socket.emit("chat message");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-0">
      <div className="flex h-[100dvh] w-full max-w-xl flex-col overflow-hidden rounded-none bg-white dark:bg-gray-900 shadow-xl md:rounded-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-300 px-4 py-3 dark:border-gray-700">
          <h2 className="text-xl font-bold text-pink-600 dark:text-pink-400">Live Chat</h2>
          <Button
            onClick={onClose}
            className="h-10 w-10 flex items-center justify-center text-2xl"
          >
            ×
          </Button>
        </div>

        {/* Chat messages */}
        <div className="flex-grow space-y-3 overflow-y-auto bg-gray-50 p-4 dark:bg-gray-800">
          {history.map((chat, i) => {
            const own = chat.team.uname === session?.user?.uname;
            return (
              <div key={i} className={`flex items-end ${own ? "justify-end" : "justify-start"}`}>
                {!own && (
                  <Image
                    src={`/uploads/${chat.team.uname.toLowerCase()}.jpg`}
                    alt={chat.team.name}
                    width={36}
                    height={36}
                    className="mr-2 h-9 w-9 rounded-full object-cover"
                    unoptimized
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/images/teamplaceholder.png";
                    }}
                  />
                )}

                <button
                  onClick={() => session?.user?.role === "ADMIN" && startEdit(chat)}
                  className={`max-w-[80%] break-words rounded-2xl px-4 py-2 shadow-md text-left ${
                    own
                      ? "bg-pink-500 text-white rounded-br-none"
                      : "bg-white text-gray-900 rounded-bl-none dark:bg-gray-700 dark:text-gray-100"
                  }`}
                >
                  {!own && (
                    <div className="mb-1 text-xs font-semibold text-pink-600 dark:text-pink-400">{chat.team.name}</div>
                  )}
                  <div>{chat.message}</div>
                  <div className="mt-1 text-[10px] opacity-70 text-right">
                    {chat.edited && t("edited")}{" "}
                    {new Date(chat.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </button>

                {own && (
                  <Image
                    src={`/uploads/${session?.user?.uname.toLowerCase()}.jpg`}
                    alt="avatar"
                    width={36}
                    height={36}
                    className="ml-2 h-9 w-9 rounded-full object-cover"
                    unoptimized
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/images/teamplaceholder.png";
                    }}
                  />
                )}
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <div
          className="flex items-end gap-2 border-t border-gray-300 bg-white p-3 dark:border-gray-700 dark:bg-gray-900"
          style={{ marginBottom: keyboardHeight }}
        >
          <textarea
            className="flex-grow max-h-28 min-h-12 resize-none rounded-xl border border-gray-300 bg-white p-3 text-gray-900 shadow-sm outline-none focus:ring-2 focus:ring-pink-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            placeholder={session ? t("chatPlaceholder") : t("chatLogin")}
            value={message}
            disabled={!session}
            onChange={(e) => setMessage(e.target.value.slice(0, 100))}
          />

          {editing && (
            <Button
              onClick={() => {
                setEditing(false);
                setMessage("");
              }}
            >
              ×
            </Button>
          )}

          {session && (
            <Button onClick={sendMessage}>
              ➤
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
