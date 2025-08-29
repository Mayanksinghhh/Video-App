import VideoCard from "@/component/VideoCard";

export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/videos`);
  const data = await res.json();
  const videos = data.videos || [];
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Video App</h1>
          <div className="space-x-3">
            <a href="/upload" className="px-4 py-2 bg-white text-black rounded">Upload</a>
            <a href="/login" className="px-4 py-2 border border-white rounded">Login</a>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map(v => <VideoCard key={v._id} video={v} />)}
        </section>
      </div>
    </main>
  );
}
