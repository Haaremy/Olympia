import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Definieren der Typen für Team, Entry, GamePoint und RecordResult
interface Team {
  id: number;
  name: string;
  cheatPoints: number;
}

interface GamePoint {
  id: number;
  gameId: number;
  teamId: number;
  player: string;
  value: number;
  slot: number;
  lastUpdated: Date;
}

interface Entry {
  player: string;
  value: number;
  team: Team;
  game: {
    id: number;
    tagged: string | null;
    points: GamePoint[]; // Array von GamePoint-Objekten
  };
}

interface RecordResult {
  gameId: number;
  topPlayer: string | null;
  topPoints: number | null;
  topTeam: string | null;
  gamePoints: number | null;
}

// Hauptfunktion für das Abrufen und Verarbeiten der Daten
export async function GET() {
  // Alle entries aus der Datenbank abrufen
  const entries = await prisma.entries.findMany({
    include: {
      game: {
        select: {
          id: true,
          tagged: true,
          points: true, // Punkte für das Spiel
        },
      },
      team: {
        select: {
          id: true,
          name: true,
          cheatPoints: true,
        },
      },
    },
  });

  // Hilfsfunktionen für das Sortieren nach 'tagged'
  function getSortOrder(tagged: string | null | undefined): 'asc' | 'desc' {
    // Check if tagged is valid before calling .includes()
    return tagged && tagged.includes('lowest') ? 'asc' : 'desc';
  }

  // Berechnung der besten Spieler und Teams
  const result: RecordResult[] = [];

  // Gruppierung der entries nach gameId
  const groupedByGame = entries.reduce((acc, entry) => {
    const gameId = entry.game.id;
    if (!acc[gameId]) {
      acc[gameId] = [];
    }
    acc[gameId].push(entry);
    return acc;
  }, {} as Record<string, Entry[]>);

  // Iteration durch jedes Spiel
  for (const gameId in groupedByGame) {
    const gameEntries = groupedByGame[gameId];
    const firstEntry = gameEntries[0];
    const sortOrder = getSortOrder(firstEntry.game.tagged || '');

    // Filter für gültige Einträge (keine 'slot'-Spieler, Team-Punkte <= 20, value > 0)
    const validEntries = gameEntries.filter(
      (entry) =>
        !entry.player.includes('slot') && entry.team.cheatPoints <= 20 && entry.value > 0
    );

    // Falls es keine gültigen Einträge gibt, überspringen
    if (validEntries.length === 0) continue;

    // Sortieren der gültigen Einträge nach value
    const sortedEntries = validEntries.sort((a, b) => {
      return sortOrder === 'asc' ? a.value - b.value : b.value - a.value;
    });

    // Bestimmen des besten Spielers
    const topPlayer = sortedEntries[0];

    // Berechnen der "gamePoints" basierend auf dem Slot
    const gamePoint = firstEntry.game.points.find((point) => point.slot === topPlayer.team.id);
    const gamePoints = gamePoint ? gamePoint.value : null;

    // Speichern der berechneten Ergebnisse
    result.push({
      gameId: Number(gameId),
      topPlayer: topPlayer?.player || null,
      topPoints: topPlayer?.value || null,
      topTeam: topPlayer?.team.name || null,
      gamePoints,
    });
  }

  return NextResponse.json(result);
}
