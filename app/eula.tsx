'use client';
import { useState, useEffect } from "react";
import { Button, Main } from "@/cooperateDesign";
import { useTranslation } from "react-i18next";
import Infobox from './infoBox'; 


export default function EulaPrompt({ onAccept }: { onAccept: () => void }) {
  const [show, setShow] = useState(true);
  const [cookiesAccepted, setCookiesAccepted] = useState(true);
  const { t } = useTranslation();
  const [showDeclined, setShowDeclined] = useState(false); 
  const [errorMessage, setErrorMessage] = useState("");

  const handleShowDeclinedClose = () => {
    setShowDeclined(false);
    setErrorMessage("");
  }
  

  useEffect(() => {
    const eula = localStorage.getItem("eulaAccepted");
    const cookies = localStorage.getItem("cookiesAccepted");

    if (eula === "true" && cookies === "true") {
      setShow(false);
      onAccept();
    }

    document.body.style.overflow = show ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [onAccept, show]);

  const handleAccept = () => {
    if (!cookiesAccepted) {
      //alert(t("cookiesDeclined"));
      //setErrorMessage(t("cookiesDeclined"));
      //setShowDeclined(true);
      //return;
    }

    localStorage.setItem("eulaAccepted", "true");
    localStorage.setItem("cookiesAccepted", "true");
    setShow(false);
    onAccept();
  };

  const handleDecline = () => {
    //alert(t("eulaDeclined"));
    setErrorMessage(t("eulaDeclined"));
    setShowDeclined(true);
  };

  if (!show) return null;

  return (
    <Main>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-11/12 max-w-lg shadow-lg text-center max-h-[80vh] flex flex-col">
          <h2 className="text-xl font-bold mb-4">
            End User License Agreement
          </h2>

          <div className="text-sm mb-6 text-left overflow-y-auto flex-1 p-2 border border-gray-300 rounded-lg bg-white/90 dark:bg-gray-700/90">
            <p>{t("eulaWelcome")}</p>

            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>{t("eula1")}</li>
              <li>{t("eula2")}</li>
              <li>{t("eula3")}</li>
              <li>{t("eula4")}</li>
              <li>{t("eula5")}</li>
              <li>{t("eula6")}</li>
              <li>{t("eula7")}</li>
            </ol>

            <p className="mt-2">{t("eulaInfo")}</p>
          </div>

          <div className="flex items-center gap-2 my-4 text-sm">
            <input
              type="checkbox"
              checked={cookiesAccepted}
              onChange={(e) => setCookiesAccepted(e.target.checked)}
            />
            <span>{t("eulaCookiesConsent")}</span>
          </div>

          <div className="flex justify-around mt-auto">
            <Button variant="primary" onClick={handleAccept}>
              {t("accept")}
            </Button>
            <Button variant="danger" onClick={handleDecline}>
              {t("decline")}
            </Button>
          </div>
        </div>
      </div>
      {showDeclined && (
                <Infobox onClose={handleShowDeclinedClose} message={errorMessage} title='Fehler' color="red" />
            )}
    </Main>
  );
}
