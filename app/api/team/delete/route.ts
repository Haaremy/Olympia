// app/api/team/delete/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  // Request Body auslesen
  let body: { uname?: string } = {};
  try {
    body = await request.json();
  } catch {
    // falls kein JSON gesendet wurde, einfach leer lassen
  }

  // Verwende zuerst uname aus Body, sonst fallback auf session.user.uname
  const unameToDelete = body.uname || session.user.uname;

  try {
    const deletedTeam = await prisma.team.delete({
      where: { uname: unameToDelete },
    });

    return NextResponse.json({ success: true, team: deletedTeam });
  } catch (error) {
    console.error("[DELETE /api/team/delete]", error);
    return NextResponse.json({ error: "Fehler beim Löschen" }, { status: 500 });
  }
}
