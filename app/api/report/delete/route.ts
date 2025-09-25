// app/api/report/delete/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID ist erforderlich" }, { status: 400 });
    }

    const deletedReport = await prisma.reports.delete({
      where: { id: id },
    });

    return NextResponse.json({ success: true, report: deletedReport });
  } catch (error) {
    console.error("[DELETE /api/team/delete]", error);
    return NextResponse.json({ error: "Fehler beim Löschen" }, { status: 500 });
  }
}
