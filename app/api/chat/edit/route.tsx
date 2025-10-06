import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { NextRequest, NextResponse } from 'next/server';

interface Chat {
  id: number;
  message: string;
  createdAt: string;
  edited: boolean;
  team: {
    uname: string;
    name: string;
    cheatPoints: number;
  };
}

interface ChatRequestBody {
  chat: Chat;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as ChatRequestBody;
    if (!body.chat) {
      return NextResponse.json(
        { error: 'chat is required' },
        { status: 400 }
      );
    }


    const session = await getServerSession(authOptions);
    if (!session || !session.user?.uname) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const team = await prisma.team.findUnique({
      where: { uname: session.user.uname },
    });
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    await prisma.chatMessage.update({
      where: {
        id: body.chat.id
      },
      data: {
        message: body.chat.message,
        edited: body.chat.edited,
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


