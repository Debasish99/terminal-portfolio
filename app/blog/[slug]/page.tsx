
"use client";
import { use, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Post {
  title: string;
  slug: string;
  content: string;
}

export default function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
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
      <main className="min-h-screen px-4 sm:px-6 py-8 sm:py-12 max-w-3xl mx-auto">
        <p className="text-green-400 animate-pulse">Loading content from secure server...</p>
      </main>
    );
  }

  if (!post) {
    return (
     <main className="
        min-h-screen
        px-4 sm:px-6
        py-8 sm:py-12
        max-w-3xl
        mx-auto
      ">

        <p className="text-red-400">
          Post not found: {slug}
        </p>
      </main>
    );
  }

  return (
   <main className="
        min-h-screen
        px-4 sm:px-6
        py-8 sm:py-12
        max-w-3xl
        mx-auto
      ">
      <div className="terminal-buttons-container">
        <span className="button close"></span>
        <span className="button minimize"></span>
        <span className="button maximize"></span>
      </div>
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-title">{post.title}</div>
        </div>
        <article className="prose prose-invert max-w-none blog-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
        </article>
      </div>
    </main>
  );
}
