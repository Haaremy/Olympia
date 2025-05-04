// app/api/game/route.ts

import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      include: {
        languages: true,
      },
    });

    return new Response(JSON.stringify(games), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("[GET /api/game] Fehler:", error);
    return new Response(
      JSON.stringify({ error: "Fehler beim Abrufen der Spiele" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
