// /api/user/register.ts
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const { uname, name, clearpw} = await req.json();

  if (!uname || !name || !clearpw) {
    return NextResponse.json({ error: "Fehlende Felder" }, { status: 400 });
  }

  const exists = await prisma.team.findUnique({ where: { uname } });  // where unique explicitly

  if (exists) {
    return NextResponse.json({ error: "Benutzername bereits vergeben" }, { status: 409 });
  }

  const password = await bcrypt.hash(clearpw, 10);


  const newUser = await prisma.team.create({
    data: {
      uname,
      name,
      password, // ❗ ACHTUNG: In Produktion unbedingt Passwort hashen
      role: "USER",
      language: "de",
      user1: "",
      user2: "",
      pointsTotal: 0,
      cheatPoints: 0,
    },
  });

  return NextResponse.json({ success: true, id: newUser.id });
}
