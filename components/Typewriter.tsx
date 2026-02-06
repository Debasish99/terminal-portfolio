"use client";

import { useEffect, useRef, useState } from "react";

export default function Typewriter({
  text,
  speed = 20,
  onComplete,
}: {
  text: string;
  speed?: number;
  onComplete?: () => void;
}) {
  const [displayed, setDisplayed] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Reset displayed text when text prop changes
    setDisplayed("");
    
    let i = 0;
    intervalRef.current = setInterval(() => {
      setDisplayed((prev) => prev + text.charAt(i));
      i++;

      if (i >= text.length) {
        clearInterval(intervalRef.current!);
        onComplete?.();
      }
    }, speed);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [text, speed, onComplete]);

  return <span>{displayed}</span>;
}
