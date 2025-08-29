import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Video from '@/models/Video';

export async function GET() {
  try {
    await connectDB();
    const videos = await Video.find().populate('uploadedBy', 'username profileImage').sort({ createdAt: -1 });
    return NextResponse.json({ videos }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
