'use client';  // Ensure this component is client-side

import { useEffect, useState } from 'react';
import MapSection from '../common/map';
import {gamesEG, gamesOG} from "../common/mapPos";
import { useTranslation } from 'next-i18next';
import {Main} from "@cooperateDesign";
import '../../lib/i18n'

// Main Component
export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  
  
  useEffect(() => {
    const gameQuery = new URLSearchParams(window.location.search).get('gameQuery');
    if (gameQuery) {
      setSearchQuery(gameQuery); // Setting the search query from URL
    }
  }, []);







  const { t } = useTranslation();  // Hook innerhalb der Komponente verwenden


  return (
    <Main className="sm:p-8 pt-20">
     

      {/* Search Input */}
      <div className="flex flex-col items-center justify-between w-full">
      {/*<input
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
        */}

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
    </Main>
  );
}
