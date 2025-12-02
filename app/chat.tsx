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
import type { PluginListenerHandle } from "@capacitor/core";



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
  const [lastContextMenu, setLastContextMenu] = useState<Chat | undefined>(undefined);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; chat: Chat } | null>(null);

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [viewportOffset, setViewportOffset] = useState(0);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Modal Lifecycle
  useEffect(() => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
    return () => {
      setIsModalOpen(false);
      document.body.style.overflow = "auto";
    };
  }, [setIsModalOpen]);

  // Fetch Messages
  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/chat/receive");
      if (res.ok) {
        const data: Chat[] = await res.json();
        setHistory(data);
      }
    } catch (e) {
      console.error("Error fetching chat messages:", e);
    }
  };

  // Socket subscription
  useEffect(() => {
  const handleChatMessage = () => fetchMessages();

  socket.on("chat message", handleChatMessage);

  return () => {
    socket.off("chat message", handleChatMessage); // Cleanup
  };
}, []);


  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

 

  // Keyboard Handling
  useEffect(() => {
    if (Capacitor.getPlatform() === "ios" || Capacitor.getPlatform() === "android") {
      let showSub: PluginListenerHandle | undefined;
      let hideSub: PluginListenerHandle | undefined;

      const attach = async () => {
        showSub = await Keyboard.addListener("keyboardWillShow", (info) => {
          setKeyboardHeight(info.keyboardHeight);
        });
        hideSub = await Keyboard.addListener("keyboardWillHide", () => {
          setKeyboardHeight(0);
        });
      }
      attach();
      const vv = window.visualViewport;
      const updateOffset = () => setViewportOffset(vv?.offsetTop || 0);
      vv?.addEventListener("scroll", updateOffset);
      vv?.addEventListener("resize", updateOffset);

      return () => {
        showSub?.remove?.();
        hideSub?.remove?.();
        vv?.removeEventListener("scroll", updateOffset);
        vv?.removeEventListener("resize", updateOffset);
      };
    }
  }, []);

  // Input Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 100) setMessage(e.target.value);
  };

  const handleSend = async () => {
    if (!message.trim() || isSending) return;
    setIsSending(true);

    const url = editing && lastContextMenu ? "/api/chat/edit" : "/api/chat/send";
    const body = editing && lastContextMenu
      ? { chat: { ...lastContextMenu, message, edited: true } }
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
        setLastContextMenu(undefined);
        socket.emit("chat message");
      }
    } finally {
      setIsSending(false);
    }
  };

  const startEdit = (chat: Chat) => {
    setMessage(chat.message);
    setEditing(true);
    setLastContextMenu(chat);
    setContextMenu(null);
  };

  const handleDelete = async () => {
    if (!contextMenu) return;
    try {
      await fetch(`/api/chat/delete?id=${contextMenu.chat.id}`, { method: "DELETE" });
      socket.emit("chat message");
    } catch (e) {
      console.error(e);
    } finally {
      setContextMenu(null);
    }
  };

  const openOptions = (chat: Chat, e: React.MouseEvent | React.TouchEvent) => {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    setContextMenu({ x: rect.left, y: rect.bottom + 4, chat });
    setLastContextMenu(chat);
  };

  const closeContextMenu = () => setContextMenu(null);
  const handleCancel = () => { setMessage(""); setEditing(false); };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white dark:bg-gray-900 truedark:bg-black rounded-lg shadow-xl w-full max-w-3xl h-[100dvh] flex flex-col">
        {/* Header */}
        <div
          className={`flex justify-between items-center py-4 px-6 border-b border-gray-200 dark:border-gray-700 truedark:border-white ${Capacitor.getPlatform() === "ios" ? "pt-20" : ""}`}
        >
          <h2 className="text-2xl font-bold text-pink-600 dark:text-pink-400 truedark:text-white">Live Chat</h2>
          <Button onClick={onClose} aria-label="Close Chat">✕</Button>
        </div>

        {/* Messages */}
        <div
          className="flex-grow p-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 truedark:bg-black"
          onClick={closeContextMenu}
        >
          {history.map((chat, i) => {
            const isOwn = chat.team.uname === session?.user?.uname;
            return (
              <div
                key={i}
                className={`flex items-end mb-3 ${isOwn ? "justify-end" : "justify-start"}`}
                onClick={(session?.user?.role === "ADMIN") ? (e) => openOptions(chat, e) : undefined}
              >
                {!isOwn && (
                  <Image
                    src={`/uploads/${chat.team.uname.toLowerCase()}.jpg`}
                    alt={chat.team.name}
                    width={36}
                    height={36}
                    className="rounded-full object-cover bg-white shadow w-9 h-9 mr-2"
                    unoptimized
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/teamplaceholder.png"; }}
                  />
                )}

                <div className={`max-w-[50%] px-4 py-2 rounded-2xl shadow relative
                  ${isOwn ? "bg-pink-500 text-white rounded-br-none" : "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none"} break-words whitespace-normal`}
                >
                  {!isOwn && (
                    <div className="text-xs font-semibold text-pink-600 dark:text-pink-400 mb-1">
                      {chat.team.name}
                    </div>
                  )}
                  <div>{chat.message}</div>
                  <div className="text-[10px] opacity-70 mt-1 text-right">
                    {chat.edited ? t("edited") : ""} {new Date(chat.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>

                {isOwn && (
                  <Image
                    src={`/uploads/${session?.user?.uname.toLowerCase()}.jpg`}
                    alt={session?.user?.uname || "user"}
                    width={36}
                    height={36}
                    className="rounded-full object-cover bg-white shadow w-9 h-9 ml-2"
                    unoptimized
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/christmas_calender0.jpg"; }}
                  />
                )}
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div
          className="flex items-end p-3 border-t border-gray-200 dark:border-gray-700 truedark:boder-white bg-white dark:bg-gray-900 truedark:bg-black space-x-2"
          style={{
            position: "sticky",
            bottom: keyboardHeight - viewportOffset + 10,
            zIndex: 20,
          }}
        >
          <textarea
            className="flex-grow rounded-xl border border-gray-300 dark:border-gray-600 truedark:border-white px-4 py-3 shadow-sm bg-white dark:bg-gray-700 truedark:bg-black focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 dark:text-gray-100 truedark:text-white min-h-[48px] max-h-[120px] resize-none"
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
          <div className="flex space-x-2">
            {editing && <Button onClick={handleCancel}>✕</Button>}
            {!!session && <Button onClick={handleSend}>➤</Button>}
          </div>
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2">
            <span className={message.length === 100 ? "text-red-600" : ""}>{message.length}/100</span>
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="absolute bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 truedark:border-white truedark:bg-black rounded-md shadow-lg z-50"
        >
          <Button onClick={() => startEdit(contextMenu.chat)}>✏️</Button>
          <Button onClick={handleDelete}>🗑️</Button>
        </div>
      )}
    </div>
  );
};

export default ChatModal;
