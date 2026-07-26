import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GlitchText } from "@/components/GlitchText";
import { Typewriter } from "@/components/Typewriter";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });

    tl.to(contentRef.current, {
      y: 120,
      opacity: 0.3,
      ease: "none",
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      <style>{`
        .hero-scanline {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(to bottom, transparent, #CCFF00, transparent);
          opacity: 0.8;
          animation: scan 2.5s ease-in-out infinite;
        }

        @keyframes scan {
          0% { top: -10%; opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { top: 110%; opacity: 0; }
        }

        .hero-glitch {
          position: relative;
          animation: text-glitch 4s infinite;
        }

        @keyframes text-glitch {
          0%, 90%, 100% { text-shadow: none; }
          91% { text-shadow: -3px 0 #FF2A2A, 3px 0 #0055FF; }
          92% { text-shadow: 3px 0 #FF2A2A, -3px 0 #0055FF; }
          93% { text-shadow: none; }
          94% { text-shadow: -2px 0 #FF2A2A, 2px 0 #0055FF; }
          95% { text-shadow: none; }
        }
      `}</style>

      <div ref={contentRef} className="container mx-auto flex h-full flex-col justify-center px-6 pt-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-[2px] w-12 bg-acid" />
              <span className="font-mono text-xs uppercase tracking-widest text-acid">
                GENERATIVE INTELLIGENCE STUDIO
              </span>
            </div>

            <div className="relative">
              <GlitchText
                text="vAI"
                as="h1"
                className="hero-glitch font-display text-display-xl text-bone"
                delay={0.5}
                stagger={0.15}
                duration={1}
              />
            </div>

            <div className="mt-6 max-w-xl">
              <Typewriter
                text="我们构建能够思考、生成与进化的智能系统。"
                className="font-mono text-lg text-steel md:text-xl"
                speed={50}
                delay={1500}
              />
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#works"
                className="inline-flex items-center border-[3px] border-bone bg-bone px-8 py-4 font-mono text-sm font-bold uppercase tracking-widest text-coal transition-colors hover:bg-acid hover:text-coal"
              >
                浏览作品
              </a>
              <a
                href="#contact"
                className="inline-flex items-center border-[3px] border-bone bg-transparent px-8 py-4 font-mono text-sm font-bold uppercase tracking-widest text-bone transition-colors hover:bg-bone hover:text-coal"
              >
                发起合作
              </a>
            </div>
          </div>

          <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
            <div className="relative h-48 w-48 md:h-64 md:w-64 lg:h-80 lg:w-80">
              <div className="absolute inset-0 overflow-hidden border-[3px] border-bone">
                <img
                  src="/logo.jpg"
                  alt="vAI Logo"
                  className="h-full w-full object-cover"
                  style={{
                    filter: "grayscale(100%) contrast(120%)",
                    clipPath: "inset(0 0 0 0)",
                  }}
                />
                <div className="hero-scanline" />
              </div>
              <div
                className="absolute -inset-4 -z-10 opacity-40"
                style={{
                  background:
                    "radial-gradient(circle, rgba(204,255,0,0.3) 0%, transparent 70%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-xs uppercase text-steel">SCROLL</span>
          <div className="h-12 w-[1px] bg-steel">
            <div className="h-1/2 w-full animate-bounce bg-acid" />
          </div>
        </div>
      </div>
    </section>
  );
}
