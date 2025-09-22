import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {

try{
    const chat = await prisma.chatmessage.findMany({
      orderBy: {
        lastUpdated: 'desc',
      },
    });


    return NextResponse.json({
      success: true,
        chat,
    }, { status: 200 });

  } catch (error) {
    console.error('Fehler beim Abrufen der Chats:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}



