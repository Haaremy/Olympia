import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

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
    languages: {
      title: string;  // Ensure we are fetching the 'title' from the 'languages' relation
    }[];
    tagged: string | null;
    points: GamePoint[];
  };
}

interface RecordResult {
  gameId: number;
  gameName: string;
  topPlayer: string | null;
  topPoints: number | null;
  topTeam: string | null;
  gamePoints: number | null;
}

export async function GET() {
  const entries = await prisma.entries.findMany({
    include: {
      game: {
        select: {
          id: true,
          tagged: true,
          points: true,  
        },
        include: {
          languages: {
            select: {
              title: true,  // Fetch the 'title' field
            },
          },
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

  // Ensure tagged is never undefined or null by defaulting it to an empty string
  const processedEntries = entries.map(entry => ({
    ...entry,
    game: {
      ...entry.game,
      tagged: entry.game.tagged || '',  // Default to empty string if tagged is undefined or null
    },
  }));

  // Helper function for sorting by 'tagged'
  function getSortOrder(tagged: string): 'asc' | 'desc' {
    return tagged.includes('lowest') ? 'asc' : 'desc';
  }

  const result: RecordResult[] = [];

  const groupedByGame = processedEntries.reduce((acc, entry) => {
    const gameId = entry.game.id;
    if (!acc[gameId]) {
      acc[gameId] = [];
    }
    acc[gameId].push(entry);
    return acc;
  }, {} as Record<string, Entry[]>);

  for (const gameId in groupedByGame) {
    const gameEntries = groupedByGame[gameId];
    const firstEntry = gameEntries[0];
    const sortOrder = getSortOrder(firstEntry.game.tagged || "");

    const validEntries = gameEntries.filter(
      (entry) =>
        !entry.player.includes('slot') && entry.team.cheatPoints <= 20 && entry.value > 0
    );

    if (validEntries.length === 0) continue;

    const sortedEntries = validEntries.sort((a, b) => {
      return sortOrder === 'asc' ? a.value - b.value : b.value - a.value;
    });

    const topPlayer = sortedEntries[0];

    const gamePoint = firstEntry.game.points.find((point) => point.slot === topPlayer.team.id);
    const gamePoints = gamePoint ? gamePoint.value : null;

    result.push({
      gameId: Number(gameId),
      gameName: firstEntry.game.languages[0]?.title || "",  // Ensure we are fetching the title correctly
      topPlayer: topPlayer?.player || null,
      topPoints: topPlayer?.value || null,
      topTeam: topPlayer?.team.name || null,  // Correctly include 'topTeam'
      gamePoints,
    });
  }

  return NextResponse.json(result);
}
