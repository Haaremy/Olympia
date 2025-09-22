import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {


    const chat = await prisma.chat.findMany({
      orderBy: {
        lastUpdated: 'desc',
      },
    });


    return NextResponse.json({
      success: true,
    }, { status: 200 });

  } catch (error) {
    console.error('Fehler beim Abrufen der Chats:', error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
