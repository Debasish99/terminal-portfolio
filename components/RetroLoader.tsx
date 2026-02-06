"use client";

import { useEffect, useState } from "react";

export default function RetroLoader() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => {
      clearInterval(dotsInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0b0e14] text-[#4ade80] w-screen h-screen overflow-hidden" style={{ fontFamily: 'var(--font-vt), monospace' }}>
      <div className="text-3xl tracking-widest lowercase flex items-center justify-center">
        <span>Loading</span>
        <span className="inline-block w-[1.5em] text-left">{dots}</span>
      </div>
    </div>
  );
}
