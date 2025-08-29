import LikeDislikeButtons from '@/component/LikeDislikeButtons';
import VideoPlayer from '@/component/VideoPlayer';

export default async function VideoPage({ params }) {
   let id = await params
    let Id= id.id
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/videos/${Id}`, { cache: 'no-store' });
  const data = await res.json();
  const video = data.video;
  if (!video) return <div className="p-6">Not found</div>;
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
        <p className="text-sm text-gray-400 mb-4">Uploaded by {video.uploadedBy?.username || 'Unknown'}</p>
        <VideoPlayer src={video.videoUrl} />
        <div className="mt-4">
          <LikeDislikeButtons videoId={video._id} initialLikes={video.likes || []} initialDislikes={video.dislikes || []} />
        </div>
        <section className="mt-6">
          <h3 className="font-semibold">Description</h3>
          <p className="text-sm text-gray-300">{video.description}</p>
        </section>
      </div>
    </main>
  );
}
