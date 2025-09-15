// /app/404/page.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Oops! Diese Seite wurde nicht gefunden.</p>
      <Link
        href="/"
        className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
      >
        Zur Startseite
      </Link>
    </main>
  );
}
