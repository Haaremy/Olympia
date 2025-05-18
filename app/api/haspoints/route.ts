// app/api/hasPoints/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const teamIdParam = searchParams.get("teamId");
    const gameIdParam = searchParams.get("gameId");

    const teamId = Number(teamIdParam);
    const gameId = Number(gameIdParam);

    if (!teamIdParam || !gameIdParam || isNaN(teamId) || isNaN(gameId)) {
      return new Response(JSON.stringify({ error: "Invalid or missing teamId or gameId" }), {
        status: 400,
      });
    }

    const existingPoints = await prisma.points.findFirst({
      where: {
        teamId,
        gameId,
      },
    });

    return new Response(JSON.stringify({ hasPoints: !!existingPoints }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("API Fehler in /api/hasPoints:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
