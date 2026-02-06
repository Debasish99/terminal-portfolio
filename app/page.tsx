"use client";
import './globals.css';

import { useBackground } from "@/lib/BackgroundContext";
import Terminal from "@/components/Terminal";

export default function Home() {
  const { bgFile, bgType, changeBg, loading } = useBackground();

  const handleCommand = (cmd: string) => {
    if (cmd === "chgbg") {
      return changeBg();
    }
    return null;
  };

  const whoAmIContent = (
    <div>
      <h1 className="text-xl text-green-400 mt-2">
        Debasish Lenka<span className="cursor">_</span>
      </h1>
      <p className="mt-2 text-gray-300">
        Still figuring out who I am.
      </p>
    </div>
  );

  return (
    <>
      <main
        className={`
          relative
          min-h-screen
          flex items-center justify-center px-6
          transition-opacity duration-1000
          ${loading ? 'opacity-0' : 'opacity-100'}
        `}
      >
        <div className=" w-full max-w-[85%] sm:max-w-[600px] md:max-w-[720px] lg:max-w-[800px] ">
          <div className="terminal-buttons-container">
            <span className="button close"></span>
            <span className="button minimize"></span>
            <span className="button maximize"></span>
          </div>
          {!loading && (
            <Terminal 
              title="debasish@home:~"
              onCommand={handleCommand}
              welcomeMessage={
                <>
                  <div className="mb-4">Welcome to my personal space. Type &apos;help&apos; for navigation.</div>
                  {whoAmIContent}
                </>
              }
            />
          )}
        </div>
      </main>
    </>
  );
}
