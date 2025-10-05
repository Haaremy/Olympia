"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Fire from "./Fire";
import { Button } from "@/cooperateDesign";

type Settings = {
  started: boolean;
  ending: string;
};

export default function FirePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ending, setEnding] = useState("");
  const [fireOn, setFireOn] = useState(false);
  const [loading, setLoading] = useState(true);

  /** --- Utility Helpers --- */
  const formatLocalDateTime = (date: string | Date) => {
    const d = new Date(date);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };
  const toISO = (local: string) => new Date(local).toISOString();

  /** --- Access Control & Settings Load --- */
  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/");
      return;
    }

    if (session.user.role !== "ADMIN") {
      router.push(session.user.role === "USER" ? "/teampage" : "/");
      return;
    }

    (async () => {
      try {
        const res = await fetch("/api/settings");
        if (!res.ok) throw new Error("Failed to load settings");
        const data: Settings = await res.json();
        if (data.ending) setEnding(formatLocalDateTime(data.ending));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [session, status, router]);

  /** --- Fire trigger --- */
  const igniteFire = async () => {
    if (!ending) return;
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ started: true, ending: toISO(ending) }),
      });
      if (!res.ok) throw new Error("Fehler beim Starten des Feuers");
      setFireOn(true);
    } catch (e) {
      console.error(e);
      alert("Das Feuer konnte nicht entzündet werden.");
    }
  };

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-200">
        <p>Lade Daten...</p>
      </main>
    );
  }

  return (
<main
  className="relative flex flex-col items-center justify-center min-h-screen text-white overflow-hidden
             bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: "url('/images/building.jpg')" }}
>      {/* Header */}
      <h1 className="text-3xl md:text-5xl font-bold mb-6 text-center tracking-wide">
        Olympisches Feuer
      </h1>


      {/* Fire Area */}
      <div className="relative flex flex-col items-center justify-end w-full max-w-md h-[400px]">
        {/* Animated Fire */}
        {fireOn && (
          <div className="absolute bottom-32">
            <Fire />
          </div>
        )}

        {/* Firepit Image */}
        <div
          onClick={igniteFire}
          className="cursor-pointer transition-transform z-50"
        >
          <Image
            alt="Firepit"
            width={500}
            height={500}
            src="/images/pit.png"
            className="object-contain"
          />
        </div>

      </div>

      {/* Subtle glow overlay */}
      {fireOn && (
        <div className="absolute inset-0 pointer-events-none flex justify-center items-end">
  {/* Blaue Lichtstrahlen */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,200,255,0.2)_0%,transparent_70%)] animate-pulse blur-2xl" />
</div>

      )}
    </main>
  );
}
