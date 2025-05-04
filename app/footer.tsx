"use client"; // Mark this file as a Client Component
import Link from "next/link";
import { useTranslation } from 'next-i18next';
import '../lib/i18n'

export default function Footer() {
  const { t } = useTranslation();  // Hook innerhalb der Komponente verwenden

  return (
    <footer className="bottom-0 left-0 w-full bg-white dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 shadow-md z-50">
      {/* Footer Section */}
      <div className="flex flex-col sm:flex-row items-center justify-center p-4 space-y-4 sm:space-y-0 sm:space-x-8">
        {/* Link 1 */}
        <Link href="/" className="flex items-center text-gray-800 dark:text-gray-200">
          <p className="text-lg font-semibold">
            {t('fsr_long')} -{" "}
            <span className="font-mono font-bold text-pink-500 dark:text-pink-400">
              Ad-Games-{t("calender")}
            </span>
          </p>
        </Link>

        {/* Spacer */}
        <div className="sm:hidden" />

        {/* Link 2 */}
        <Link href="https://instagram.com/haaremy" className="flex items-center text-gray-800 dark:text-gray-200">
          <p className="font-mono font-bold">
            <span className="text-lg font-semibold text-white-500 dark:text-white-400">{t("author")} </span>
            <span className="text-lg font-semibold text-pink-500 dark:text-pink-400">@Haaremy</span>
          </p>
        </Link>
      </div>
    </footer>
  );
}
