import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WorkCard } from "@/components/WorkCard";
import { X, ExternalLink, Github } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const works = [
  {
    title: "ClerkBox",
    category: "AI Agent · 桌面产品 · v1.6.0",
    year: "2026",
    image: "/clerkbox-icon.png",
    description:
      "把 AI 工程师装进桌面的单一 Agent 工作台。多模型即插即用、ReAct 工具循环、子 Agent 编排、Skills 技能市场、长期记忆与 VIBE 沉浸模式，全部本地运行，数据不出本机。",
    links: [
      { label: "官网", href: "https://clerkbox.xmzf.space", icon: "external" },
      { label: "GitHub", href: "https://github.com/XMZF-vAI/clerkbox", icon: "github" },
    ],
    tags: ["Electron", "React 19", "TypeScript", "ReAct", "本地优先"],
  },
  {
    title: "Zylo",
    category: "LLM · 研究作品 · Z1.3",
    year: "2026",
    image: "/zylo-icon.svg",
    description:
      "基于 Qwen3 微调的实验性语言模型，是团队学习 LLM 原理与微调 pipeline 的成果。Z1.3 版本持续迭代对齐、推理与效率，用于探索自有模型在对话、工具调用与创作场景中的表现边界。",
    links: [
      { label: "XMZF Studio", href: "https://xmzf.space", icon: "external" },
      { label: "团队 GitHub", href: "https://github.com/XMZF-vAI", icon: "github" },
    ],
    tags: ["Qwen3", "Fine-tuning", "LLM", "实验研究"],
  },
];

export function Works() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [activeWork, setActiveWork] = useState<(typeof works)[0] | null>(null);

  useEffect(() => {
    if (!sectionRef.current || !titleRef.current) return;

    const cards = sectionRef.current.querySelectorAll(".work-card");
    gsap.set(cards, { y: 80, opacity: 0 });

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 70%",
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveWork(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <section ref={sectionRef} id="works" className="relative py-32">
      <div className="container mx-auto px-6">
        <div
          ref={titleRef}
          className="mb-16 flex items-end justify-between border-b border-steel pb-8"
        >
          <div>
            <p className="font-mono text-sm uppercase tracking-widest text-acid">
              / PROJECTS
            </p>
            <h2 className="mt-2 font-display text-display-lg uppercase text-bone">
              项目
            </h2>
          </div>
          <a
            href="https://github.com/XMZF-vAI"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 font-mono text-sm text-steel transition-colors hover:text-acid md:flex"
          >
            <Github size={16} />
            XMZF-vAI
          </a>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {works.map((work, index) => (
            <div key={work.title} className="work-card">
              <WorkCard
                title={work.title}
                category={work.category}
                year={work.year}
                image={work.image}
                index={index}
                onClick={() => setActiveWork(work)}
              />
            </div>
          ))}
        </div>
      </div>

      {activeWork && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-coal/95 p-6 backdrop-blur-sm"
          onClick={() => setActiveWork(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-4xl overflow-auto border-[3px] border-bone bg-void-1 p-8 md:p-12"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveWork(null)}
              className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center border border-bone text-bone transition-colors hover:bg-alert hover:text-bone"
              aria-label="关闭"
            >
              <X size={24} />
            </button>

            <p className="font-mono text-sm uppercase tracking-widest text-acid">
              {activeWork.category}
            </p>
            <h3 className="mt-2 font-display text-5xl uppercase text-bone md:text-7xl">
              {activeWork.title}
            </h3>

            <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-start">
              <div className="flex h-32 w-32 flex-shrink-0 items-center justify-center border border-steel bg-void-2 p-4">
                <img
                  src={activeWork.image}
                  alt={activeWork.title}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex-1">
                <p className="max-w-2xl font-mono text-lg leading-relaxed text-steel">
                  {activeWork.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {activeWork.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-steel px-3 py-1 font-mono text-xs uppercase text-bone"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              {activeWork.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border-[3px] border-bone bg-bone px-6 py-3 font-mono text-sm font-bold uppercase tracking-widest text-coal transition-colors hover:bg-acid hover:text-coal"
                >
                  {link.icon === "github" ? <Github size={18} /> : <ExternalLink size={18} />}
                  {link.label}
                </a>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-4 border-t border-steel pt-6">
              <span className="font-mono text-sm text-steel">YEAR</span>
              <span className="font-mono text-sm text-bone">{activeWork.year}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
