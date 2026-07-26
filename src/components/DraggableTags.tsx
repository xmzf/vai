import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const TAGS = [
  { text: "GENERATIVE", color: "#CCFF00" },
  { text: "VISION", color: "#0055FF" },
  { text: "AGENT", color: "#FF2A2A" },
  { text: "NEURAL", color: "#F4F1EA" },
  { text: "SYNTH", color: "#CCFF00" },
  { text: "LATENT", color: "#0055FF" },
  { text: "DIFFUSION", color: "#FF2A2A" },
  { text: "COGNITION", color: "#F4F1EA" },
];

interface TagItem {
  text: string;
  color: string;
  x: number;
  y: number;
  rotation: number;
}

export function DraggableTags() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [tags] = useState<TagItem[]>(() =>
    TAGS.map((t, i) => ({
      ...t,
      x: 60 + (i % 4) * 180 + Math.random() * 40,
      y: 80 + Math.floor(i / 4) * 140 + Math.random() * 40,
      rotation: (Math.random() - 0.5) * 20,
    }))
  );

  useEffect(() => {
    if (reduced || !containerRef.current) return;

    const items = containerRef.current.querySelectorAll(".draggable-tag");
    items.forEach((item, i) => {
      gsap.to(item, {
        rotation: `+=${(Math.random() - 0.5) * 10}`,
        duration: 3 + Math.random() * 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.2,
      });
    });
  }, [reduced]);

  const handleDrag = (e: React.MouseEvent | React.TouchEvent, index: number) => {
    if (reduced || !containerRef.current) return;

    const el = containerRef.current.querySelectorAll(".draggable-tag")[index] as HTMLElement;
    if (!el) return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const rect = containerRef.current.getBoundingClientRect();
    const startX = clientX - rect.left;
    const startY = clientY - rect.top;

    const onMove = (ev: MouseEvent | TouchEvent) => {
      const cx = "touches" in ev ? ev.touches[0].clientX : ev.clientX;
      const cy = "touches" in ev ? ev.touches[0].clientY : ev.clientY;
      gsap.to(el, {
        x: cx - rect.left - startX,
        y: cy - rect.top - startY,
        duration: 0.1,
        overwrite: "auto",
      });
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
  };

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden md:pointer-events-auto"
    >
      {tags.map((tag, i) => (
        <div
          key={tag.text}
          className="draggable-tag absolute cursor-grab select-none px-4 py-2 font-mono text-xs font-bold uppercase"
          style={{
            left: tag.x,
            top: tag.y,
            transform: `rotate(${tag.rotation}deg)`,
            color: tag.color,
            border: `1px solid ${tag.color}`,
            backgroundColor: "rgba(10,10,10,0.6)",
            mixBlendMode: "difference",
          }}
          onMouseDown={(e) => handleDrag(e, i)}
          onTouchStart={(e) => handleDrag(e, i)}
        >
          {tag.text}
        </div>
      ))}
    </div>
  );
}
