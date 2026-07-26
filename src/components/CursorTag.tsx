import { useEffect, useRef } from "react";
import gsap from "gsap";

interface CursorTagProps {
  text: string;
  active: boolean;
  color?: string;
}

export function CursorTag({ text, active, color = "#CCFF00" }: CursorTagProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    gsap.to(ref.current, {
      opacity: active ? 1 : 0,
      scale: active ? 1 : 0.8,
      duration: 0.2,
      ease: "power2.out",
    });
  }, [active, text]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      gsap.to(ref.current, {
        x: e.clientX + 16,
        y: e.clientY + 16,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed left-0 top-0 z-[100] -translate-x-1/2 -translate-y-1/2 opacity-0"
      style={{ color }}
    >
      <span
        className="inline-block border px-3 py-1 font-mono text-xs uppercase"
        style={{ borderColor: color, backgroundColor: "rgba(10,10,10,0.9)" }}
      >
        {text}
      </span>
    </div>
  );
}
