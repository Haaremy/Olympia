'use client';

import React, { useEffect, useRef, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useUI } from './context/UIContext';

interface ModalProps {
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { setIsModalOpen } = useUI();
  const modalRef = useRef<HTMLDivElement>(null);
  
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    if (result?.error) {
      setError('Ungültige Anmeldedaten');
    } else {
      router.push('/');
      onClose(); // Modal schließen bei erfolgreichem Login
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
      <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-6 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 id="modal-title" className="text-2xl font-bold">Team-Login</h2>
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">ID</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
              autoCapitalize="off"
              autoCorrect="off"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Pin</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
              autoCapitalize="off"
              autoCorrect="off"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-pink-500 text-white font-medium hover:bg-pink-600 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
