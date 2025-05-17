import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      where: {
        pointsTotal: {
          gt: 0, // Nur Teams mit Punkten > 0
        },
      },
      orderBy: { pointsTotal: "desc" },
      include: {
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
