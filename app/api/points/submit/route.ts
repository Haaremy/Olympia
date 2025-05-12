import { calculatePoints } from '@/lib/calcPoints';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions'; // Passe den Pfad ggf. an
import { NextRequest, NextResponse } from 'next/server';

interface PointsPayload {
  game: number;
  user1: number;
  user2: number;
  user3: number;
  user4: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Partial<PointsPayload>;
    const { game, user1, user2, user3, user4 } = body;

    if (
      typeof game !== 'number' ||
      [user1, user2, user3, user4].some(p => typeof p !== 'number')
    ) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.credentials) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const team = await prisma.team.findUnique({
      where: { credentials: session.user.credentials },
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const userMap = {
      user1: team.user1,
      user2: team.user2,
      user3: team.user3,
      user4: team.user4,
    };

    const scores = { user1, user2, user3, user4 };
    const pointsToInsert = [];

    for (let i = 1; i <= 4; i++) {
      const userKey = `user${i}` as keyof typeof scores;
      const playerName = userMap[userKey];
      const userPoints = scores[userKey];

      if (typeof userPoints !== 'number' || !playerName) continue;

      const value = calculatePoints({ game, userPoints });

      pointsToInsert.push({
        teamId: team.id,
        gameId: game,
        player: playerName,
        value,
      });
    }

    await prisma.points.createMany({ data: pointsToInsert });

    return NextResponse.json({ success: true, inserted: pointsToInsert }, { status: 200 });

  } catch (error) {
    console.error('Error handling POST /api/points/submit:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
