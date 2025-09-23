import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface Team {
  id: number;
  name: string;
  cheatPoints: number;
}

interface Entry {
  player: string;
  value: number;
  team: Team;
  game: {
    id: number;
    tagged: string | null;
    points: { [key: string]: any }; // Example: { "slot1": 50, "slot2": 30 }
  };
}

interface Record {
  gameId: number;
  topPlayer: string | null;
  topPoints: number | null;
  topTeam: string | null;
  gamePoints: number | null;
}

export async function GET() {
  // Alle entries aus der Datenbank abrufen
  const entries = await prisma.entry.findMany({
    include: {
      game: {
        select: {
          id: true,
          tagged: true,
          points: true, // Die Punkte für das Spiel
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

  // Hilfsfunktionen für die Sortierung basierend auf "tagged"
  function getSortOrder(tagged: string): 'asc' | 'desc' {
    return tagged.includes('lowest') ? 'asc' : 'desc';
  }

  // Berechnung der besten Spieler und Teams
  const result: Record[] = [];

  for (const entry of entries) {
    const sortOrder = getSortOrder(entry.game.tagged || '');
    
    // Überprüfen, ob der Spieler "slot" enthält und das Team gültig ist
    if (entry.player.includes('slot') || entry.team.cheatPoints > 20 || entry.value <= 0) {
      continue; // Spieler überspringen, wenn "slot" oder ungültige Punkte
    }

    // Berechnen des besten Spielers basierend auf den `value` und `tagged`
    const sortedEntries = entries
      .filter((e) => e.game.id === entry.game.id)  // Filtere nach dem gleichen Spiel
      .sort((a, b) => {
        return sortOrder === 'asc' ? a.value - b.value : b.value - a.value;
      });

    // Bestimme den besten Spieler
    const topPlayer = sortedEntries[0];

    // Berechne die "gamePoints" basierend auf dem Slot
    const gamePoints = entry.game.points[`slot${entry.team.id}`] || null;

    // Speichern der berechneten Ergebnisse
    result.push({
      gameId: entry.game.id,
      topPlayer: topPlayer?.player || null,
      topPoints: topPlayer?.value || null,
      topTeam: topPlayer?.team.name || null,
      gamePoints,
    });
  }

  return NextResponse.json(result);
}
