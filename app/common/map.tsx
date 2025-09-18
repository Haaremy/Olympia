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

  // GPS-Referenzpunkte für dein Bild




function latLngToPixel(
  lat: number,
  lng: number,
): [number, number] {
  // Referenzpunkte in Lat/Lng
  const northEast: [number, number] = [51.746222, 11.983056]; // Nord/Ost (links unten im Bild)
  const southWest: [number, number] = [51.745722, 11.984167]; // Süd/West (rechts oben im Bild)

  // Referenzpunkte in Pixeln
  const pixelNorthEast: [number, number] = [311, 1315]; // links unten
  const pixelSouthWest: [number, number] = [1315, 311]; // rechts oben

  // Geo-Differenzen
  const difLat = northEast[0] - southWest[0]; // Nord → Süd
  const difLng = southWest[1] - northEast[1]; // Ost → West

  // Pixel-Differenzen
  const difX = pixelSouthWest[0] - pixelNorthEast[0];
  const difY = pixelNorthEast[1] - pixelSouthWest[1];

  // Umrechnung: beide Achsen sind "invertiert"
  const x = ((southWest[1] - lng) / difLng) * difX + pixelNorthEast[0];
  const y = ((lat - southWest[0]) / difLat) * difY + pixelSouthWest[1];

  return [x, y];
}

async function loadGames() {
  try {
    const res = await fetch("/api/game"); // Pfad als String
    if (!res.ok) throw new Error("Fehler beim Laden der Spiele");
    const data = await res.json(); // JSON parsen
    //console.log("Games:", data);
    return data; // z. B. ein Array von Games
  } catch (err) {
    console.error(err);
    return [];
  }
}


   useEffect(() => {
    
    (async () => {
    await loadGames();
    
     const interval = setInterval(() => {
      fetchPosition();
    }, 2000);

    // Cleanup beim Unmount
    return () => clearInterval(interval);

  })();


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


  const filteredGames = games.filter((game) =>
    game.id.toLowerCase().includes(searchQuery.toLowerCase())
    
  );

  const mapInstance = useRef<L.Map | null>(null);

useEffect(() => {
  if (!mapRef.current) return;

  (async () => {
    const L = await import("leaflet");

    if (mapInstance.current) {
      return;
    }

    
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

    if(!mapRef.current) return
    mapInstance.current = L.map(mapRef.current, {
      crs: L.CRS.Simple,
      minZoom: Capacitor.getPlatform().includes('android') ? -2 : -2,
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

    L.imageOverlay(imageSrc, bounds).addTo(mapInstance.current!);
    mapInstance.current.fitBounds(bounds);

    const titles =  await loadGames();

    await filteredGames.forEach((game) => {
      const currTitle =titles[parseInt(game.id)-1].languages[0].title ?? "test";
      L.marker([game.y, game.x], { icon: idIcon(game.id) })
        .addTo(mapInstance.current!)
        .bindPopup(currTitle);
    });

    if (position) {
      const [x, y] = latLngToPixel(
        position.coords.latitude,
        position.coords.longitude,
      );
      L.marker([y, x])
        .addTo(mapInstance.current!)
        .bindPopup("Du bist hier");
    }
  })();
}, [imageSrc, filteredGames, position]);



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
      <div>{!!position ? `${position.coords.latitude} ":"${position.coords.longitude} `: ""}</div>
    </section>
  );
}

export default dynamic(() => Promise.resolve(MapSection), { ssr: false });
