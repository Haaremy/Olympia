import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { Team } from "@prisma/client";  // Import Team type

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  // Log the query to check if it's received properly
  console.log('Query:', query);

  // Use raw SQL to search for the team by credentials, case-insensitive match
  let team: Team[] = await 
    prisma.$queryRaw`
    SELECT * FROM Team WHERE credentials LIKE ${'%' + query + '%'}
  `;

  if (team.length === 0) {
    team = await 
    prisma.$queryRaw`
    SELECT * FROM Team WHERE name LIKE ${'%' + query + '%'}
  `;
  if (team.length === 0)
    return NextResponse.json({ error: "Team not found." }, { status: 404 });
  }

  // If team is found, format the response
  const foundTeam = team[0]; // Assuming the team exists, take the first result
  return NextResponse.json({
    found: true,
    team: {
      id: foundTeam.id,
      credentials: foundTeam.credentials,
      name: foundTeam.name,
      players: [foundTeam.user1, foundTeam.user2, foundTeam.user3, foundTeam.user4],
    },
  });
}
