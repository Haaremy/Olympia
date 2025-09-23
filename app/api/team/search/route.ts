import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { Game } from '@prisma/client';

type SearchedTeam = {
  id: number;
  uname: string;
  name: string;
  players: string[];
  cheatPoints: number;
  pointsTotal: number;
  games: {
    id: number;
    points: { player: string; value: number }[];
  }[];
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");


  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  console.log('Query:', query);

  // Run raw SQL search by credentials or name
const teams = await prisma.team.findMany({
  where: {
    OR: [
      { uname: { contains: query } },
      { name: { contains: query } }
    ]
  },
    include: {
      // wir holen alle Punkte-Reihen dieses Teams, inkl. game (mit languages)
      points: {
        include: {
          game: {
            include: {
              languages: true, // falls titles in Language liegen
            },
          },
        },
      },
    },
  });

const foundTeam = teams[0];

  if (!foundTeam) {
    return NextResponse.json({ found: false }, { status: 404 });
  }

 const gameMap = new Map<number, { game: Game; points: { player: string; value: number }[] }>();

  for (const p of foundTeam.points) {
    const gid = p.game.id;
    const entry = gameMap.get(gid) ?? { game: p.game, points: [] };
    // p.player und p.value sind die Punktwerte für dieses Team in diesem Spiel
    entry.points.push({ player: p.player, value: p.value });
    gameMap.set(gid, entry);
  }

  // Team-Spielernamen (Fallbacks falls user3/user4 fehlen)
  const playerNames = [
    foundTeam.user1,
    foundTeam.user2,
    foundTeam.user3 ?? "",
    foundTeam.user4 ?? "",
  ];

  const games = Array.from(gameMap.values()).map(({ game, points }) => {
    

    // Erzeuge für die 4 Teamspieler genau einen Wert (0, wenn nicht vorhanden)
    const playerPoints = playerNames.map((name) => {
      const pt = points.find((x) => x.player === name);
      return { player: name, value: pt?.value ?? 0 };
    });

    return {
      id: game.id,
      points: playerPoints,
    };
  });

  const searchedTeam: SearchedTeam = {
    id: foundTeam.id,
    uname: foundTeam.uname,
    name: foundTeam.name,
    players: playerNames,
    cheatPoints: foundTeam.cheatPoints ?? 0,
    games,
  };

  return NextResponse.json({ found: true, team: searchedTeam });
}
