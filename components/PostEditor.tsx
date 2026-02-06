"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PostEditorProps {
  initialData?: {
    title: string;
    slug: string;
    content: string;
  };
  isEdit?: boolean;
}

export default function PostEditor({ initialData, isEdit }: PostEditorProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [subtitle, setSubtitle] = useState("");
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [published, setPublished] = useState(false);
  const router = useRouter();

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCoverImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCover = () => {
    setCoverImage(null);
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  useEffect(() => {
    if (!isEdit && title) {
      setSlug(title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
    }
  }, [title, isEdit]);

  const handleSave = async () => {
    setSaving(true);
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch('/api/posts', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, slug, content, coverImage }),
    });

    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      const err = await res.json();
      alert(err.error || "Failed to save post");
    }
    setSaving(false);
  };

  const insertMarkdown = (prefix: string, suffix: string = "") => {
    const textarea = document.getElementById('content-area') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selection = text.substring(start, end);
    const before = text.substring(0, start);
    const after = text.substring(end);

    setContent(before + prefix + selection + suffix + after);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-blue-500/20">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-20 border-b border-zinc-900">
        <div className="flex items-center gap-6">
          <Link href="/admin/dashboard" className="p-2 hover:bg-zinc-900 rounded-lg text-zinc-500 hover:text-white transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Editing Mode</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/10 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Publish"}
          </button>
        </div>
      </nav>

      {/* Editor Area */}
      <div className="max-w-4xl mx-auto pt-12 pb-32 px-8">
        <div className="space-y-8">
          {/* Metadata Controls */}
          <div className="flex items-center gap-3">
             <button 
               onClick={() => document.getElementById('cover-input')?.click()}
               className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md text-xs font-semibold text-zinc-500 hover:text-white transition-all">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Add Cover
             </button>
             <input 
               id="cover-input"
               type="file" 
               accept="image/*"
               onChange={handleCoverUpload}
               className="hidden"
             />
             <button 
               onClick={() => setShowSubtitle(!showSubtitle)}
               className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md text-xs font-semibold text-zinc-500 hover:text-white transition-all">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
                {showSubtitle ? "Hide Subtitle" : "Add Subtitle"}
             </button>
          </div>

          {/* Cover Image Preview */}
          {coverImage && (
            <div className="relative">
              <div className="relative w-full h-48 bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
                <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
              </div>
              <button
                onClick={removeCover}
                className="mt-2 text-xs px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 border border-red-600/40 rounded-md transition-all"
              >
                Remove Cover
              </button>
            </div>
          )}
          {showSubtitle && (
            <div className="relative">
              <input 
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Add a subtitle..."
                className="w-full text-xl text-zinc-300 placeholder-zinc-700 bg-transparent border-b border-zinc-800 focus:border-zinc-600 focus:ring-0 p-0 pb-2 tracking-tight focus:outline-none transition-colors"
                style={{ color: '#a1a1a1' }}
              />
            </div>
          )}

          {/* Title Section */}
          <div className="relative">
            <textarea 
              rows={1}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              placeholder="Article Title..."
              className="w-full text-5xl font-bold text-white placeholder-zinc-700 bg-transparent border-none focus:ring-0 p-0 tracking-tight resize-none overflow-hidden focus:outline-none"
              style={{ height: 'auto', color: '#ffffff' }}
            />
            {!isEdit && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">URL:</span>
                <span className="text-xs font-mono text-zinc-500 font-medium">/{slug || "..."}</span>
              </div>
            )}
          </div>

          {/* Markdown Toolbar */}
          <div className="flex items-center gap-1 p-1 bg-zinc-900/50 border border-zinc-800 rounded-lg backdrop-blur-sm sticky top-24 z-10 max-w-fit">
             <button onClick={() => insertMarkdown('# ', '')} className="p-2 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-white transition-all" title="H1">
               <span className="font-bold text-xs">H1</span>
             </button>
             <button onClick={() => insertMarkdown('**', '**')} className="p-2 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-white transition-all" title="Bold">
               <span className="font-bold text-xs">B</span>
             </button>
             <button onClick={() => insertMarkdown('_', '_')} className="p-2 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-white transition-all" title="Italic">
               <span className="italic font-serif text-xs">I</span>
             </button>
             <div className="w-px h-3 bg-zinc-800 mx-1"></div>
             <button onClick={() => insertMarkdown('[', '](url)')} className="p-2 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-white transition-all" title="Link">
               <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.103-1.103" /></svg>
             </button>
             <button onClick={() => insertMarkdown('```\n', '\n```')} className="p-2 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-white transition-all" title="Code Block">
               <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
             </button>
          </div>

          {/* Content Area */}
          <textarea 
            id="content-area"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder='Start writing your story... (Supports Markdown)'
            className="w-full min-h-[500px] text-lg leading-relaxed text-zinc-100 placeholder-zinc-700 bg-transparent border-none focus:ring-0 p-0 resize-none font-serif selection:bg-blue-500/10 focus:outline-none"
            style={{ color: '#f5f5f5' }}
          />
        </div>
      </div>

      {/* Footer Stats */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-[#0d0d0d] border border-zinc-800 rounded-lg flex items-center gap-4 shadow-xl">
        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{wordCount} Words</span>
        <div className="w-px h-3 bg-zinc-800"></div>
        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{(charCount / 1024).toFixed(1)} KB</span>
      </div>
    </div>
  );
}
