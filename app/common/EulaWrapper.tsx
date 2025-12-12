'use client';
import React, { useState, useEffect } from 'react';
import EulaPrompt from '../eula';
import LanguageModal from '../language';

interface EulaWrapperProps {
  children: React.ReactNode;
}

export default function EulaWrapper({ children }: EulaWrapperProps) {
  const [languageSet, setLanguageSet] = useState(false);
  const [eulaAccepted, setEulaAccepted] = useState(false);

  useEffect(() => {
    // Prüfen, ob Sprache schon gespeichert ist
    const lang = localStorage.getItem('language');
    if (lang) setLanguageSet(true);

    // Prüfen, ob EULA schon akzeptiert wurde
    const eula = localStorage.getItem('eulaAccepted');
    if (eula === 'true') setEulaAccepted(true);

    // Hintergrundscrollen blockieren, solange Modal/EULA aktiv ist
    if (!languageSet || !eulaAccepted) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [languageSet, eulaAccepted]);

  if (!languageSet) {
    return <LanguageModal onClose={() => setLanguageSet(true)} />;
  }

  if (!eulaAccepted) {
    return <EulaPrompt onAccept={() => setEulaAccepted(true)} />;
  }

  // Alles akzeptiert, normaler Content
  return <>{children}</>;
}
