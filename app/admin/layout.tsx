"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { name: "Articles", path: "/admin/dashboard", icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" },
    { name: "New Draft", path: "/admin/new", icon: "M12 4v16m8-8H4" },
  ];

  const logoutUser = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  // Skip layout for login page
  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-[#050505] text-zinc-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-900 bg-[#080808] flex flex-col shrink-0">
        <div className="p-6 border-b border-zinc-900 sticky top-0 bg-[#080808] z-10">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-sm">
              R
            </div>
            <span className="font-bold tracking-tight text-white">RetroBlog Admin</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-3 mb-2 mt-4">Core</div>
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                pathname === item.path
                  ? "bg-zinc-900 text-white font-semibold shadow-sm"
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}

          <div className="pt-8 text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-3 mb-2">System</div>
          <Link href="/" className="flex items-center gap-3 px-3 py-2 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50 rounded-lg transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-sm">Public Site</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-zinc-900 bg-[#080808]">
          <button 
            onClick={logoutUser}
            className="flex items-center gap-3 px-3 py-2 w-full text-zinc-500 hover:text-white hover:bg-zinc-900/50 rounded-lg transition-all group"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-y-auto bg-[#050505]">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
