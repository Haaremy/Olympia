import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET-Handler für Weltrekorde
export async function GET() {
  try {
    // Alle Spiele und die höchsten Punktwerte je Spiel holen
    const records = await prisma.game.findMany({
      include: {
        points: {
          select: {
            teamId: true,
            value: true,
            team: { // Hier das Team einbeziehen
              select: {
                name: true, // Teamname holen
              },
            },
          },
        },
      },
    });

    // Sicherstellen, dass records ein Array ist und auch Punkte vorhanden sind
    if (!Array.isArray(records)) {
      return NextResponse.json({ error: "Keine Spiele gefunden." }, { status: 404 });
    }

    // Verarbeitung, um den besten Punktwert je Spiel zu finden
    const topRecords = records.map((game) => {
      if (!game.points || game.points.length === 0) {
        return {
          gameId: game.id,
          gameUrl: game.url,
          topPlayer: "Kein Team",
          maxPoints: 0,
        };
      }

      let bestPoint;

      // Beispiel für verschiedene Bedingungen pro Spiel
      if (game.id === 5) {
        // Für Spiel mit ID 5 den Wert, der am nächsten an 100 liegt
        const targetValue = 100;
        bestPoint = game.points.reduce((prev, current) => {
          return Math.abs(current.value - targetValue) < Math.abs(prev.value - targetValue) ? current : prev;
        }, game.points[0]);
      } else {
        // Für alle anderen Spiele den höchsten Punktwert
        bestPoint = game.points.reduce((prev, current) => {
          return prev.value > current.value ? prev : current;
        }, game.points[0]);
      }

      return {
        gameId: game.id,
        gameUrl: game.url,
        topPlayer: bestPoint.team?.name || "Unbekannt",
        maxPoints: bestPoint.value,
      };
    });

    return NextResponse.json(topRecords);
  } catch (error) {
    console.error("Fehler beim Abrufen der Weltrekorde: ", error);
    return NextResponse.json({ error: "Es gab ein Problem beim Abrufen der Daten." }, { status: 500 });
  }
}
