import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      where: {
        pointsTotal: {
          gt: 0, // Nur Teams mit Punkten > 0
        },
        cheatPoints: {
          lt: 12, // Teams with cheat points < 12
        },
      },
      orderBy: { pointsTotal: "desc" },
      select: {
        id: true,
        uname: true,
        name: true,
        user1: true,
        user2: true,
        user3: true,
        user4: true,
        pointsTotal: true,
        cheatPoints: true,
        entries: {
          include: {
            game: true,
          },
        },
      },
    });

    return NextResponse.json(teams);
  } catch (error) {
    console.error("Fehler beim Laden der Teams:", error);
    return NextResponse.json({ error: "Fehler beim Laden der Teams" }, { status: 500 });
  }
}
