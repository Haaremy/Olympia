"use client";
import { useEffect } from "react";

export default function ThemeSettings() {
  useEffect(() => {
    const root = window.document.documentElement;

    const sysDesign = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    let storedTheme = localStorage.getItem("theme");
    if (!storedTheme) {
      localStorage.setItem("theme", "auto");
      storedTheme = "auto";
    }

    const clearClasses = (keep?: string) => {
      [...root.classList].forEach(cls => {
        if (cls !== keep) root.classList.remove(cls);
      });
    };

    const applyTheme = (themeToApply: string) => {
      switch (themeToApply) {
        case "auto":
          if (sysDesign === "dark") {
            root.classList.add("dark");
            clearClasses("dark");
          } else {
            clearClasses(); // keine Klassen beibehalten
          }
          break;
        case "light":
          clearClasses("");
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

    applyTheme(storedTheme);
  }, []);

  return null;
}