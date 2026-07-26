import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface TypewriterProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  showCursor?: boolean;
}

export function Typewriter({
  text,
  className = "",
  speed = 60,
  delay = 0,
  showCursor = true,
}: TypewriterProps) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setDisplayed(text);
      return;
    }

    const startTimeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimeout);
  }, [delay, reduced, text]);

  useEffect(() => {
    if (!started || reduced) return;

    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i += 1;
      if (i >= text.length) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, [started, text, speed, reduced]);

  return (
    <span className={className}>
      {displayed}
      {showCursor && <span className="animate-pulse text-acid">_</span>}
    </span>
  );
}
