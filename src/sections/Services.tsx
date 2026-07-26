import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ServiceItem } from "@/components/ServiceItem";
import { CursorTag } from "@/components/CursorTag";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    number: "01",
    title: "生成式模型定制",
    description:
      "基于开源与商业大模型，针对品牌语料、产品知识与行业规范进行微调，打造专属生成能力。支持文本、图像、音频与多模态输出。",
    tag: "FINE-TUNING",
    color: "#CCFF00",
  },
  {
    number: "02",
    title: "智能体系统架构",
    description:
      "设计具备规划、记忆、工具调用与反思能力的 Agent 系统。打通 API、数据库与业务系统，让 AI 真正执行任务而非仅作回答。",
    tag: "AGENTIC AI",
    color: "#0055FF",
  },
  {
    number: "03",
    title: "视觉与影像合成",
    description:
      "从概念美术到动态影像，利用扩散模型与神经渲染技术生成高质量视觉内容。适用于广告、MV、游戏资产与虚拟场景。",
    tag: "SYNTHESIS",
    color: "#FF2A2A",
  },
  {
    number: "04",
    title: "AI 战略咨询",
    description:
      "帮助企业识别高价值落地场景，制定模型选型、数据治理与组织变革路线图，让 AI 投资转化为可衡量的业务增长。",
    tag: "STRATEGY",
    color: "#F4F1EA",
  },
];

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!sectionRef.current || !titleRef.current) return;

    const items = sectionRef.current.querySelectorAll(".service-wrapper");
    gsap.set(items, { x: -40, opacity: 0 });

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 70%",
      once: true,
      onEnter: () => {
        gsap.to(items, {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  const activeService = activeIndex !== null ? services[activeIndex] : null;

  return (
    <section ref={sectionRef} id="services" className="relative py-32">
      <CursorTag
        text={activeService?.tag || ""}
        active={activeIndex !== null}
        color={activeService?.color || "#CCFF00"}
      />

      <div className="container mx-auto px-6">
        <div ref={titleRef} className="mb-16 border-b border-steel pb-8">
          <p className="font-mono text-sm uppercase tracking-widest text-acid">/ SERVICES</p>
          <h2 className="mt-2 font-display text-display-lg uppercase text-bone">服务</h2>
        </div>
      </div>

      <div>
        {services.map((service, index) => (
          <div key={service.number} className="service-wrapper">
            <ServiceItem
              number={service.number}
              title={service.title}
              description={service.description}
              isActive={activeIndex === index}
              onHover={() => setActiveIndex(index)}
              onLeave={() => setActiveIndex(null)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
