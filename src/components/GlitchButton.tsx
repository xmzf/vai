import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface GlitchButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}

export function GlitchButton({
  children,
  onClick,
  type = "button",
  className = "",
}: GlitchButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

  const handleMouseEnter = () => {
    if (reduced || !ref.current) return;

    const tl = gsap.timeline();
    tl.to(ref.current, { x: -2, duration: 0.05 })
      .to(ref.current, { x: 2, duration: 0.05 })
      .to(ref.current, { x: -1, duration: 0.05 })
      .to(ref.current, { x: 1, duration: 0.05 })
      .to(ref.current, { x: 0, duration: 0.05 });

    gsap.fromTo(
      ref.current,
      { backgroundColor: "#0A0A0A", color: "#F4F1EA" },
      {
        backgroundColor: "#CCFF00",
        color: "#0A0A0A",
        duration: 0.1,
        repeat: 3,
        yoyo: true,
      }
    );
  };

  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      className={`relative overflow-hidden border-[3px] border-bone bg-coal px-8 py-4 font-mono text-sm font-bold uppercase tracking-widest text-bone transition-colors hover:bg-acid hover:text-coal ${className}`}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}
