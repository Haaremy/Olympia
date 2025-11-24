import { calculatePoints } from '@/lib/calcPoints';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { NextRequest, NextResponse } from 'next/server';
import { Slot } from '@prisma/client';

interface PointsPayload {
  game: number;
  user1: number;
  user2: number;
  user3: number;
  user4: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<PointsPayload>;

    // Pflichtfelder prüfen
    const { game, user1, user2, user3, user4 } = body;
    const nums = [user1, user2, user3, user4];

    if (typeof game !== 'number' || nums.some(p => typeof p !== 'number')) {
      return NextResponse.json({ error: 'Invalid payload: game and user1..user4 must be numbers' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.uname) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Slot-Mapping
    const slotMap: Record<number, Slot> = {
      1: Slot.USER1,
      2: Slot.USER2,
      3: Slot.USER3,
      4: Slot.USER4,
    };

    // Team einmal komplett laden (inkl. Einträge)
    const team = await prisma.team.findUnique({
      where: { uname: session.user.uname },
      select: {
        id: true,
        uname: true,
        user1: true,
        user2: true,
        user3: true,
        user4: true,
        pointsTotal: true,
        cheatPoints: true,
        entries: {
          select: { lastUpdated: true },
          orderBy: { lastUpdated: 'desc' },
        },
      },
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    // Bestimme wie viele Spieler tatsächlich im Team sind (nicht-leere Namen)
    const teamPlayers = [team.user1, team.user2, team.user3, team.user4]
      .filter(p => typeof p === 'string' && p.trim().length > 0).length;

    // Fallback: wenn keine Namen vorhanden, nimm 4 (oder setze minimale Logik)
    const playersCount = teamPlayers > 0 ? teamPlayers : 4;

    // Multiplier-Logik (wie du sie vorher hattest, aber sauberer)
    const multiplierForPlayers = (count: number) => {
      if (count >= 4) return 1.1;
      if (count === 3) return 1.4;
      if (count === 2) return 2;
      return 1; // Einzelspieler (Fallback)
    };
    const multiplier = multiplierForPlayers(playersCount);

    // Scores aus Request
    const scores: Record<number, number> = {
      1: user1 as number,
      2: user2 as number,
      3: user3 as number,
      4: user4 as number,
    };

    const pointsToInsert: Array<{ teamId: number; gameId: number; value: number; slot: Slot }> = [];
    const inputsToInsert: Array<{ teamId: number; gameId: number; value: number; slot: Slot; lastUpdated?: Date }> = [];

    // Startwerte aus DB
    let pointValues = team.pointsTotal ?? 0;
    let cheatValues = team.cheatPoints ?? 0;

    // Berechne Punkte & Cheats pro Slot
    for (let i = 1; i <= 4; i++) {
      const userPoints = scores[i];

      // Validierungs-Safety: Sollte nie passieren wegen der Payload-Prüfung oben,
      // aber wir geben eine klare Fehlermeldung zurück (keine stille return).
      if (typeof userPoints !== 'number') {
        return NextResponse.json({ error: `Invalid userPoints for user${i}` }, { status: 400 });
      }

      // Verwende pro Spieler denselben Multiplier (ursprünglich pro Spieler berechnet)
      // Wenn du unterschiedliche multiplier pro slot willst, passe hier an.
      const currentMultiplier = multiplier;

      const { result: rawResult, cheats } = calculatePoints({
        game,
        field: i,
        userPoints,
        multiplier: currentMultiplier,
      });

      const result = Math.round(rawResult);
      const cheatAdd = cheats ?? 0;

      pointsToInsert.push({
        teamId: team.id,
        gameId: game,
        value: result,
        slot: slotMap[i],
      });

      inputsToInsert.push({
        teamId: team.id,
        gameId: game,
        value: userPoints,
        slot: slotMap[i],
        // lastUpdated kann DB-default haben; optional hier
      });

      pointValues += result;
      cheatValues += cheatAdd;
    }

    // Anzahl Einträge vor dem Insert
    const beforeEntriesCount = team.entries?.length ?? 0;

    // Atomare Operation: Punkte + Einträge + Team-Update in Transaction
    // Wir müssen vorher noch Bonus-Logik & cheatTime berechnen, einige Werte benötigen beforeEntriesCount
    // berechne cheatTime basierend auf neuem Eintragzeitpunkt-Check (wir prüfen den letzten vorhandenen Eintrag)
    const lastEntry = team.entries && team.entries.length > 0 ? team.entries[0] : null;
    const cheatTimeAdd = (() => {
      if (!lastEntry?.lastUpdated) return 0;
      const diffMs = Date.now() - new Date(lastEntry.lastUpdated).getTime();
      return diffMs < 60000 ? 3 : 0; // 3 Punkte wenn letzter Eintrag weniger als 60s alt ist
    })();

    cheatValues += cheatTimeAdd;

    // Führe createMany
    await prisma.$transaction([
      prisma.points.createMany({ data: pointsToInsert }),
      prisma.entries.createMany({ data: inputsToInsert }),
    ]);

    const afterEntriesCount = beforeEntriesCount + inputsToInsert.length;

    // Bonus: wenn vor dem Insert 23*4 Einträge waren und nach dem Insert 24*4, dann Bonus 40
    if (beforeEntriesCount === 23 * 4 && afterEntriesCount === 24 * 4) {
      pointValues += 40;
    }

    // Jetzt das Team updaten (erst nach Transaction, damit ZUSTAND konsistent bleibt)
    await prisma.team.update({
      where: { id: team.id },
      data: {
        pointsTotal: pointValues,
        cheatPoints: cheatValues,
      },
    });

    return NextResponse.json(
      { success: true, inserted: pointsToInsert.length, points: pointsToInsert },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error handling POST /api/points/submit:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
