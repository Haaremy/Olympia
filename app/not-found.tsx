// /app/404/page.tsx
import Link from "next/link";
import {Main} from "@cooperateDesign";

export default function NotFound() {
  return (
    <Main className="justify-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Oops! Diese Seite wurde nicht gefunden.</p>
      <Link
        href="/"
        className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
      >
        Zur Startseite
      </Link>
    </Main>
  );
}
