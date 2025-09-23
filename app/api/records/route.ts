import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const games = await prisma.game.findMany({
    select: {
      id: true,
      tagged: true,
      entries: {
        select: {
          player: true,
          value: true,
          team: {
            select: {
              id: true,
              name: true,
              cheatPoints: true,
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
              cheatPoints: true,
            },
          },
        },
      },
    },
  });

  // Typdefinition für die Spiele mit den relevanten Daten
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
      points: game.points,   // Alle Points für den Spieler-Filter
    };
  });

  // Filtere nach den Bedingungen
  const filteredResult = result.filter((item) => {
    // Überprüfe alle Entries und Points, ob sie die Bedingungen erfüllen:
    // - Spielername enthält "slot"
    // - cheatPoints des Teams sind > 20
    // - Der Wert (value) in entries oder points ist <= 0
    return !item.entries.some((entry) => {
      return (
        entry.player.includes('slot') && // Spielername enthält "slot"
        entry.team.cheatPoints > 20 &&    // cheatPoints des Teams > 20
        entry.value <= 0                  // entry value <= 0
      );
    }) && !item.points.some((point) => {
      return (
        point.player.includes('slot') && // Spielername enthält "slot"
        point.team.cheatPoints > 20 &&    // cheatPoints des Teams > 20
        point.value <= 0                  // point value <= 0
      );
    });
  });

  return NextResponse.json(filteredResult);
}

// Hilfsfunktionen für tagged
function parseTagged(tagged: string): { order: 'asc' | 'desc'; field: 'field1' | 'field2' | 'field3' } {
  const order: 'asc' | 'desc' = tagged.includes("lowest") ? "asc" : "desc";

  let field: 'field1' | 'field2' | 'field3' = 'field1'; // Default

  if (tagged.includes("field1")) field = 'field1';
  else if (tagged.includes("field2")) field = 'field2';
  else if (tagged.includes("field3")) field = 'field3';

  return { order, field };
}

// Top-Player-Berechnung
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
