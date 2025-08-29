'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return alert('Select a video first');
    setUploading(true);
    setProgress(0);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);

    const token = localStorage.getItem('token');
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/videos/upload', true);
    if (token) xhr.setRequestHeader('Authorization', 'Bearer ' + token);

    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable) {
        setProgress(Math.round((ev.loaded / ev.total) * 100));
      }
    };
    xhr.onload = () => {
      setUploading(false);
      if (xhr.status === 201) {
        const res = JSON.parse(xhr.responseText);
        alert('Uploaded: ' + res.video._id);
        setFile(null); setTitle(''); setDescription(''); setProgress(0);
      } else {
        alert('Upload failed');
      }
    };
    xhr.onerror = () => { setUploading(false); alert('Upload error'); };
    xhr.send(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input type="text" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
      <Input type="text" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
      <input type="file" accept="video/*" onChange={e=>setFile(e.target.files[0])} className="w-full text-white" />
      {uploading && <div className="w-full"><Progress value={progress} className="w-full" /><p className="text-sm">{progress}%</p></div>}
      <Button type="submit" disabled={uploading}>Upload</Button>
    </form>
  );
}
