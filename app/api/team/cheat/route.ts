// app/api/team/update/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.role.includes("ADMIN")) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  const data = await req.json();
  //console.log(data.searchedTeam.uname+" set Data: "+data.cheatNum);
  
  try {
    const updatedTeam = await prisma.team.update({
      where: { uname: data.searchedTeam.uname },
      data: {
        cheatPoints: data.cheatNum,
      },
    });

    return NextResponse.json({ success: true, team: updatedTeam });
  } catch (error) {
    console.error("[POST /api/team/update]", error);
    return NextResponse.json({ error: "Fehler beim Aktualisieren" }, { status: 500 });
  }
}