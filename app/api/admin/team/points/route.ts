import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { NextRequest, NextResponse } from 'next/server';
import { Slot } from '@prisma/client'; // import enum

interface PointsPayload {
  gameId: number;
  teamId: number;
  user1: number;
  user2: number;
  user3: number;
  user4: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<PointsPayload>;
    const { teamId, gameId, user1, user2, user3, user4 } = body;

    // ✅ Validate required fields
    if (
      typeof teamId !== 'number' ||
      typeof gameId !== 'number' ||
      [user1, user2, user3, user4].some(p => typeof p !== 'number')
    ) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // ✅ Auth check
    const session = await getServerSession(authOptions);
    if (session?.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ✅ Load team
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }


   const userInputs = [
  { value: user1, slot: Slot.USER1 },
  { value: user2, slot: Slot.USER2 },
  { value: user3, slot: Slot.USER3 },
  { value: user4, slot: Slot.USER4 },
].filter((u): u is { value: number; slot: Slot } => typeof u.value === 'number');

const pointsToInsert = userInputs.map(u => ({
  teamId,
  gameId,
  value: u.value < 0 ? 0 : u.value,
  slot: u.slot,
}));

const entriesToInsert = userInputs.map(u => ({
  teamId,
  gameId,
  value: 9999, // placeholder
  slot: u.slot,
}));

    // recalc totalPoints
    // sum of new points
const newPointsSum = pointsToInsert.reduce((sum, p) => sum + p.value, 0);

// update totalPoints
let totalPoints = team.pointsTotal ?? 0;

// subtract old points first
const existingPoints = await prisma.points.findMany({ where: { teamId, gameId } });
const previousSum = existingPoints.reduce((sum, p) => sum + p.value, 0);

totalPoints = totalPoints - previousSum + newPointsSum;


    // ✅ Transaction: delete old, insert new, update total
    await prisma.$transaction([
      prisma.points.deleteMany({ where: { teamId, gameId } }),
      prisma.entries.deleteMany({ where: { teamId, gameId } }),
      prisma.points.createMany({ data: pointsToInsert }),
      prisma.entries.createMany({ data: entriesToInsert }),
      prisma.team.update({ where: { id: teamId }, data: { pointsTotal: totalPoints } }),
    ]);

    return NextResponse.json({ success: true, inserted: pointsToInsert }, { status: 200 });
  } catch (error) {
    console.error('Error handling POST /api/points/submit:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
