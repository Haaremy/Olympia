import { NextResponse } from "next/server";
import { prisma } from '@/lib/db';

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ChatMessage ID fehlt" }, { status: 400 });
    }

    await prisma.chatMessage.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Fehler beim Löschen" }, { status: 500 });
  }
}

