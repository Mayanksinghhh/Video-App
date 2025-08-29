'use client';
import { useState, useEffect } from 'react';

export default function LikeDislikeButtons({ videoId, initialLikes = [], initialDislikes = [] }) {
  const [likes, setLikes] = useState(initialLikes.length);
  const [dislikes, setDislikes] = useState(initialDislikes.length);
  const [userId, setUserId] = useState(null);

  useEffect(()=>{
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(payload.id || payload._id || null);
      } catch(e){}
    }
  },[]);

  async function action(type) {
    const token = localStorage.getItem('token');
    if (!token) return alert('Login first');
    const res = await fetch(`/api/videos/${videoId}/${type}`, {
      method: 'POST',
      headers: {'Content-Type':'application/json', 'Authorization':'Bearer '+token},
      body: JSON.stringify({ userId })
    });
    if (res.ok) {
      const data = await res.json();
      setLikes((data.video.likes||[]).length);
      setDislikes((data.video.dislikes||[]).length);
    } else {
      alert('Action failed');
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button onClick={()=>action('like')} className="px-3 py-1 border rounded">👍 {likes}</button>
      <button onClick={()=>action('dislike')} className="px-3 py-1 border rounded">👎 {dislikes}</button>
    </div>
  );
}
