import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CountUp } from "@/components/CountUp";
import { DraggableTags } from "@/components/DraggableTags";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { target: 128, suffix: "+", label: "交付项目" },
  { target: 4.2, suffix: "亿", label: "生成 token 数", decimals: 1 },
  { target: 36, suffix: "", label: "行业模型" },
  { target: 99.9, suffix: "%", label: "可用性 SLA", decimals: 1 },
];

export function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !textRef.current) return;

    const lines = textRef.current.querySelectorAll(".manifesto-line");
    gsap.set(lines, { y: 60, opacity: 0 });

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 70%",
      once: true,
      onEnter: () => {
        gsap.to(lines, {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      className="relative min-h-screen overflow-hidden py-32"
    >
      <div className="absolute inset-0 grid-bg opacity-30" />
      <DraggableTags />

      <div className="container relative mx-auto px-6">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div ref={textRef} className="space-y-2">
            <p className="manifesto-line font-mono text-sm uppercase tracking-widest text-acid">
              / MANIFESTO
            </p>
            <h2 className="manifesto-line font-display text-display-lg uppercase leading-none text-bone">
              我们不制造
            </h2>
            <h2 className="manifesto-line font-display text-display-lg uppercase leading-none text-bone">
              玩具式的 AI
            </h2>
            <p className="manifesto-line mt-8 max-w-md font-mono text-base leading-relaxed text-steel">
              vAI 深耕生成式模型、多模态智能体与视觉合成。我们相信，真正的人工智能不是炫技，
              而是能够嵌入业务肌理、重塑生产流程的基础设施。
            </p>
            <p className="manifesto-line max-w-md font-mono text-base leading-relaxed text-steel">
              从概念验证到企业级部署，我们用粗野的工程美学与精密的模型调优，
              为品牌打造可感知、可进化、可规模化的智能体验。
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 self-end">
            {stats.map((stat) => (
              <CountUp
                key={stat.label}
                target={stat.target}
                suffix={stat.suffix}
                decimals={stat.decimals}
                label={stat.label}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
