import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { Game, Slot } from '@prisma/client';

type SearchedTeam = {
  id: number;
  uname: string;
  name: string;
  players: string[];
  cheatPoints: number;
  pointsTotal: number;
  games: {
    id: number;
    points: { slot: Slot; value: number }[];
  }[];
  contact: string;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  // Fetch teams matching query
  const teams = await prisma.team.findMany({
    where: {
      OR: [
        { uname: { contains: query } },
        { name: { contains: query } }
      ]
    },
    include: {
      points: {
        include: {
          game: {
            include: { languages: true },
          },
        },
      },
    },
  });

  const foundTeam = teams[0];
  if (!foundTeam) {
    return NextResponse.json({ found: false }, { status: 404 });
  }

  // Map games to points
  const gameMap = new Map<number, { game: Game; points: { slot: Slot; value: number }[] }>();
  for (const p of foundTeam.points) {
    const gid = p.game.id;
    const entry = gameMap.get(gid) ?? { game: p.game, points: [] };
    entry.points.push({ slot: p.slot, value: p.value });
    gameMap.set(gid, entry);
  }

  const playerNames = [
    foundTeam.user1,
    foundTeam.user2,
    foundTeam.user3 ?? "",
    foundTeam.user4 ?? "",
  ];

  const games = Array.from(gameMap.values()).map(({ game, points }) => {
    // Map slots to values, ensuring all 4 slots are present
    const slotPoints: Record<Slot, { slot: Slot; value: number }> = {
  [Slot.USER1]: { slot: Slot.USER1, value: 0 },
  [Slot.USER2]: { slot: Slot.USER2, value: 0 },
  [Slot.USER3]: { slot: Slot.USER3, value: 0 },
  [Slot.USER4]: { slot: Slot.USER4, value: 0 },
};

// Fill actual points
points.forEach(p => {
  slotPoints[p.slot] = { slot: p.slot, value: p.value };
});

// Convert to array
const pointsArray = Object.values(slotPoints); // now it's {slot,value}[]



    return { id: game.id, points: pointsArray };
  });

  const searchedTeam: SearchedTeam = {
    id: foundTeam.id,
    uname: foundTeam.uname,
    name: foundTeam.name,
    players: playerNames,
    cheatPoints: foundTeam.cheatPoints ?? 0,
    pointsTotal: foundTeam.pointsTotal ?? 0,
    contact: foundTeam.contact,
    games,
  };

  return NextResponse.json({ found: true, team: searchedTeam });
}
