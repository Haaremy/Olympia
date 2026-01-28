import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {

try {
    const chat = await prisma.chatMessage.findMany({
  orderBy: {
    createdAt: 'asc',
  },
  include: {
    team: {
      select: {
        uname: true,
        name: true,
        blocks: true,
      },
    },
  },
});


    return NextResponse.json(chat, { status: 200 }); // 👈 return array only
  } catch (error) {
    console.error('Fehler beim Abrufen der Chats:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}





