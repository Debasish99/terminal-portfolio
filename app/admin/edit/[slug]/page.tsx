"use client";

import { useEffect, useState, use } from "react";
import PostEditor from "@/components/PostEditor";

interface Post {
  title: string;
  slug: string;
  content: string;
}

export default function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data: Post[]) => {
        const found = data.find((p) => p.slug === slug);
        setPost(found || null);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-400 font-medium tracking-wide">Syncing Archive...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
        <div className="text-center p-12 bg-[#0d0d0d] rounded-[2.5rem] border border-zinc-800 shadow-2xl max-w-md w-full">
          <div className="text-red-500 text-5xl mb-6">✕</div>
          <h2 className="text-2xl font-black text-white mb-3 tracking-tight">Post Not Found</h2>
          <p className="text-zinc-500 mb-8 font-medium">The article you are trying to edit does not exist or has been removed from the archive.</p>
          <button onClick={() => window.history.back()} className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-2xl transition-all uppercase tracking-widest text-xs">
            &larr; Return to Safety
          </button>
        </div>
      </div>
    );
  }

  return <PostEditor initialData={post} isEdit />;
}
