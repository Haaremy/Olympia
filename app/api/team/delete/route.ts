// app/api/team/delete/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  

  try {
    const deletedTeam = await prisma.team.delete({
      where: { uname: session.user.uname },
    });

    return NextResponse.json({ success: true, team: deletedTeam });
  } catch (error) {
    console.error("[DELETE /api/team/delete]", error);
    return NextResponse.json({ error: "Fehler beim Löschen" }, { status: 500 });
  }
}
