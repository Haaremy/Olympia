import { NextRequest, NextResponse } from 'next/server';

interface PointsPayload {
  game: string;
  user1: number;
  user2: number;
  user3: number;
  user4: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Partial<PointsPayload>;

    const { game, user1, user2, user3, user4 } = body;

    // Validierung
    if (!game || [user1, user2, user3, user4].some(p => typeof p !== 'number')) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Hier könntest du Daten in eine Datenbank speichern
    console.log('Received points submission:', { game, user1, user2, user3, user4 });

    // Beispiel: Dummy-Speicher oder Weiterleitung
    // await db.points.create({ data: { game, user1, user2, ... } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error handling POST /api/points/submit:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
