"use client"; // Mark this file as a Client Component
import Link from "next/link";
import { useTranslation } from 'next-i18next';
import '../lib/i18n'

export default function Footer() {
  const { t } = useTranslation();  // Hook innerhalb der Komponente verwenden

  return (
    <footer className=`
    bottom-0 left-0 w-full border-t shadow-md z-50
    bg-white border-gray-300  
    dark:bg-gray-800 dark:border-gray-700
    truedark:bg-black truedark:border-white
    `>
      {/* Footer Section */}
      <div className="flex flex-col sm:flex-row items-center justify-center p-4 space-y-4 sm:space-y-0 sm:space-x-8">
        {/* Link 1 */}
        <Link href="/" className="flex items-center text-gray-800 dark:text-gray-200">
          <p className="text-lg font-semibold">
            {t('fsr_long')} -{" "}
            <span className="font-mono font-bold text-blue-400 dark:text-pink-500">
              AdGames{t("calender")}
            </span>
          </p>
        </Link>

        {/* Spacer */}
        <div className="sm:hidden" />
        <div className="inline-flex">
          {/* Link 2 */}
          <Link href="https://instagram.com/haaremy" className="flex items-center text-gray-800 dark:text-gray-200 mr-8">
            <p className="font-mono font-bold">
              <span className="text-md font-semibold text-white-500 dark:text-white-400">{t("author")} </span>
              <span className="text-lg font-semibold text-blue-400 dark:text-pink-500">@Haaremy  </span>
            </p>
          </Link>

          {/* Link 2 */}
          <Link href="/credits" className="flex items-center text-gray-800 dark:text-gray-200">
            <p className="font-mono font-bold">
              <span className="text-md font-semibold text-white-500 dark:text-white-400">⚙️</span>
            </p>
          </Link>
        </div>
      </div>
    </footer>
  );
}
