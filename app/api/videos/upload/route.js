import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Video from '@/models/Video';
import { verifyTokenFromHeader } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

export const config = { api: { bodyParser: false } };

export async function POST(req) {
  try {
    await connectDB();
    const user = verifyTokenFromHeader(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get('file');
    const title = formData.get('title') || 'Untitled';
    const description = formData.get('description') || '';

    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buf = Buffer.from(arrayBuffer);

    const uploaded = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ resource_type: 'video', folder: 'video_app' }, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
      stream.end(buf);
    });

    const video = await Video.create({
      title,
      description,
      videoUrl: uploaded.secure_url,
      thumbnailUrl: uploaded.secure_url,
      publicId: uploaded.public_id,
      uploadedBy: user.id
    });

    return NextResponse.json({ video }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
