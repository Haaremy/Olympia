import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { NextRequest, NextResponse } from 'next/server';

interface ReportRequestBody {
  gameid: number;
  teamName: string;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as ReportRequestBody;
    if (!body.message) {
      return NextResponse.json(
        { error: 'message are required' },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.uname) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }


    await prisma.reports.create({
      data: {
        teamName: body.teamName, // Nur der uanme des Teams
        gameId: body.gameid,
        message: body.message,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error handling POST /api/report/create:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}


