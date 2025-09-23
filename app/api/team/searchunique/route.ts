import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  console.log('Query:', query);

  try {
    // Run the query using findFirst for efficiency, since you only need one result
    const nutzer = await prisma.team.findFirst({
      where: {
        uname: query,
      }
    });

    if (!nutzer) {
      return NextResponse.json({ found: false, error: "User not found" }, { status: 404 });
    }

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
