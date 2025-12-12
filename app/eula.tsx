'use client';
import { useState, useEffect } from "react";
import { Button, Main } from "@/cooperateDesign";

export default function EulaPrompt({ onAccept }: { onAccept: () => void }) {
  const [show, setShow] = useState(true);
  const [cookiesAccepted, setCookiesAccepted] = useState(true);

  useEffect(() => {
    const eula = localStorage.getItem("eulaAccepted");
    const cookies = localStorage.getItem("cookiesAccepted");
    if (eula === "true" && cookies === "true") {
      setShow(false);
      onAccept();
    }

    if (show) {
      // Hintergrund scrollen verhindern
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto"; // cleanup
    };
  }, [onAccept, show]);

  const handleAccept = () => {
    if (!cookiesAccepted) {
      alert("Bitte stimme den Cookies zu, um fortzufahren.");
      return;
    }
    localStorage.setItem("eulaAccepted", "true");
    localStorage.setItem("cookiesAccepted", "true");
    setShow(false);
    onAccept();
  };

  const handleDecline = () => {
    alert("Du musst die EULA akzeptieren, um die App zu nutzen.");
  };

  if (!show) return null;

  return (
    <Main>
      {/* Dunkler, transparenter, blurry Hintergrund */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-11/12 max-w-lg shadow-lg text-center max-h-[80vh] flex flex-col">
          <h2 className="text-xl font-bold mb-4">End User License Agreement</h2>

          {/* Scrollbares Feld */}
          <div className="text-sm mb-6 text-left overflow-y-auto flex-1 p-2 border border-gray-300 rounded-lg bg-white/90 dark:bg-gray-700/90">
            <p>Willkommen zur Olympia App! Mit der Nutzung dieser Anwendung akzeptierst du die folgenden Bedingungen:</p>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Du wirst die App nicht missbräuchlich verwenden.</li>
              <li>Inhalte dürfen nicht beleidigend, diskriminierend oder illegal sein.</li>
              <li>Die App kann notwendige Cookies verwenden, um deine Einstellungen und Präferenzen zu speichern.</li>
              <li>Daten werden gemäß unserer Datenschutzrichtlinie verarbeitet.</li>
              <li>Die Weitergabe von Login-Daten an Dritte ist nicht erlaubt.</li>
              <li>Du kannst deine Zustimmung jederzeit in den Einstellungen widerrufen.</li>
              <li>Die Erstellung von Benutzer-Conent, welche für andere Nutzer sichtbar ist, darf keine anstößigen Inhalte darstellen. Widerleistung führt zu sofortigem Ausschluss.</li>
            </ol>
            <p className="mt-2">Diese Lizenzvereinbarung tritt sofort nach Annahme in Kraft. Bitte lese sie sorgfältig durch.</p>
          </div>

          {/* Cookie Toggle */}
          <div className="flex items-center justify-start gap-2 my-4">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={cookiesAccepted}
                onChange={(e) => setCookiesAccepted(e.target.checked)}
              />
              Ich stimme zusätzlich der Verwendung von sonstigen Cookies zu.
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-around mt-auto">
            <Button
              variant="primary"
              onClick={handleAccept}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Akzeptieren
            </Button>
            <Button
              variant="danger"
              onClick={handleDecline}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Ablehnen
            </Button>
          </div>
        </div>
      </div>
    </Main>
  );
}
