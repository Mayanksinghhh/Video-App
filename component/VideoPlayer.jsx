export default function VideoPlayer({ src }) {
  return (
    <div className="w-full">
      <video controls className="w-full max-h-[60vh] bg-black">
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
