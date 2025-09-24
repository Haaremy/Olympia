'use client'

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import '../../lib/i18n';
import { t } from "i18next";
import Image from "next/image";
import { detectPlatform } from "../common/detectPlatform";
import { Capacitor } from '@capacitor/core';





export default function Page() {
  const { i18n } = useTranslation();
  const [platform, setPlatform] = useState("");
    const [isApp, setIsApp] = useState(false);
  const [theme, setTheme] = useState();

  // Beim ersten Render den gespeicherten Wert aus localStorage holen
  useEffect(() => {
    
    // Sprache laden
    const savedLang = localStorage.getItem("language") || "en";
    i18n.changeLanguage(savedLang);
    detectPlatform().then(setPlatform);
    setIsApp(Capacitor.getPlatform() === 'android');

    setTheme(localStorage.getItem("theme") || "auto");
    
  }, [i18n]);

  

  const handleLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const theming = (theme: string) => {
  if (typeof window === "undefined") return; // SSR-Schutz
  setTheme(theme);
  const root = window.document.documentElement;

  // System-Design abfragen
  const sysDesign = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  // Theme speichern
  localStorage.setItem("theme", theme);

  // Theme anwenden
  if (theme !== "auto") {
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  } else {
    // Auto: Dark nur hinzufügen, wenn System dunkel ist
    if (sysDesign === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }
};


  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-start sm:p-6 p-4 pt-20 dark:bg-gray-900 transition-colors duration-300">
      
      {/* Einstellungen */}
      <div className="w-full max-w-3xl mt-8">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{t("browserSettings")}</h2>
        {/* Theme */}
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <Image
              src={`/images/globe.svg`}
              alt="Globe Icon"
              className="h-8 w-8 object-cover rounded-lg"
              width={50}
              height={50}
            />
            <select
              value={theme}
              onChange={(e) => theming(e.target.value)}
              className="flex-1 p-3 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="auto">Auto</option>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
        </div>
        {/* Sprache */}
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <Image
              src={`/images/globe.svg`}
              alt="Globe Icon"
              className="h-8 w-8 object-cover rounded-lg"
              width={50}
              height={50}
            />
            <select
              value={i18n.language}
              onChange={(e) => handleLanguage(e.target.value)}
              className="flex-1 p-3 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="en">English</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>
    </div>
 <div>
                 <h3 className={` mt-8 ${
                     platform === "Android" ? (isApp ? "hidden" : "block" ): "hidden"
                   }`}>Playstore Olympia App</h3>
                       <div
                   className={`w-full max-w-3xl mt-2 flex items-center justify-between p-4 border rounded-lg border-gray-300 dark:border-gray-600 transition bg-black ${
                     platform === "Android" ? (isApp ? "hidden" : "block" ): "hidden"
                   }`}
                 >
                   
                   {/* Linker Bereich mit Titel + Badge */}
                   <div className="flex flex-col  ">
                 
                     <a
                       href="https://play.google.com/store/apps/details?id=de.haaremy.olympia&pcampaignid=web_share"
                       target="_blank"
                       rel="noopener noreferrer"
                       className="mt-3 inline-flex items-center"
                     >
                       <Image
                         src={`/images/googlebadge.png`}
                         alt="Google Play Store Badge"
                         width={150}
                         height={60}
                         className="hover:scale-105 transition-transform"
                       />
                     </a>
                   </div>
                 
                   {/* Rechter Bereich mit App-Icon */}
                   <div className="flex-shrink-0 ml-4">
                     <Image
                       src={`/images/applogo.png`}
                       alt="Olympia App Icon"
                       width={80}
                       height={80}
                       className="rounded-lg shadow-md"
                     />
                   </div>
                 </div>
               </div>

      {/* Credits */}
      <div className="w-full max-w-3xl mt-8">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Credits</h2>
        <table className="w-full text-left text-sm text-gray-700 dark:text-gray-200 border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-3">Person</th>
              <th className="px-6 py-3">Social Media</th>
              <th className="px-6 py-3">Leistung</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-200 dark:border-gray-600">
              <td className="px-6 py-3 font-medium">Maite Dalchow</td>
              <td className="px-6 py-3">-</td>
              <td className="px-6 py-3">Design der Graphiken, Flyer, Hintergründe sowie Teil der Tutorial Produktion.</td>
            </tr>
            <tr className="border-t border-gray-200 dark:border-gray-600">
              <td className="px-6 py-3 font-medium">???</td>
              <td className="px-6 py-3">-</td>
              <td className="px-6 py-3"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Datenschutzerklärung */}
      <section className="w-full max-w-3xl mt-8 text-gray-800 dark:text-gray-200 space-y-4">
        <h2 className="text-lg font-semibold">Datenschutzhinweise</h2>

        <p>Ich freue mich über den Besuch auf meiner Website und das Interesse an der Teilnahme. Der Schutz der personenbezogenen Daten ist mir ein wichtiges Anliegen. Nachfolgend informieren ich ausführlich über den Umgang mit den Daten.</p>

        <h3 className="font-semibold">1. Verantwortlicher</h3>
        <p>Jeremy Becker<br/>haaremy@gmail.com<br/>+49 15730062682</p>

        <h3 className="font-semibold">2. Erhebung und Speicherung personenbezogener Daten</h3>
        <ul className="list-disc ml-5 space-y-1">
          <li>IP-Adresse: Herkunft der Anfrage</li>
          <li>Datum und Uhrzeit des Zugriffs: Angriffsschutz</li>
          <li>Verwendetes Betriebssystem: Anpassungen App</li>
          <li>Referrer-URL</li>
          <li>Standort: Karte in App</li>
          <li>NutzerID & Namen: Login und Funktionalität</li>
          <li>Passwort: verschlüsselt im Login</li>
          <li>Systemsprache und Design: Feature</li>
        </ul>
        <p>Diese Daten werden ausschließlich zur technischen Bereitstellung und Verbesserung der Website verarbeitet und nicht ohne Ihre Zustimmung mit Dritten geteilt.</p>

        <h3 className="font-semibold">3. Zweck der Datenverarbeitung</h3>
        <p>Ihre Daten werden verarbeitet, um Ihnen Informationen, Dienstleistungen oder Produkte bereitzustellen.</p>

        <h3 className="font-semibold">4. Rechtsgrundlagen</h3>
        <p>Die Verarbeitung Ihrer Daten erfolgt auf Basis der Datenschutz-Grundverordnung (DSGVO), insbesondere Art. 6 Abs. 1 lit. a, b, f.</p>

        <h3 className="font-semibold">5. Weitergabe an Dritte</h3>
        <p>Eine Weitergabe Ihrer personenbezogenen Daten an Dritte erfolgt nur zur Erfüllung vertraglicher Pflichten, auf gesetzlicher Grundlage oder mit Ihrer ausdrücklichen Einwilligung.</p>

        <h3 className="font-semibold">6. Cookies</h3>
        <p>Unsere Website verwendet Cookies, um die Benutzerfreundlichkeit zu verbessern. Sie können die Speicherung von Cookies über Ihre Browser-Einstellungen verhindern. Einige Funktionen der Website könnten dann eingeschränkt sein.</p>

        <h3 className="font-semibold">7. Ihre Rechte</h3>
        <p>Sie haben das Recht, jederzeit Auskunft über Ihre gespeicherten Daten zu erhalten sowie Berichtigung oder Löschung zu verlangen.</p>

        <h3 className="font-semibold">8. Datensicherheit</h3>
        <p>Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein, um Ihre Daten gegen unbefugten Zugriff, Verlust oder Manipulation zu schützen.</p>

        <h3 className="font-semibold">9. Änderungen dieser Datenschutzerklärung</h3>
        <p>Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen. Die jeweils aktuelle Version ist auf unserer Website verfügbar.</p>
      </section>

    </main>
  );
}
