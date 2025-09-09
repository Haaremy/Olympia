"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Fire from "./Fire";

type Settings = {
  started: boolean;
  ending: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [ending, setEnding] = useState("");
  const [fireStarted, setFireStarted] = useState(false);

  const getOffsetISO = (dtLocal: string): string => {
    const date = new Date(dtLocal);
    return date.toISOString();
  };

  const toDateTimeLocalString = (dateString: string | Date): string => {
    const date = new Date(dateString);
    const pad = (num: number) => num.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/");
    else if (session.user?.role !== "ADMIN") {
      router.push(session.user.role === "USER" ? "/teampage" : "/");
    }

    fetch("/api/settings")
      .then((res) => {
        if (!res.ok) throw new Error("Fehler beim Laden der Einstellungen");
        return res.json();
      })
      .then((data: Settings) => {
        if (data.ending) setEnding(toDateTimeLocalString(data.ending));
      })
      .catch(console.error);
  }, [session, status, router]);

  const handleFire = async () => {
    const started = true;
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ started, ending: getOffsetISO(ending) }),
      });
      if (!res.ok) throw new Error("Fehler beim Speichern");
    } catch (err) {
      console.error(err);
    }
    setFireStarted(true);
  };

  if (!session) return <div>Loading...</div>;

  return (
    <main className="w-full flex flex-col items-center min-h-screen p-6 bg-gray-900 text-white justify-center">
      <div className={`page-container ${fireStarted ? "fire-on" : "fire-off"}`}>
        {/* Fire Animation */}
        <div className="fire-placeholder">{fireStarted && <Fire />}</div>

        {/* Firepit Image */}
        <div className="absolute bottom-0 max-w-[500px]">
          <Image
            alt="Firepit"
            onClick={handleFire}
            width={500}
            height={240}
            src="/images/pit.png"
            className="firepit-image object-cover"
          />
        </div>
      </div>
    </main>
  );
}
