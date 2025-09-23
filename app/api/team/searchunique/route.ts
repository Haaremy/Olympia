// /app/api/team/searchunique/route.ts

import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// Define a GET handler
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  console.log('Query:', query);

  try {
    // Search for the user by the query (uname)
    const nutzer = await prisma.team.findFirst({
      where: {
        uname: {
          conatins: query,
        },
      },
    });

    if (!nutzer) {
      return NextResponse.json({ found: false, error: "User not found" }, { status: 404 });
    }

    // Return user details if found
    return NextResponse.json({
      found: true,
      user: {
        uname: nutzer.uname,
        name: nutzer.name,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
