import { useRef, useEffect } from "react";
import gsap from "gsap";

interface ServiceItemProps {
  number: string;
  title: string;
  description: string;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
}

export function ServiceItem({
  number,
  title,
  description,
  isActive,
  onHover,
  onLeave,
}: ServiceItemProps) {
  const descRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!descRef.current) return;
    gsap.to(descRef.current, {
      height: isActive ? "auto" : 0,
      opacity: isActive ? 1 : 0,
      duration: 0.4,
      ease: "power2.out",
    });
  }, [isActive]);

  return (
    <div
      className={`border-b border-steel py-8 transition-opacity duration-300 ${
        isActive ? "opacity-100" : "opacity-40 hover:opacity-70"
      }`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-start gap-6 md:items-center">
          <span className="font-mono text-sm text-acid">{number}</span>
          <div className="flex-1">
            <h3 className="font-display text-4xl uppercase text-bone md:text-6xl">
              {title}
            </h3>
            <p
              ref={descRef}
              className="overflow-hidden font-mono text-steel"
              style={{ height: 0, opacity: 0 }}
            >
              <span className="mt-4 inline-block max-w-2xl text-base leading-relaxed">
                {description}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
