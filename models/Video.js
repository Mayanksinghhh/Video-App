import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    videoUrl: String,
    thumbnailUrl: String,
    publicId: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",   
    },
    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.models.Video || mongoose.model("Video", videoSchema);
