"use client";

import { useEffect } from "react";

/**
 * TEMPORARY BLOG REDIRECT - SCENARIO
 * 
 * Status: Using external blog until local blog features are fully implemented
 * External URL: https://debasishlenka.in/
 * 
 * TODO: Uncomment the original blog code below when ready to:
 * 1. Finish implementing all blog features (tags, categories, comments, etc)
 * 2. Migrate all content from external blog to local database
 * 3. Test thoroughly with all posts
 * 
 * For now: All /blog requests redirect to external blog
 * 
 * ORIGINAL BLOG CODE (REMOVED TO AVOID SYNTAX ERRORS):
 * - The original blog component with Post interface
 * - GRADIENT_COLORS array for card styling
 * - Blog post fetching logic
 * - Search and filter functionality
 * - Blog grid layout with cards
 * - Read time calculation
 * - Excerpt generation
 * 
 * To restore: Check git history for the original app/blog/page.tsx file
 */

export default function BlogList() {
  useEffect(() => {
    // Redirect to external blog
    window.location.href = "https://debasishlenka.in/";
  }, []);

  // Fallback loading state while redirect happens
  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mb-4"></div>
        <p className="text-green-400 font-mono text-lg">Redirecting to blog...</p>
        <p className="text-zinc-500 text-sm mt-4">
          If not redirected, <a href="https://debasishlenka.in/" className="text-green-400 hover:underline">click here</a>
        </p>
      </div>
    </main>
  );
}

