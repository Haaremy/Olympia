import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const gameIdParam = req.nextUrl.searchParams.get('gameId');
  const gameId = parseInt(gameIdParam || '', 10);

  if (isNaN(gameId) || gameId <= 0) {
    return NextResponse.json({ error: 'Ungültige Spiel-ID' }, { status: 400 });
  }

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.uname) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const team = await prisma.team.findUnique({
      where: { uname: session.user.uname },
    });

    if (!team) {
      return NextResponse.json({ error: 'Team nicht gefunden' }, { status: 404 });
    }


    const reports = await prisma.reports.findMany({
      where: {
        gameId: gameId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });


    return NextResponse.json({
      success: true,
      reports,
    }, { status: 200 });

  } catch (error) {
    console.error('Fehler beim Abrufen der Reports:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}




