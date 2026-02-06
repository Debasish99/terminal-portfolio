"use client";

import { useState, useCallback } from "react";
import Terminal from "@/components/Terminal";
import Typewriter from "@/components/Typewriter";
import { useBackground } from "@/lib/BackgroundContext";

export default function AboutPage() {
  const { loading } = useBackground();
  const [typingDone, setTypingDone] = useState(false);
  
  const handleTypingComplete = useCallback(() => {
    setTypingDone(true);
  }, []);

  const aboutText = `

Hey, I’m Debasish 👋
I work with Windows & Linux servers, VMware, networking, and cloud infrastructure, and I love figuring out how systems actually work behind the scenes.

I enjoy exploring internals — authentication, directory services, virtualization, security, and performance tuning. Most of my learning comes from building, breaking, and fixing real setups.

Outside of tech, I’m into photography, mostly capturing emotions, patterns, and small details people usually miss.

I also enjoy vibe coding — quickly turning ideas into working tools, experimenting with UI, and building projects focused on automation and system visibility. This terminal-style portfolio is one of those experiments.

Curious. Always building.

`;

  return (
    <>
      <main className={`
        relative
        min-h-screen
        flex items-center justify-center
        px-2
        transition-opacity duration-1000
        ${loading ? 'opacity-0' : 'opacity-100'}
      `}
      >
          <div
              className="
                            w-full
                            max-h-full
                            flex flex-col
                            max-w-[85%]
                          "
          >
      <div className="terminal-buttons-container">
        <span className="button close"></span>
        <span className="button minimize"></span>
        <span className="button maximize"></span>
      </div>

      {!loading && (
        <Terminal
          title="debasish@about:~"
          welcomeMessage={
            <div>
              <div className="mb-3 text-gray-300">Type &apos;help&apos; for navigation.</div>

              <pre className="text-gray-300 whitespace-pre-wrap font-mono">
                <Typewriter
                  text={aboutText}
                  speed={20}
                  onComplete={handleTypingComplete}
                />
              </pre>


            </div>
          }
        />
      )}
      </div>
    </main>
    </>
  );
}
