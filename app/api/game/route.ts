import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const language = url.searchParams.get("language") || "de"; // Default auf "de"

    const games = await prisma.game.findMany({
      include: {
        gameDetails: {
          where: {
            language: language,
          },
        },
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
