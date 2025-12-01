// Complete responsive, mobile-optimized Chat Modal component
// --- Paste into your project ---

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
  const [contextMenuChat, setContextMenuChat] = useState<Chat | null>(null);
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
      }
    };

    const update = () => fetchMessages();
    socket.on("chat message", update);
    fetchMessages();

    return () => socket.off("chat message", update);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    setIsSending(true);

    const url = editing ? "/api/chat/edit" : "/api/chat/send";
    const body = editing ? { chat: { ...contextMenuChat, message, edited: true } } : { message };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setMessage("");
        setEditing(false);
        socket.emit("chat message");
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleEditStart = (chat: Chat) => {
    setMessage(chat.message);
    setContextMenuChat(chat);
    setEditing(true);
  };

  const deleteMessage = async (chat: Chat) => {
    try {
      await fetch(`/api/chat/delete?id=${chat.id}`, { method: "DELETE" });
      socket.emit("chat message");
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-0">
      <div className="flex h-[100dvh] w-full max-w-xl flex-col overflow-hidden rounded-none bg-white dark:bg-gray-900 shadow-xl md:rounded-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-300 px-4 py-3 dark:border-gray-700">
          <h2 className="text-xl font-bold text-pink-600 dark:text-pink-400">Live Chat</h2>

          {/* FIXED: Large, tappable close button for iOS */}
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-2xl text-gray-700 hover:bg-gray-200 active:scale-95 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div className="flex-grow space-y-3 overflow-y-auto bg-gray-50 p-4 dark:bg-gray-800">
          {history.map((chat, i) => {
            const own = chat.team.uname === session?.user?.uname;
            return (
              <div
                key={i}
                className={`flex items-end ${own ? "justify-end" : "justify-start"}`}
              >
                {!own && (
                  <Image
                    src={`/uploads/${chat.team.uname.toLowerCase()}.jpg`}
                    alt="avatar"
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
                  onClick={() => session?.user?.role === "ADMIN" && handleEditStart(chat)}
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
                    {chat.edited && t("edited")} {new Date(chat.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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

        {/* Footer input */}
        <div className="flex items-end gap-2 border-t border-gray-300 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
          <textarea
            className="flex-grow max-h-28 min-h-12 resize-none rounded-xl border border-gray-300 bg-white p-3 text-gray-900 shadow-sm outline-none focus:ring-2 focus:ring-pink-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            placeholder={session ? t("chatPlaceholder") : t("chatLogin")}
            value={message}
            disabled={!session}
            onChange={(e) => setMessage(e.target.value.slice(0, 100))}
          />

          {editing && (
            <button
              onClick={() => {
                setEditing(false);
                setMessage("");
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-lg dark:bg-gray-700"
            >
              ×
            </button>
          )}

          {session && (
            <button
              onClick={sendMessage}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500 text-xl text-white active:scale-95"
            >
              ➤
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
```tsx
import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatModal({ isOpen, onClose }: ChatModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 relative animate-fade-in"
      >
        {/* Improved X button (larger touch target for iOS) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-3 rounded-full hover:bg-gray-100 active:scale-95 transition flex items-center justify-center"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-4">Chat</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            className="w-full border rounded-lg p-3 text-base"
            placeholder="Password"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Confirm Password</label>
          <input
            type="password"
            className="w-full border rounded-lg p-3 text-base"
            placeholder="Confirm Password"
          />
        </div>

        <button className="w-full py-3 bg-blue-600 text-white rounded-xl text-lg font-semibold active:scale-[0.97] transition">
          Submit
        </button>
      </div>
    </div>
  );
}
```
