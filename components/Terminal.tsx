"use client";


import { useState, useRef, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface Command {
  input: string;
  output: string | ReactNode;
}

interface TerminalProps {
  welcomeMessage?: string | ReactNode;
  onCommand?: (cmd: string) => string | ReactNode | void;
  title?: string;
  extraHelpCommands?: string[];
}

import { useBackground } from "@/lib/BackgroundContext";

export default function Terminal({ 
  welcomeMessage = "Welcome to the terminal.", 
  onCommand,
  title = "Terminal",
  extraHelpCommands = []
}: TerminalProps) {
  const [commands, setCommands] = useState<Command[]>([]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { changeBg } = useBackground();

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    
    const validPaths = ["/blog", "/about", "/resume", "/", "/admin/login"];
    
    if (trimmed === "clear") {
      setCommands([]);
      return;
    }

    if (trimmed === "chgbg") {
      const result = changeBg();
      setCommands((prev) => [...prev, { input: cmd, output: result }]);
      return;
    }

    if (trimmed === "home") {
      setCommands((prev) => [...prev, { input: cmd, output: "Navigating home..." }]);
      setTimeout(() => router.push("/"), 500);
      return;
    }

    if (trimmed === "blog") {
      setCommands((prev) => [...prev, { input: cmd, output: "Navigating to blog..." }]);
      setTimeout(() => router.push("/blog"), 500);
      return;
    }

    if (trimmed === "about") {
      setCommands((prev) => [...prev, { input: cmd, output: "Navigating to about..." }]);
      setTimeout(() => router.push("/about"), 500);
      return;
    }

    if (trimmed === "resume") {
      setCommands((prev) => [...prev, { input: cmd, output: "Navigating to resume..." }]);
      setTimeout(() => router.push("/resume"), 500);
      return;
    }

    if (trimmed.startsWith("go to ") || validPaths.includes(trimmed)) {
      const path = trimmed.startsWith("go to ") 
        ? trimmed.replace("go to ", "").trim() 
        : trimmed;
      
      if (validPaths.includes(path)) {
        setCommands((prev) => [...prev, { input: cmd, output: `Navigating to ${path}...` }]);
        setTimeout(() => router.push(path), 500);
        return;
      } else if (trimmed.startsWith("go to ")) {
        setCommands((prev) => [...prev, { input: cmd, output: `Error: Path '${path}' not found.` }]);
        return;
      }
    }

    if (trimmed === "help") {
      const helpOutput = (
        <div className="whitespace-pre">
          Available commands:
          {"\n"}help   - Show help message
          {"\n"}home   - Go to home page
          {"\n"}clear  - Clear terminal
          {"\n"}blog   - Go to blog page
          {"\n"}about  - Go to about page
          {"\n"}resume - Go to resume page
          {"\n"}chgbg  - Change background
          {extraHelpCommands.length > 0 && extraHelpCommands.map((c) => (
            <span key={c}>{"\n"}{c}</span>
          ))}
        </div>
      );
      setCommands((prev) => [...prev, { input: cmd, output: helpOutput }]);
      return;
    }

    // Default/Custom command handling
    let output: string | ReactNode = "";
    if (onCommand) {
      const customOutput = onCommand(trimmed);
      if (customOutput) output = customOutput;
    }

    if (!output && trimmed !== "") {
      output = `Command not found: ${cmd}. Type 'help' for available commands.`;
    }

    if (output || trimmed !== "") {
      setCommands((prev) => [...prev, { input: cmd, output }]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      executeCommand(input);
      setInput("");
    }
  };

  useEffect(() => {
    terminalRef.current?.scrollTo(0, terminalRef.current.scrollHeight);
  }, [commands]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="terminal-window">
      <div className="terminal-header">
        <div className="terminal-title">{title}</div>
      </div>
      <div className="terminal-content" ref={terminalRef}>
        <div className="blog-content">
          <div className="terminal-welcome">{welcomeMessage}</div>
          {commands.map((cmd, idx) => (
            <div key={idx} className="terminal-command-block">
              <div className="terminal-prompt">
                <span className="blog-prompt">$</span>
                <span className="terminal-input-text">{cmd.input}</span>
              </div>
              <div className="terminal-output">{cmd.output}</div>
            </div>
          ))}
          <form onSubmit={handleSubmit} className="terminal-input-form">
            <span className="blog-prompt">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="terminal-input"
              placeholder="Type a command..."
              autoFocus
            />
          </form>
        </div>
      </div>
    </div>
  );
}
