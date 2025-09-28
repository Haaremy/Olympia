// app/api/team/update/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  const data = await req.json();
  const { id, name, user1, user2, user3, user4 } = data;

  if (!id) {
    return NextResponse.json({ error: "ID fehlt" }, { status: 400 });
  }

  // Optional: move user4 to user3 if user3 is empty
  let updatedUser3 = user3;
  let updatedUser4 = user4;
  if (!updatedUser3 && updatedUser4) {
    updatedUser3 = updatedUser4;
    updatedUser4 = null;
  }

  try {
    const updatedTeam = await prisma.team.update({
      where: { id: Number(id) }, // adjust if id is string
      data: {
        name,
        user1,
        user2,
        user3: updatedUser3,
        user4: updatedUser4,
      },
    });

    return NextResponse.json({ success: true, team: updatedTeam });
  } catch (error) {
    console.error("[POST /api/team/update]", error);
    return NextResponse.json({ error: "Fehler beim Aktualisieren" }, { status: 500 });
  }
}
