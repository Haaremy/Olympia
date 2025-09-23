import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Typen für die Rückgabe
interface Team {
  id: number;
  name: string;
  cheatPoints: number;
}

interface Record {
  gameId: number;
  language: string | null;
  tagged: string | '';
  topPlayer: string | null;
  topPoints: number | null;
  topEntries: number | null;
  team: Team | null;
}


export async function GET() {
  // Alle Spiele aus der Datenbank abrufen
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

  // Hilfsfunktionen für tagged und Top-Player
  function parseTagged(tagged: string): { order: 'asc' | 'desc'; field: 'field1' | 'field2' | 'field3' } {
    const order: 'asc' | 'desc' = tagged.includes('lowest') ? 'asc' : 'desc';
    let field: 'field1' | 'field2' | 'field3' = 'field1'; // Default

    if (tagged.includes('field1')) field = 'field1';
    else if (tagged.includes('field2')) field = 'field2';
    else if (tagged.includes('field3')) field = 'field3';

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

  // Hauptlogik für das Filtern und Berechnen der Ergebnisse
 const result: Record[] = games.map((game) => {
  const { order, field } = parseTagged(game.tagged || '');

  // Funktion zum Bestimmen des Werts
  const getValue = (item: typeof game.points[0]): string | number => {
    switch (field) {
      case 'field1':
        return item.player;
      case 'field2':
        return item.value;
      case 'field3':
        return item.team.name;
      default:
        return ''; // Fallback
    }
  };

  // Top-Spieler bestimmen
  const topP = getTopPlayer(game.points, { order, getValue });

  // Passende Entry finden, das zur besten Team passt
  const matchingEntry = game.entries.find(
    (e) => e.team.id === topP?.team.id && e.value > 0 // value muss > 0 sein
  );

  // Die Resultate für das aktuelle Spiel zusammenstellen
  return {
    gameId: game.id,
    language: game.tagged || "", // Falls tagged null ist, setze es auf ""
    tagged: game.tagged,
    topPlayer: topP?.player || null,
    topPoints: topP?.value || null,
    topEntries: matchingEntry?.value || null,
    team: topP?.team
      ? {
          id: topP.team.id,
          name: topP.team.name,
          cheatPoints: topP.team.cheatPoints,
        }
      : null,
  };
});


  // Filter nach den Ausschlusskriterien
  const filteredResult = result.filter((item) => {
    // Spielername darf nicht "slot" enthalten
    // Team darf keine cheatPoints > 20 haben
    // Points/Entries müssen einen Wert > 0 haben
    return !item.entries.some((entry) => {
      return (
        entry.player.includes('slot') || // Spielername enthält "slot"
        entry.team.cheatPoints > 20 ||    // cheatPoints des Teams > 20
        entry.value <= 0                  // entry value <= 0
      );
    }) && !item.points.some((point) => {
      return (
        point.player.includes('slot') || // Spielername enthält "slot"
        point.team.cheatPoints > 20 ||    // cheatPoints des Teams > 20
        point.value <= 0                  // point value <= 0
      );
    });
  });

  // Rückgabe der gefilterten Resultate
  return NextResponse.json(filteredResult);
}
