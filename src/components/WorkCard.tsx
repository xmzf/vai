import { useRef, useState } from "react";
import gsap from "gsap";

interface WorkCardProps {
  title: string;
  category: string;
  year: string;
  image: string;
  index: number;
  onClick: () => void;
}

export function WorkCard({ title, category, year, image, index, onClick }: WorkCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(cardRef.current, {
      rotateY: x * 16,
      rotateX: -y * 16,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: "power3.out",
    });
  };

  return (
    <div
      ref={cardRef}
      className="group relative cursor-pointer"
      style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden border border-steel bg-void-2 transition-colors group-hover:border-acid">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-contain p-8 transition-transform duration-500 group-hover:scale-105"
          style={{
            filter: isHovered ? "saturate(100%) contrast(110%)" : "saturate(0%) contrast(100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(45deg, rgba(204,255,0,0.08) 0%, transparent 50%, rgba(255,42,42,0.08) 100%)",
            mixBlendMode: "overlay",
          }}
        />
        <div className="absolute left-0 top-0 bg-acid px-2 py-1 font-mono text-xs font-bold text-coal">
          {String(index + 1).padStart(2, "0")}
        </div>
      </div>
      <div className="mt-4 flex items-start justify-between">
        <div>
          <h3 className="font-display text-3xl uppercase text-bone transition-colors group-hover:text-acid">
            {title}
          </h3>
          <p className="mt-1 font-mono text-sm text-steel">{category}</p>
        </div>
        <span className="font-mono text-sm text-steel">{year}</span>
      </div>
    </div>
  );
}
