'use client';  // Ensure this component is client-side

import { useEffect, useState } from 'react';
import MapSection from '../common/map_old';
import {gamesEG, gamesOG} from "../common/mapPos";
import { useTranslation } from 'next-i18next';
import '../../lib/i18n'
import { useUI } from '../context/UIContext';

// Main Component
export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
    const { isModalOpen } = useUI();
    const [isScrolled, setIsScrolled] = useState(false); // Default: false
  const [hydrated, setHydrated] = useState(false); // Flag für Hydration
  
  
  useEffect(() => {
    const gameQuery = new URLSearchParams(window.location.search).get('gameQuery');
    if (gameQuery) {
      setSearchQuery(gameQuery); // Setting the search query from URL
    }
  }, []);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && typeof window !== "undefined") {
      const handleScroll = () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const docHeight = document.body.scrollHeight;
        const remaining = docHeight - (scrollY + windowHeight);
        setIsScrolled(remaining < 50);
      };

      window.addEventListener("scroll", handleScroll);
      handleScroll(); // Initial call

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [hydrated]);

  const { t } = useTranslation();  // Hook innerhalb der Komponente verwenden


  return (
    <main className="mt-20 flex min-h-screen flex-col p-1 sm:p-8 pt-20 bg-pink-50 dark:bg-gray-900 ">
     

      {/* Search Input */}
      <div className="flex flex-col items-center justify-between">
      <input
          type="text"
          placeholder="Suche nach Spielnummer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`${isModalOpen ? "hidden" : "block"} 
            fixed z-50 
            left-1/2 transform -translate-x-1/2 
            sm:top-20 sm:bottom-auto 
            p-3 pl-6 pr-6 w-full max-w-md 
            text-gray-800 dark:text-white 
            bg-white dark:bg-gray-700 
            border border-gray-300 dark:border-gray-600 
            rounded-xl shadow-lg 
            focus:outline-none focus:ring-2 focus:ring-pink-500 transition ${isScrolled ? "bottom-40" : "bottom-5"}`}
        />

        {/* Map Sections */}
        <MapSection
          title={t('loc_0')}
          imageSrc={`/images/map_${t('mapImageGR')}.jpg`}
          games={gamesEG}
          searchQuery={searchQuery}
        />

        <MapSection
          title={t('loc_1')}
          imageSrc={`/images/map_${t('mapImage1st')}.jpg`}
          games={gamesOG}
          searchQuery={searchQuery}
        />
      </div>
    </main>
  );
}
