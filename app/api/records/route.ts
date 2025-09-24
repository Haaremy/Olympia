

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Defining the types for Team, Entry, GamePoint, and RecordResult
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
    languages: { title: string }[];  // Change from a single object to an array of objects
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
  tagged: string | null;
  gamePoints: number | null;
}

// Main function for fetching and processing the data
export async function GET() {
  // Fetch all entries from the database
const entries = await prisma.entries.findMany({
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
    game: {
      select: {
        id: true,
        tagged: true,
        points: true,
        languages: {
          select: {
            title: true,  // Selecting the title field in the languages relation
          },
        },
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

  // Calculate the best players and teams
  const result: RecordResult[] = [];

  // Group entries by gameId
  const groupedByGame = processedEntries.reduce((acc, entry) => {
    const gameId = entry.game.id;
    if (!acc[gameId]) {
      acc[gameId] = [];
    }
    acc[gameId].push(entry);
    return acc;
  }, {} as Record<string, Entry[]>);

  // Iterate through each game
  for (const gameId in groupedByGame) {
    const gameEntries = groupedByGame[gameId];
    const firstEntry = gameEntries[0];
    const sortOrder = getSortOrder(firstEntry.game.tagged || "");

    // Filter valid entries (no 'slot' players, team points <= 20, value > 0)
    const validEntries = gameEntries.filter(
      (entry) =>
        !entry.player.includes('slot') && entry.team.cheatPoints <= 20 && entry.value > 0
    );

    // If no valid entries, skip
    if (validEntries.length === 0) continue;

    // Sort valid entries by value
    const sortedEntries = validEntries.sort((a, b) => {
      return sortOrder === 'asc' ? a.value - b.value : b.value - a.value;
    });

    // Get the best player
    const topPlayer = sortedEntries[0];

    // Calculate the "gamePoints" based on the slot
    const gamePoint = firstEntry.game.points.find((point) => point.slot === topPlayer.team.id);
    const gamePoints = gamePoint ? gamePoint.value : null;

    // Store the calculated results
    result.push({
      gameId: Number(gameId),
      gameName: firstEntry.game.languages.map(lang => lang.title).join(", "),  // Join all titles
      tagged: firstEntry.game.tagged,
      topPlayer: topPlayer?.player || null,
      topPoints: topPlayer?.value || null,
      topTeam: topPlayer?.team.name || null,
      gamePoints,
    });
  }

  return NextResponse.json(result);
}
