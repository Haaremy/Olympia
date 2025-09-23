import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  // Holen der Spiele mit den relevanten Daten
  const games = await prisma.game.findMany({
    select: {
      id: true,
      tagged: true, // ✅ Das Feld, das sonst fehlt
      entries: {
        select: {
          player: true,
          value: true,
          team: {
            select: {
              id: true,
              name: true,
              cheatPoints: true, // Hinzufügen von cheatPoints zu den Teams
            },
          },
        },
      },
      points: {
        select: {
          player: true,
          value: true,
          team: {
            select: {
              id: true,
              name: true,
              cheatPoints: true, // Hier auch cheatPoints für Punkte
            },
          },
        },
      },
    },
  });

  // Typdefinition
  type GameWithPointsAndTeam = {
    id: number;
    tagged: string | null;
    entries: {
      player: string;
      value: number;
      team: {
        id: number;
        name: string;
        cheatPoints: number;
      };
    }[];
    points: {
      player: string;
      value: number;
      team: {
        id: number;
        name: string;
        cheatPoints: number;
      };
    }[];
  };

  // Spielverarbeitung
  const result = games.map((game: GameWithPointsAndTeam) => {
    const { order, field } = parseTagged(game.tagged || "");

    const getValue = (item: typeof game.points[0]): string | number => {
      switch (field) {
        case "field1":
          return item.player;
        case "field2":
          return item.value;
        case "field3":
          return item.team.name;
        default:
          return ""; // Fallback
      }
    };

    const topP = getTopPlayer(game.points, { order, getValue });

    const matchingEntry = game.entries.find((e) => e.team.id === topP?.team.id);

    return {
      gameId: game.id,
      topPlayer: topP?.player || null,
      topPoints: topP?.value || null,
      topEntries: matchingEntry?.value || null,
      tagged: game.tagged,
      team: topP?.team
        ? {
            id: topP.team.id,
            name: topP.team.name,
            cheatPoints: topP.team.cheatPoints,
          }
        : null,
      entries: game.entries, // Alle Entries für den Spieler-Filter
    };
  });

  // Filtere die Ergebnisse nach den angegebenen Kriterien
  const filteredResult = result.filter((item) => {
    // Überprüfe alle Entries und Punkte auf die Filterbedingungen
    return !item.entries.some((entry) => {
      // Prüfe, ob der Spielername "slot" enthält, cheatPoints > 20 und Punkte <= 0
      if (
        entry.player.includes('slot') && // Prüft, ob der Spielername "slot" enthält
        entry.team.cheatPoints > 20 && // Prüft, ob das Team cheatPoints > 20 hat
        entry.value <= 0 // Prüft, ob der Spielerwert <= 0 ist
      ) {
        return true; // Das Spiel wird gefiltert, wenn eine Bedingung zutrifft
      }
      return false;
    });
  });

  return NextResponse.json(filteredResult);
}

// Hilfsfunktionen
function parseTagged(tagged: string): { order: 'asc' | 'desc'; field: 'field1' | 'field2' | 'field3' } {
  const order: 'asc' | 'desc' = tagged.includes("lowest") ? "asc" : "desc";

  let field: 'field1' | 'field2' | 'field3' = 'field1'; // Default

  if (tagged.includes("field1")) field = 'field1';
  else if (tagged.includes("field2")) field = 'field2';
  else if (tagged.includes("field3")) field = 'field3';

  return { order, field };
}

function getTopPlayer<T>(
  items: T[],
  options: { order: 'asc' | 'desc'; getValue: (item: T) => string | number }
): T | null {
  const { order, getValue } = options;

  if (!items.length) return null;

  const sorted = items.slice().sort((a, b) => {
    const aValue = getValue(a);
    const bValue = getValue(b);

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return order === 'asc' ? aValue - bValue : bValue - aValue;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }

    return 0;
  });

  return sorted[0];
}
