import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Video from "@/models/Video";
import User from "@/models/User"; // ensure User schema is registered
import cloudinary from "@/lib/cloudinary";
import { verifyTokenFromHeader } from "@/lib/auth";

export async function GET(req, {params}) {
  try {
    await connectDB();

    const { id } = await params; // ✅ await params

    const video = await Video.findById(id).populate(
      "uploadedBy",
      "username profileImage"
    );

    if (!video) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    video.views = (video.views || 0) + 1;
    await video.save();

    return NextResponse.json( {video, status: 200 });
  } catch (err) {
    console.error("GET video error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    await connectDB();

    const { id } = await context.params; // ✅ await params

    const user = verifyTokenFromHeader(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const video = await Video.findById(id);
    if (!video)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (video.uploadedBy && video.uploadedBy.toString() !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (video.publicId) {
      try {
        await cloudinary.uploader.destroy(video.publicId, {
          resource_type: "video",
        });
      } catch (e) {
        console.warn("Cloudinary deletion failed", e.message || e);
      }
    }

    await video.deleteOne();
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (err) {
    console.error("DELETE video error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
