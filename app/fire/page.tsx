"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Fire from "./Fire";
import { Main } from "@cooperateDesign";

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

  const formatLocalDateTime = (date: string | Date) => {
    const d = new Date(date);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };
  const toISO = (local: string) => new Date(local).toISOString();

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
        const data: Settings = await res.json();
        if (data.ending) setEnding(formatLocalDateTime(data.ending));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [status, session, router]);

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
      alert("Das Feuer konnte nicht entzündet werden.");
    }
  };

  if (loading) {
    return (
      <Main className="items-center">
        <p>Lade Daten...</p>
      </Main>
    );
  }

  return (
    <Main
      className="
        flex flex-col items-center justify-start pt-10 
        bg-center bg-no-repeat overflow-hidden
      "
      style={{
        backgroundImage: "url('/images/building/buildingnew3.png')",
        backgroundSize: "cover", // WICHTIG: kein contain!
      }}
    >

      {/* ---------- FIRE STAGE ---------- */}
<div
  className="
    relative 
    flex flex-col items-center justify-end
    w-full 
    max-w-[900px]
    h-[65vh]
    aspect-[3/2]
    pb-10                /* Schale weiter nach unten */
  "
>
  {/* Flame — exakt über der Mitte der Schale */}
  {fireOn && (
    <div
      className="
        absolute 
        z-40 
        translate-x-[-50px]
        bottom-[30%]       /* exakte Flammenhöhe relativ zur Schale */
        scale-[300%]
      "
    >
      <Fire />
    </div>
  )}

  {/* Firepit — korrekt zentriert */}
  <div
    onClick={igniteFire}
    className="cursor-pointer z-50 flex justify-center items-center translate-y-[200px] scale-150"
  >
    <Image
      alt="Firepit"
      width={1500}
      height={1500}
      src="/images/pit.png"
      className="object-contain w-[50%] h-auto mx-auto"
      priority
    />
  </div>

  {/* Glow */}
  {fireOn && (
    <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,200,255,0.2)_0%,transparent_70%)] animate-pulse blur-2xl" />
    </div>
  )}
</div>

    </Main>
  );
}
