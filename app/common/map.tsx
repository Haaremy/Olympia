"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { Capacitor } from '@capacitor/core';
import {Geolocation, Position} from "@capacitor/geolocation";


 

interface Game {
  id: string;
  y: number;
  x: number;
}

interface MapSectionProps {
  title: string;
  imageSrc: string;
  games: Game[];
  searchQuery: string;
}

function MapSection({ title, imageSrc, games, searchQuery }: MapSectionProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<Position  | null>(null);


   useEffect(() => {
  const fetchPosition = async () => {
    const perm = await Geolocation.requestPermissions();
    console.log("Geo Permissions:", perm);

    if (perm.location === "granted") {  // nur "granted" verwenden
      const pos = await Geolocation.getCurrentPosition(); // Capacitor
      setPosition(pos); // Typ passt zu GeolocationPosition
      console.log("Position:", pos.coords.latitude, pos.coords.longitude);
    } else {
      console.warn("Geolocation permission not granted");
    }
  };

  fetchPosition();
}, []);

  useEffect(() => {
  if (!mapRef.current) return;

  (async () => {
    const L = await import("leaflet");

    const width = 1600;
    const height = 1131;
    const bounds: L.LatLngBoundsExpression = [[0, 0], [height, width]];

    const DefaultIcon = L.icon({
      iconUrl: "/images/marker-icon.png",
      shadowUrl: "/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

  

    L.Marker.prototype.options.icon = DefaultIcon;
    if (!mapRef.current) return;
    const map = L.map(mapRef.current, {
      crs: L.CRS.Simple,
      minZoom: Capacitor.getPlatform().includes("web") ? -2 : -2,
      maxZoom: 1,
      maxBounds: bounds,
      maxBoundsViscosity: 1.0,
    });

    const idIcon = (id: string) =>
      L.divIcon({
        className: "id-marker",
        html: `<span>${id}</span>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15],
      });

    L.imageOverlay(imageSrc, bounds).addTo(map);
    map.fitBounds(bounds);

    games.forEach((game) => {
      L.marker([game.y, game.x], { icon: idIcon(game.id) })
        .addTo(map)
        .bindPopup(`${game.id}`);
    });

      if (position) {
    L.marker([position.coords.latitude, position.coords.longitude])
    .addTo(map)
    .bindPopup("Du bist hier");
}

    return () => {
      map.remove();
    };
  })();
}, [games, imageSrc, position]);

  const filteredGames = games.filter((game) =>
    game.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section
      className={`bg-white dark:bg-gray-800 p-1 sm:max-w-[1080px] sm:p-6 rounded-lg shadow-lg w-full text-center mb-10 ${
        filteredGames.length !== 0 ? "visible" : "hidden"
      }`}
    >
      <div className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-4">
        {title}
      </div>

      {/* Container für Leaflet Map */}
      <div ref={mapRef} style={{ height: "32vh", width: "100%", zIndex: "0", background: "linear-gradient(to bottom, #E3001B, #140079"} } />
    </section>
  );
}

export default dynamic(() => Promise.resolve(MapSection), { ssr: false });
