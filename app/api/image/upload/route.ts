// app/api/upload/route.ts (oder pages/api/upload.ts) - Server runtime
import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  // Size check (2 MB)
  const MAX = 2 * 1024 * 1024;
  if (file.size > MAX) return NextResponse.json({ error: 'File too large: ', MAX }, { status: 400 });

  const session = await getServerSession(authOptions);
  if (!session || !session.user?.uname) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userName = session.user.uname.toLowerCase();

  // convert to JPG with sharp
 const buffer = Buffer.from(await file.arrayBuffer());
const jpgBuffer = await sharp(buffer).jpeg({ quality: 90 }).toBuffer();
const uint8 = new Uint8Array(jpgBuffer);
const fileForPhp = new File([uint8], `${userName}.jpg`, { type: 'image/jpeg' });

const phpForm = new FormData();
phpForm.append('file', fileForPhp);

const res = await fetch('https://olympia.haaremy.de/uploads/upload.php', {
  method: 'POST',
  body: phpForm
});


if (!res.ok) {
  throw new Error(`PHP-Fehler: ${res.status} ${res.statusText}`);
}

const data = await res.json();

// Direkt prüfen
if (!data.success) {
  throw new Error(data.error);
}

  // Rückgabe an Client (z. B. URL auf das gespeicherte JPG)
  return NextResponse.json({ data }, { status: 200 });
}
