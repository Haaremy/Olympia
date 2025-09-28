import { calculatePoints } from '@/lib/calcPoints';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions'; // Passe den Pfad ggf. an
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
    const body = await req.json() as Partial<PointsPayload>;
    const { game, user1, user2, user3, user4 } = body;
    const slotMap: Record<number, Slot> = {
  1: Slot.USER1,
  2: Slot.USER2,
  3: Slot.USER3,
  4: Slot.USER4,
};

    if (
      typeof game !== 'number' ||
      [user1, user2, user3, user4].some(p => typeof p !== 'number')
    ) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.uname) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const team = await prisma.team.findUnique({
  where: { uname: session.user.uname },
  include: {
    entries: {
      select: {
        lastUpdated: true, // Select the lastUpdate field
      },
      orderBy: {
        lastUpdated: 'desc', // Sort entries by lastUpdate in descending order
      },
    },
  },
});


    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    
    
    const scores = { user1, user2, user3, user4 };
    
   let pointValues = (await prisma.team.findUnique({
  where: { uname: team.uname },
  select: {
    pointsTotal: true,
  },
}))?.pointsTotal ?? 0;

let cheatValues = (await prisma.team.findUnique({
  where: { uname: team.uname },
  select: {
    cheatPoints: true,
  },
}))?.cheatPoints ?? 0;

    
    const pointsToInsert = [];
    const inputsToInsert = [];

    for (let i = 1; i <= 4; i++) {
      const userKey = `user${i}` as keyof typeof scores;
      const userPoints = scores[userKey];
      const field = i;

      if (typeof userPoints !== 'number') return;


      let multiplier = 1.1; // 4 Spieler

      if (team.user4=="" || !team.user4){ // 3 Spieler
        multiplier = 1.4; 
      }
      if(team.user3=="" || !team.user3){ // 2 Spieler
        multiplier = 2;
      }

      let {result, cheats} = calculatePoints({ game, userPoints, multiplier, field });
      result = Math.round(result);
      cheats = cheats;

     

      pointsToInsert.push({
        teamId: team.id,
        gameId: game,
        value: result,
        slot: slotMap[field],
      });

       inputsToInsert.push({
        teamId: team.id,
        gameId: game,
        value: userPoints,
        slot: slotMap[field],
      })

      pointValues += result;
      cheatValues += cheats;
}

    await prisma.points.createMany({
  data: pointsToInsert, // <-- Punkte für Team
});

await prisma.entries.createMany({
  data: inputsToInsert, // <-- Einträge vom Team
});

  const cheatTime = () => {
    if(!team.entries[0]?.lastUpdated) return 0;
    if((new Date(team.entries[0].lastUpdated).getTime() - Date.now()) < 60000){
      return 3;
    }// Letzter Eintrag ist weniger als 1min von jetzt entfernt
    return 0;
  }

    cheatValues+=cheatTime();
    
await prisma.team.update({
  where: { id: team.id },
  data: {
    pointsTotal: pointValues,
    cheatPoints: cheatValues,
  },
});


    return NextResponse.json({ success: true, inserted: pointsToInsert }, { status: 200 });

  } catch (error) {
    console.error('Error handling POST /api/points/submit:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
