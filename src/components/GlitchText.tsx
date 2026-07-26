import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  stagger?: number;
  duration?: number;
  onComplete?: () => void;
}

export function GlitchText({
  text,
  className = "",
  as: Tag = "span",
  delay = 0,
  stagger = 0.03,
  duration = 0.8,
  onComplete,
}: GlitchTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !containerRef.current) return;

    const chars = containerRef.current.querySelectorAll(".glitch-char");
    gsap.set(chars, { y: "120%", opacity: 0 });

    const tl = gsap.timeline({
      delay,
      onComplete,
    });

    tl.to(chars, {
      y: "0%",
      opacity: 1,
      duration,
      stagger,
      ease: "power4.out",
    });

    tl.to(
      chars,
      {
        x: "random(-2, 2)",
        duration: 0.05,
        stagger: {
          each: 0.02,
          from: "random",
        },
        yoyo: true,
        repeat: 3,
      },
      "-=0.3"
    );

    return () => {
      tl.kill();
    };
  }, [text, delay, stagger, duration, reduced, onComplete]);

  return (
    <Tag ref={containerRef as React.RefObject<HTMLHeadingElement>} className={`inline-block overflow-hidden ${className}`}>
      {text.split("").map((char, i) => (
        <span
          key={`${char}-${i}`}
          className="glitch-char inline-block will-change-transform"
          style={{ whiteSpace: char === " " ? "pre" : undefined }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </Tag>
  );
}
