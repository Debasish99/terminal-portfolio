"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Post {
  title: string;
  slug: string;
  date: string;
  content?: string;
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => {
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setPosts(data);
          setLoading(false);
        }
      });
  }, [router]);

  const handleDelete = async (slug: string) => {
    if (!confirm(`Are you sure you want to delete "${slug}"?`)) return;

    const res = await fetch(`/api/posts?slug=${slug}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setPosts(posts.filter(p => p.slug !== slug));
    } else {
      alert("Failed to delete post");
    }
  };

  const logoutUser = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-400 font-medium tracking-wide">Initializing Core...</p>
        </div>
      </div>
    );
  }

  const totalWords = posts.reduce((acc, p) => acc + (p.content?.split(/\s+/).length || 0), 0);
  const lastUpdate = posts.length > 0 
    ? new Date(Math.max(...posts.map(p => new Date(p.date).getTime()))).toLocaleDateString() 
    : "N/A";

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight">Content Center</h1>
              <p className="text-zinc-500 text-sm mt-2">Manage your articles and digital stream.</p>
            </div>
            <div className="flex flex-col xs:flex-row items-start gap-2 shrink-0">
              <Link href="/admin/new" className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-blue-500/20 active:scale-95 whitespace-nowrap">
                New Post
              </Link>
              <button 
                onClick={logoutUser}
                className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 text-xs font-bold rounded-lg transition-all border border-red-600/40 active:scale-95 whitespace-nowrap"
              >
                Logout
              </button>
            </div>
          </header>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-zinc-800/50 shadow-sm">
           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">Total Articles</p>
           <p className="text-3xl font-bold text-white tracking-tight">{posts.length}</p>
        </div>
        <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-zinc-800/50 shadow-sm">
           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">Word Inventory</p>
           <p className="text-3xl font-bold text-white tracking-tight">{totalWords.toLocaleString()}</p>
        </div>
        <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-zinc-800/50 shadow-sm sm:col-span-2 lg:col-span-1">
           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">Last Deployment</p>
           <p className="text-3xl font-bold text-white tracking-tight">{lastUpdate}</p>
        </div>
      </div>

      {/* Main List */}
      <section className="bg-[#0d0d0d] border border-zinc-800/50 rounded-2xl overflow-hidden shadow-xl shadow-black/20">
        <div className="px-8 py-5 border-b border-zinc-800/50 bg-[#111111]/50">
          <h2 className="font-black text-zinc-500 text-[10px] uppercase tracking-[0.2em]">Article Archive</h2>
        </div>

        <div className="divide-y divide-zinc-900">
          {posts.map(post => (
            <div key={post.slug} className="px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#111111]/40 transition-colors group">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold text-zinc-100 group-hover:text-white transition-colors truncate tracking-tight">
                  {post.title}
                </h3>
                <div className="flex items-center gap-3 mt-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-900 text-zinc-500 border border-zinc-800 group-hover:border-zinc-700 transition-colors">/{post.slug}</span>
                  <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{new Date(post.date).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link href={`/admin/edit/${post.slug}`} className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-all active:scale-95">
                  Edit
                </Link>
                <button 
                  onClick={() => handleDelete(post.slug)}
                  className="px-4 py-2 text-xs font-bold text-red-500/70 hover:text-red-400 hover:bg-red-500/10 border border-transparent rounded-xl transition-all active:scale-95"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {posts.length === 0 && (
            <div className="py-24 text-center">
              <p className="text-zinc-500 text-sm font-bold mb-6 uppercase tracking-widest">No articles found in your archive.</p>
              <Link href="/admin/new" className="inline-flex items-center gap-2 text-blue-500 text-sm font-black hover:text-blue-400 transition-colors uppercase tracking-widest">
                Create your first post <span className="text-lg">→</span>
              </Link>
            </div>
          )}
        </div>
      </section>
        </div>
      </div>
    </div>
  );
}
