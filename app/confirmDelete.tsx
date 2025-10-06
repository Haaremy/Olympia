"use client";

import { signOut } from "next-auth/react";
import router from "next/router";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react"; // Import der useSession Hook
import {Button} from "@cooperateDesign";
import TextInput from "@/cooperateDesign/textInput";

interface DeleteConfirmModalProps {
  onClose: () => void;
  teamName?: string;
}

export default function DeleteConfirmModal({ onClose, teamName }: DeleteConfirmModalProps) {
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
      if(!!session)
        
          await fetch(`/api/image/delete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageName: (teamName ?? session.user.uname).toLowerCase()+".jpg" }),
          });
      try {
      // call delete API
      await fetch(`/api/team/delete`, {
        method: "DELETE",
        body: JSON.stringify({ uname: teamName ?? session?.user?.uname }),
      });
    
      
    if(!teamName){
      localStorage.removeItem("playedGames");
      await signOut({ redirect: false });
      router.push("/");
    }
    onClose();
  }catch (error) {  
      console.error("Fehler beim Löschen des Teams:", error);
    }
    
      
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
          <Button
            onClick={onClose}
            aria-label="Modal schließen"
          >
            ✕
          </Button>
        </div>

        {/* Body */}
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Bitte gib <span className="font-bold">„LÖSCHEN“</span> ein, um dein Team endgültig zu löschen.
        </p>
        <TextInput
          placeholder="LÖSCHEN"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="focus:ring-red-500"
        />


        {/* Footer */}
        <div className="flex justify-end gap-3 mt-4">
          <Button
            onClick={onClose}
          >
            Abbrechen
          </Button>
          <Button
            onClick={onConfirm}
            disabled={input !== "LÖSCHEN"}
            variant="danger"
            className={`px-4 py-2 rounded-lg  ${
              input === "LÖSCHEN"
                ? ""
                : "cursor-not-allowed"
            }`}
          >
            Bestätigen
          </Button>
        </div>
      </div>
    </div>
  );
}
