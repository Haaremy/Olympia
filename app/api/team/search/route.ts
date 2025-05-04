import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  console.log('Query:', query);

  // Run raw SQL search by credentials or name
  let team = await prisma.$queryRaw<
    Array<Awaited<ReturnType<typeof prisma.team.findFirst>>>
  >`SELECT * FROM Team WHERE credentials LIKE ${'%' + query + '%'}`;

  if (team.length === 0) {
    team = await prisma.$queryRaw<
      Array<Awaited<ReturnType<typeof prisma.team.findFirst>>>
    >`SELECT * FROM Team WHERE name LIKE ${'%' + query + '%'}`;

    if (team.length === 0) {
      return NextResponse.json({ error: "Team not found." }, { status: 404 });
    }
  }

  const foundTeam = team[0]!;

  return NextResponse.json({
    found: true,
    team: {
      id: foundTeam.id,
      credentials: foundTeam.credentials,
      name: foundTeam.name,
      players: [
        foundTeam.user1,
        foundTeam.user2,
        foundTeam.user3,
        foundTeam.user4,
      ],
    },
  });
}
