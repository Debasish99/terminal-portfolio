"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"email" | "password">("email");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === "email") {
      setStep("password");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        const data = await res.json();
        setError(data.error || "Invalid credentials.");
        setStep("email");
        setEmail("");
        setPassword("");
      }
    } catch {
      setError("System error during authentication.");
      setStep("email");
      setEmail("");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0e14] flex items-center justify-center p-6 font-mono">
      <div className="w-full max-w-2xl">
        {/* Terminal Window */}
        <div className="terminal-buttons-container">
          <span className="button close"></span>
          <span className="button minimize"></span>
          <span className="button maximize"></span>
        </div>
        
        <div className="terminal-window">
          {/* Terminal Header */}
          <div className="terminal-header">
            <div className="terminal-title">admin@retro-blog:~</div>
          </div>

          {/* Terminal Content */}
          <div className="terminal-content">
            {/* Welcome Message */}
            <div className="terminal-welcome mb-8">
              <div className="text-green-400 mb-2">
                <span>Welcome to Retro Blog Admin</span>
              </div>
              <div className="text-gray-400 text-sm">
                Type your credentials to login.
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              {step === "email" && (
                <div className="terminal-input-form">
                  <span className="blog-prompt">$</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    className="terminal-input"
                    placeholder="login admin@retro.blog"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && email) {
                        (e.target as HTMLInputElement).form?.dispatchEvent(new Event('submit', { bubbles: true }));
                      }
                    }}
                  />
                </div>
              )}

              {/* Password Input */}
              {step === "password" && (
                <div>
                  <div className="terminal-command-block">
                    <div className="terminal-prompt">
                      <span className="blog-prompt">$</span>
                      <span className="terminal-input-text">login {email}</span>
                    </div>
                  </div>
                  <div className="terminal-input-form">
                    <span className="blog-prompt">$</span>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoFocus
                      className="terminal-input"
                      placeholder="••••••••"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && password) {
                          (e.target as HTMLInputElement).form?.dispatchEvent(new Event('submit', { bubbles: true }));
                        }
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="terminal-command-block">
                  <div className="terminal-prompt">
                    <span className="blog-prompt">$</span>
                    <span className="terminal-input-text">login {email}</span>
                  </div>
                  <div className="terminal-output">Authenticating<span className="animate-pulse">...</span></div>
                </div>
              )}
            </form>

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-3 border-l-2 border-red-500 bg-red-950/30 text-red-400 text-sm font-mono">
                <span className="text-red-500">error:</span> {error}
              </div>
            )}

            {/* Footer */}
            <div className="mt-16">
              <Link
                href="/"
                className="text-green-400 hover:text-green-300 transition-colors text-sm font-mono"
              >
                ← Return to Public Terminal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
