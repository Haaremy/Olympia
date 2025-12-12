import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Slot } from '@prisma/client';

interface Team {
  id: number;
  name: string;
  cheatPoints: number;
  user1: string;
  user2: string;
  user3?: string | null;
  user4?: string | null;
}

interface Entry {
  slot: Slot;
  value: number;
  team: Team;
  game: {
    id: number;
    gameDetails: { title: string }[];
    tagged: string | null;
    points: { value: number; slot: Slot }[];
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
  team: Team;
}

export async function GET() {
  const entries = await prisma.entries.findMany({
  where: {
    value: {
      notIn: [9999, 0],
    },
    game: {
      NOT: {
        OR: [
          {
            tagged: {
              contains: 'hidden',
            },
          },
          {
            tagged: {
              contains: 'noRecord',
            },
          },
          {
            points:{
              every: { value: 0 },
            }
          },
        ],
      },
    },
  },
  select: {
    slot: true,
    value: true,
    team: {
      select: {
        id: true,
        name: true,
        cheatPoints: true,
        user1: true,
        user2: true,
        user3: true,
        user4: true,
      },
    },
    game: {
      select: {
        id: true,
        tagged: true,
        points: { select: { value: true, slot: true } },
        gameDetails: { select: { title: true } },
      },
    },
  },
});


  // Map optional tagged
  const processedEntries = entries.map((entry) => ({
    ...entry,
    game: { ...entry.game, tagged: entry.game.tagged || '' },
  }));

  const result: RecordResult[] = [];

  // Group by game
  const groupedByGame = processedEntries.reduce((acc, entry) => {
    const gid = entry.game.id;
    if (!acc[gid]) acc[gid] = [];
    acc[gid].push(entry);
    return acc;
  }, {} as Record<number, Entry[]>);

  for (const gid in groupedByGame) {
    const gameEntries = groupedByGame[gid];

    // Filter valid entries
    const validEntries = gameEntries.filter(
      (entry) => entry.value > 0 && entry.team.cheatPoints < 12
    );
    if (!validEntries.length) continue;

    // Sort by value descending
    const sorted = validEntries.sort((a, b) => b.value - a.value);
    const topEntry = sorted[0];

    // Map slot to player name
    const slotMap: Record<Slot, string> = {
      USER1: topEntry.team.user1,
      USER2: topEntry.team.user2,
      USER3: topEntry.team.user3 ?? '',
      USER4: topEntry.team.user4 ?? '',
    };
    const topPlayer = slotMap[topEntry.slot];

    // Get gamePoints for the top slot
    const gamePoints =
      topEntry.game.points.find((p) => p.slot === topEntry.slot)?.value ?? null;

    result.push({
      gameId: Number(gid),
      gameName: topEntry.game.gameDetails.map((l) => l.title).join(', '),
      tagged: topEntry.game.tagged,
      topPlayer,
      topPoints: topEntry.value,
      topTeam: topEntry.team.name,
      team: topEntry.team,
      gamePoints,
    });
  }

  return NextResponse.json(result);
}
