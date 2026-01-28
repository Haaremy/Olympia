// app/api/team/block/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.uname) {
    return NextResponse.json(
      { error: "Nicht autorisiert" },
      { status: 401 }
    );
  }

  const { targetUname } = await req.json();

  if (!targetUname) {
    return NextResponse.json(
      { error: "Kein Ziel-Team angegeben" },
      { status: 400 }
    );
  }
  console.log("Blocking user:", targetUname);

  try {
    // Blocker-Team holen
    const blocker = await prisma.team.findUnique({
      where: { uname: session.user.uname },
      select: { id: true },
    });

    // Ziel-Team holen
    const blocked = await prisma.team.findUnique({
      where: { uname: targetUname },
      select: { id: true },
    });

    if (!blocker || !blocked) {
      return NextResponse.json(
        { error: "Team nicht gefunden" },
        { status: 404 }
      );
    }

    if (blocker.id === blocked.id) {
      return NextResponse.json(
        { error: "Du kannst dich nicht selbst blockieren" },
        { status: 400 }
      );
    }

    // Block erstellen (unique constraint schützt vor Duplikaten)
    await prisma.teamBlock.create({
      data: {
        blockerId: blocker.id,
        blockedId: blocked.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
  if (
    error instanceof Error &&
    "code" in error &&
    error.code === "P2002"
  ) {
    return NextResponse.json(
      { error: "Team ist bereits blockiert" },
      { status: 409 }
    );
  }

  console.error("[POST /api/team/block]", error);
  return NextResponse.json(
    { error: "Fehler beim Blockieren" },
    { status: 500 }
  );
}

}
