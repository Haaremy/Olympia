'use client';

import React, { useEffect, useRef, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useUI } from './context/UIContext';
import { Capacitor } from "@capacitor/core";
import { Button, TextInput } from '@/cooperateDesign';
import { useTranslation } from 'next-i18next';
import Infobox from './infoBox'; 
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
  const [infoText, setInfoText]  = useState('');
  const [infoColor, setInfoColor] = useState('pink');
  const [showInfo, setShowInfo] = useState(false);
  const [infoTitle, setInfoTitle]  = useState('');
  const [awaitLogin, setAwaitLogin] = useState(false);
  const {t} = useTranslation();
  

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
          "🎁 Olympia Live Ticker 🎁", `${t("statusInfos1")}\n${t("statusInfos2")} 👆🏼`
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
      setInfoText(t("postRegistrationS"));
      setInfoTitle(t("registrationSuccess"));
      setInfoColor("pink");
      setShowInfo(true);
      // z. B. zur Login-Seite weiterleiten, wenn close Info
       setAwaitLogin(true);
      
    } else {
      const err = await saveRes.json();
      setInfoText(t("postRegistrationF"));
      setInfoTitle(t("registrationFail"));
      setInfoColor("red");
      setShowInfo(true);
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

  const handleInfoClose = async () => {
    setShowInfo(false);
    if(awaitLogin){
      setAwaitLogin(false);
      await performLogin();
    }
  }

  return (
    <div
      id="modal"
      tabIndex={-1}
      className="fixed inset-0 flex justify-center items-center bg-white/20 dark:bg-black/30 backdrop-blur-sm z-50"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div className="bg-white dark:bg-gray-800 text-gray-800 truedark:bg-black truedark:text-white dark:text-gray-200 p-6 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-auto m-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 id="modal-title" className="text-2xl font-bold">User-Login</h2>
          <Button
            onClick={onClose}
            aria-label="Modal schließen"
          >
            X
          </Button>
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
            <label htmlFor="username" className="block text-sm font-medium mb-1">{t("secret")}-ID</label>
            <TextInput
              placeholder="z.B. ABC, Team1, MiMaTe, ..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoCapitalize="off"
              autoCorrect="off"
            />

          </div>

          { showRegister &&<div>
              <label htmlFor="realname" className="block text-sm font-medium mb-1">Team Name</label>
            <TextInput
              placeholder="Santas Crew"
              value={realname}
              onChange={(e) => setRealName(e.target.value)}
              required
              autoCapitalize="off"
              autoCorrect="off"
            />

          </div>
          }

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">{t("password")}</label>
            <TextInput
              type="password"
              placeholder="hoHoh0"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoCapitalize="off"
              autoCorrect="off"
            />

          </div>

         { showRegister && <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">{t("password")} II</label>
            <TextInput
              type="password"
              placeholder="hoHoh0"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
              autoCapitalize="off"
              autoCorrect="off"
            />

          </div>
        }
        <div className='flex justify-end gap-4'>
          <Button
          type='button'
            onClick={handleLogin}
          >
            Login
          </Button>
          <Button
          type='button'
            onClick={register}
          >
            Register
          </Button>
        </div>
        </form>
      </div>
      {showInfo && (
                <Infobox onClose={handleInfoClose} message={infoText} title={infoTitle} color={infoColor} />
            )}
    </div>
  );
};

export default Modal;
