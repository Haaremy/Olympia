'use client';

import React, { useEffect, useRef, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useUI } from './context/UIContext';
import { Capacitor } from "@capacitor/core";
import {
  showPopupNotification,
  createNotificationChannel
} from "@/capacitor/notificationService";

interface ModalProps {
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [realname, setRealName] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { setIsModalOpen } = useUI();
  const modalRef = useRef<HTMLDivElement>(null);
  const [pending, setPending] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await performLogin();
  };
    
  const performLogin = async () => {
    
  const result = await signIn('credentials', {
    redirect: false,
    username,
    password,
  });

  if (result?.error) {
    setError('Ungültige Anmeldedaten');
  } else {
    if(Capacitor.getPlatform() === 'android'){
    await createNotificationChannel();
        await showPopupNotification(
          "🎁 Olympia Live Ticker 🎁", "Punkte - Timer - Start\nAlle Infos in der Statusleiste 👆🏼"
        );
    }
    router.push('/');
    onClose();
  }
};


  const register = async () => {
  if (!pending) {
    setShowRegister(true);
    setPending(true);
    return;
  }

  if (password !== password2 || !username || !realname) {
    alert("Bitte alle Felder korrekt ausfüllen.");
    return;
  }

  try {


    // 2. Save the new user
    const saveRes = await fetch("/api/team/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uname: username,
        name: realname,
        clearpw: password,
      }),
    });

    if (saveRes.ok) {
      alert("Registrierung erfolgreich!");
      // z. B. zur Login-Seite weiterleiten
       
      await performLogin();
    } else {
      const err = await saveRes.json();
      alert("Fehler bei der Registrierung: " + err.error);
    }
  } catch (error) {
    console.error("Fehler bei der Registrierung:", error);
    alert("Ein unerwarteter Fehler ist aufgetreten.");
  }
};

  useEffect(() => {
    const modal = modalRef.current;

    setIsModalOpen(true);

    // Fokus auf das Modal setzen
    if (modal) {
        modal.focus();
    }

    // Scrollen im Hintergrund deaktivieren
    document.body.style.overflow = 'hidden';

    // Escape-Taste zum Schließen des Modals
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Cleanup: Entfernen des Event Listeners und Aktivieren des Scrollens
    return () => {
        document.removeEventListener('keydown', handleKeyDown);
        setIsModalOpen(false);

        // Scrollen wieder aktivieren, wenn das Modal geschlossen wird
        document.body.style.overflow = 'auto';
    };
}, [onClose, setIsModalOpen]);

  return (
    <div
      id="modal"
      tabIndex={-1}
      className="fixed inset-0 flex justify-center items-center bg-white/20 dark:bg-black/30 backdrop-blur-sm z-50"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-6 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-auto m-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 id="modal-title" className="text-2xl font-bold">User-Login</h2>
          <button
            onClick={onClose}
            className="text-sm px-3 py-1 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition"
            aria-label="Modal schließen"
          >
            X
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-500 font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form  className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">Team Login ID</label>
            <input
              id="username"
              placeholder="z.B. ABC, Team1, MiMaTe, ..."
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
              autoCapitalize="off"
              autoCorrect="off"
            />
          </div>

          { showRegister &&<div>
              <label htmlFor="realname" className="block text-sm font-medium mb-1">Team Name</label>
            <input
              id="realname"
              type="text"
              placeholder='Santas Crew'
              value={realname}
              onChange={(e) => setRealName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
              autoCapitalize="off"
              autoCorrect="off"
            />
          </div>
          }

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Passwort</label>
            <input
              id="password"
              type="password"
              placeholder='hoHoh0'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
              autoCapitalize="off"
              autoCorrect="off"
            />
          </div>

         { showRegister && <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Passwort II</label>
            <input
              id="password"
              type="password"
              placeholder='hoHoh0'
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
              autoCapitalize="off"
              autoCorrect="off"
            />
          </div>
        }
          <button
            type="button"
            onClick={handleLogin}
            className="w-full py-2 rounded-lg bg-pink-500 text-white font-medium hover:bg-pink-600 transition"
          >
            Login
          </button>
          <button
          type="button"
            onClick={register}
            className="w-full py-2 rounded-lg bg-pink-500 text-white font-medium hover:bg-pink-600 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
