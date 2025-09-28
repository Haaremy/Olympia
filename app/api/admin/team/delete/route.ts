// app/api/admin/team/delete/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "ID fehlt" }, { status: 400 });
    }

    const deletedTeam = await prisma.team.delete({
      where: { id: Number(id) }, // adjust if id is string
    });

    return NextResponse.json({ success: true, team: deletedTeam });
  } catch (error) {
    console.error("[DELETE /api/admin/team/delete]", error);
    return NextResponse.json({ error: "Fehler beim Löschen" }, { status: 500 });
  }
}
