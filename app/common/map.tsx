"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { Capacitor } from '@capacitor/core';
import {Geolocation, Position} from "@capacitor/geolocation";
import { useTranslation } from 'next-i18next';
import '../../lib/i18n';
 

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
 const { i18n  } = useTranslation();  // Hook innerhalb der Komponente verwenden


const getLangID = () => {
  switch (i18n.language) {
    case "de":
      return 0;
    case "en":
      return 1;
    default:
      return 0; // Default ID if language is not "de" or "en"
  }
}

  // GPS-Referenzpunkte für dein Bild

const positionMarkerRef = useRef<L.Marker | null>(null);


// Annahmen: src-Geo-Punkte (lat,lng) als in deinem Projekt
const northEastGeo: [number, number] = [51.746222, 11.983056]; // NE (lat, lng)
const southWestGeo: [number, number] = [51.745722, 11.984167]; // SW (lat, lng)

// Deine Schätzungen in Pixeln (x, y)
const pixelNE: [number, number] = [1330, 160];   // NE -> x=310, y=160
const pixelSW: [number, number] = [330, 760];  // SW -> x=1330, y=770

 
function latLngToPixel(lat: number, lng: number): [number, number] {
  const [latNE, lngNE] = northEastGeo; // nördlich, östlich
  const [latSW, lngSW] = southWestGeo; // südlich, westlich
  const [xNE, yNE] = pixelNE;           // Pixel NE
  const [xSW, ySW] = pixelSW;           // Pixel SW

  // X: Ost/West korrekt, links = West, rechts = Ost
  const tX = (lng - lngSW) / (lngNE - lngSW); // 0..1
  const x = xSW + tX * (xNE - xSW);

  // Y: Nord/Süd linear (oben = Norden)
  const tY = (latNE - lat) / (latNE - latSW);
  const y = yNE + tY * (ySW - yNE);

  return [Math.round(x), Math.round(y)];
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


 const fetchPosition = async () => {
  const perm = await Geolocation.requestPermissions();

  if (perm.location === "granted") {
    const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
    setPosition(pos);

    const [x, y] = latLngToPixel(pos.coords.latitude, pos.coords.longitude);

    // Wenn Marker existiert → Position aktualisieren
    if (positionMarkerRef.current) {
      positionMarkerRef.current.setLatLng([y, x]);
    }

    return [x, y];
  }
};


   useEffect(() => {
    
    (async () => {
    await loadGames();
    
     const interval = setInterval(() => {
      fetchPosition();
    }, 2000);

    // Cleanup beim Unmount
    return () => clearInterval(interval);

  })();


  

 
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

   
   const posIcon = (id: string) =>
  L.divIcon({
    className: "id-marker-pos",
    html: `<span>${id}</span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });

    L.imageOverlay(imageSrc, bounds).addTo(mapInstance.current!);
    mapInstance.current.fitBounds(bounds);

    const titles =  await loadGames();
    
      

    await filteredGames.forEach((game) => {
      const currTitle =titles[parseInt(game.id)-1].languages[getLangID()].title ?? "???";
      L.marker([game.y, game.x], { icon: idIcon(game.id) })
        .addTo(mapInstance.current!)
        .bindPopup(currTitle);
    });

   
  mapInstance.current.createPane("posPane");
  mapInstance.current.getPane("posPane")!.style.zIndex = "30";

    
     const coords = await fetchPosition();
if (coords) {
  const [cX, cY] = coords;
  const marker = L.marker([cY, cX], { icon: posIcon("📍"), pane:"posPane", })
    .addTo(mapInstance.current!)
    .bindPopup("🫵🏻");
  positionMarkerRef.current = marker;
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
      <div>{!!position ? `Position: ${position.coords.latitude},${position.coords.longitude} `: ""}</div>
    </section>
  );
}

export default dynamic(() => Promise.resolve(MapSection), { ssr: false });
