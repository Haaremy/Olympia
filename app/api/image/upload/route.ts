import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

// ... previous imports

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const fileData = formData.get('file');
    const file = fileData instanceof File ? fileData : null;

    if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Check file size (max 2 MB)
    const MAX_SIZE = 2 * 1024 * 1024; // 2 MB in bytes
    if (file.size > MAX_SIZE) {
        return NextResponse.json({ error: 'File too large. Maximum size is 2 MB.' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.uname) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userName = session.user.uname.toLowerCase();
    const buffer = Buffer.from(await file.arrayBuffer());

    // Check file extension
    const allowedTypes = ['jpg', 'jpeg', 'png'];
    const fileName = file.name || '';
    const ext = fileName.split('.').pop()?.toLowerCase();

    if (!ext || !allowedTypes.includes(ext)) {
        return NextResponse.json({ error: 'Invalid file type. Only jpg and png allowed.' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadDir, `${userName}.jpg`);

    try {
        await import('fs/promises').then(fs => fs.mkdir(uploadDir, { recursive: true }));

        // Convert image to jpg using sharp
        const sharp = (await import('sharp')).default;
        const jpgBuffer = await sharp(buffer).jpeg().toBuffer();

        await writeFile(filePath, jpgBuffer);
        return NextResponse.json({ message: 'File uploaded', fileurl: `/uploads/${userName}.jpg` }, { status: 200 });
    } catch (error) {
        console.error("Error saving file:", error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}