import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importiere deine Sprachdateien (z.B. 'en.json' und 'de.json')
import en from '../locales/en/common.json';
import de from '../locales/de/common.json';

i18n
  .use(initReactI18next) // Passiert `i18next` an React weiter
  .init({
    resources: {
      en: {
        translation: en,
      },
      de: {
        translation: de,
      },
    },
    lng: 'de', // Standard-Sprache
    fallbackLng: 'de', // Falls keine Übersetzung vorhanden ist
    interpolation: {
      escapeValue: false, // Verhindert HTML-Encoding
    },
  });

export default i18n;
