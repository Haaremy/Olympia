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
 const nutzer = await prisma.team.findMany({
  where: {
    OR: [
      { uname: { equals: query } }
        ]
  }
});
  const foundUser = nutzer[0];

  return NextResponse.json({
    found: true,
    user: {
      uname: foundUser.uname,
      name: foundUser.name,
    },
  });
}
