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
 const team = await prisma.team.findMany({
  where: {
    OR: [
      { uname: { contains: query } },
      { name: { contains: query } }
    ]
  }
});
  const foundTeam = team[0]!;

  return NextResponse.json({
    found: true,
    team: {
      id: foundTeam.id,
      uname: foundTeam.uname,
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
