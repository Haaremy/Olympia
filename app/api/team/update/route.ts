// app/api/team/update/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  const data = await req.json();
  if(!data.user3 && data.user4){
    data.user3 = data.user4;
    data.user4 = null;
  }

  try {
    const updatedTeam = await prisma.team.update({
      where: { uname: session.user.uname },
      data: {
        user1: data.user1,
        user2: data.user2, 
        user3: data.user3,
        user4: data.user4,
      },
    });

    return NextResponse.json({ success: true, team: updatedTeam });
  } catch (error) {
    console.error("[POST /api/team/update]", error);
    return NextResponse.json({ error: "Fehler beim Aktualisieren" }, { status: 500 });
  }
}