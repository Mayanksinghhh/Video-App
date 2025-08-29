import Link from 'next/link';

export default function VideoCard({ video }) {
  return (
    <Link href={`/videos/${video._id}`} className="block bg-black border border-white/10 rounded-lg overflow-hidden hover:shadow-lg">
      <div className="h-48 bg-slate-900 flex items-center justify-center overflow-hidden">
        <img src={video.thumbnailUrl || '/placeholder.png'} alt={video.title} className="w-full h-full object-cover"/>
      </div>
      <div className="p-3">
        <h3 className="text-white font-semibold">{video.title}</h3>
        <p className="text-sm text-gray-400">{video.uploadedBy?.username || 'Unknown'}</p>
      </div>
    </Link>
  );
}
