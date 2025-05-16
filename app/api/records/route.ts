import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const games = await prisma.game.findMany({
    include: {
      points: {
        orderBy: { value: 'desc' },
        take: 1,
        include: { team: true },
      },
    },
  });

  const result = games.map(game => {
    const top = game.points[0];
    return {
      gameId: game.id,
      topPlayer: top?.player || null,
      topPoints: top?.value || null,
      team: top?.team ? {
        id: top.team.id,
        name: top.team.name,
      } : null,
    };
  });

  return NextResponse.json(result);
}