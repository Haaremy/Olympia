import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // JSON Body von der Anfrage extrahieren
    const { imageName } = await req.json();

    if (!imageName) {
      return NextResponse.json({ error: 'Kein Bildname angegeben' }, { status: 400 });
    }

    // Die URL der externen PHP-Datei, die das Bild löscht
    const phpUrl = `https://olympia.haaremy.de/delete.php`;

    // Anfrage an die PHP-Datei senden
    const response = await fetch(phpUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ imageName }), // Hier verwenden wir 'imageName' statt 'imagePath'
    });

    if (!response.ok) {
      throw new Error('Fehler beim Löschen des Bildes');
    }

    const result = await response.json();
    
    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 });
  }
}


