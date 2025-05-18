import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/settings
export async function GET() {
  try {
    const settings = await prisma.gameSettings.findFirst();

    if (!settings) {
      return NextResponse.json({ error: 'Keine Einstellungen gefunden' }, { status: 404 });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('[API_SETTINGS_GET]', error);
    return NextResponse.json({ error: 'Serverfehler beim Laden der Einstellungen' }, { status: 500 });
  }
}

// PUT /api/settings
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { started, ending } = body;

    if (typeof started !== 'boolean' || typeof ending !== 'string') {
      return NextResponse.json({ error: 'Ungültige Eingabedaten' }, { status: 400 });
    }

    // Prüfe ob ending valide Datumszeichenkette ist, optional

    const updated = await prisma.gameSettings.update({
      where: { id: 1 }, // Beispiel id, anpassen nach Bedarf
      data: {
        started,
        ending: new Date(ending), // String in Date umwandeln
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
  }
}
