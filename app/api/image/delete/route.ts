import { NextResponse } from 'next/server';
//import { getServerSession } from "next-auth";
//import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  try {
    const { imageName } = await req.json();
    //const session = await getServerSession(authOptions);

    if (!imageName) {
      return NextResponse.json({ error: 'Kein Bildname angegeben' }, { status: 400 });
    }

    //console.log("Lösche Bild:", imageName + " durch User: " + session?.user?.uname);
    //if(session?.user?.role !== 'ADMIN' || session?.user?.uname !== imageName){
    //  return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 });
    //}

    const phpUrl = `https://olympia.haaremy.de/uploads/delete.php`;

    const response = await fetch(phpUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ imageName }),
    });

    if (!response.ok) {
      throw new Error(`PHP-Fehler: ${response.statusText}`);
    }

    const result = await response.json(); // hier klappt es, weil dein PHP JSON zurückgibt

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Fehler in API delete:", error.message);
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
}

