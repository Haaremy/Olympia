"use client";

import { signOut } from "next-auth/react";
import router from "next/router";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react"; // Import der useSession Hook

interface DeleteConfirmModalProps {
  onClose: () => void;
}

export default function DeleteConfirmModal({ onClose }: DeleteConfirmModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    const modal = modalRef.current;
    if (modal) modal.focus();

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (overlayRef.current === e.target) onClose();
  };

  const onConfirm = async () =>{
    // clear local storage
      localStorage.removeItem("playedGames");
      if(!!session)
        await fetch(`/api/image/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageName: (session.user.uname).toLowerCase()+".jpg" }),
      });
      
      // call delete API
      await fetch(`/api/team/delete`, {
        method: "DELETE",
      });
    
      await signOut({ redirect: false });
    
      router.push("/");
  }

  return (
    <div
      ref={overlayRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 id="modal-title" className="text-xl font-semibold text-red-600">
            Konto löschen
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
            aria-label="Modal schließen"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Bitte gib <span className="font-bold">„LÖSCHEN“</span> ein, um dein Team endgültig zu löschen.
        </p>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="LÖSCHEN"
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none"
        />

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            Abbrechen
          </button>
          <button
            onClick={onConfirm}
            disabled={input !== "LÖSCHEN"}
            className={`px-4 py-2 rounded-lg text-white transition ${
              input === "LÖSCHEN"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-red-400 cursor-not-allowed"
            }`}
          >
            Bestätigen
          </button>
        </div>
      </div>
    </div>
  );
}
