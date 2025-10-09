"use client"; 
import { useEffect, useState } from "react";
import Image from "next/image";
import {SelectField} from "@cooperateDesign";

export default function ThemeSelector() {
  const [theme, setTheme] = useState<string>("auto");

  // Effekt, um das gespeicherte Thema aus localStorage zu laden
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "auto";
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  // Funktion zum Anwenden des Themas
  const applyTheme = (themeToApply: string) => {
    const root = document.documentElement as HTMLElement;  // Typ explizit setzen
    const sysDesign = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const clearClasses = (keep?: string) => {
      [...root.classList].forEach((cls) => {
        if (cls !== keep) root.classList.remove(cls);
      });
    };

    switch (themeToApply) {
      case "auto":
        if (sysDesign === "dark") {
          root.classList.add("dark");
          clearClasses("dark");
        } else {
          clearClasses();
        }
        break;
      case "light":
        clearClasses();
        break;
      case "dark":
        root.classList.add("dark");
        clearClasses("dark");
        break;
      case "truedark":
        root.classList.add("truedark");
        clearClasses("truedark");
        break;
      default:
        root.classList.add("dark");
        clearClasses("dark");
        break;
    }
  };

  // Funktion zum Handhaben der Themenänderung
  const theming = (newTheme: string) => {
    localStorage.setItem("theme", newTheme); // Thema im localStorage speichern
    setTheme(newTheme); // Zustand aktualisieren
    applyTheme(newTheme); // Thema anwenden
  };

  return (
    <div className="flex items-center gap-2">
      <Image
        src={`/images/settingstheme.svg`}
        alt="Theme Icon"
        className="h-8 w-8 object-cover rounded-lg truedark:invert dark:invert invert-0"
        width={50}
        height={50}
      />
      <SelectField
        value={theme}
        onChange={(e) => theming(e.target.value)} // Themenwechsel triggern
      >
        <option value="auto">Auto</option>
        <option value="dark">Dark</option>
        <option value="light">Light</option>
        <option value="truedark">True Dark Mode</option>
      </SelectField>
    </div>
  );
}
