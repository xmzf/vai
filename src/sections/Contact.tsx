import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GlitchButton } from "@/components/GlitchButton";
import { Footer } from "@/components/Footer";
import { Mail, ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const elements = sectionRef.current.querySelectorAll(".contact-reveal");
    gsap.set(elements, { y: 60, opacity: 0 });

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 70%",
      once: true,
      onEnter: () => {
        gsap.to(elements, {
          y: 0,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <section ref={sectionRef} id="contact" className="relative py-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            <div>
              <p className="contact-reveal font-mono text-sm uppercase tracking-widest text-acid">
                / CONTACT
              </p>
              <h2 className="contact-reveal mt-2 font-display text-display-lg uppercase text-bone">
                开始
              </h2>
              <h2 className="contact-reveal font-display text-display-lg uppercase text-bone">
                下一个项目
              </h2>
              <p className="contact-reveal mt-8 max-w-md font-mono text-base leading-relaxed text-steel">
                无论是生成式模型定制、智能体系统还是视觉合成，我们都期待与你探讨 AI 的边界。
              </p>

              <a
                href="mailto:hello@vai.studio"
                className="contact-reveal mt-8 inline-flex items-center gap-3 font-mono text-lg text-bone transition-colors hover:text-acid"
              >
                <Mail size={20} />
                hello@vai.studio
                <ArrowUpRight size={18} />
              </a>
            </div>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="contact-reveal space-y-6"
            >
              {submitted ? (
                <div className="border-[3px] border-acid bg-acid/10 p-8 text-center">
                  <p className="font-display text-3xl uppercase text-acid">消息已发送</p>
                  <p className="mt-2 font-mono text-sm text-steel">
                    我们会尽快与你联系。
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-steel">
                      姓名 / NAME
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full border-b-2 border-steel bg-transparent py-3 font-mono text-bone outline-none transition-colors focus:border-acid"
                      placeholder="你的名字"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-steel">
                      邮箱 / EMAIL
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full border-b-2 border-steel bg-transparent py-3 font-mono text-bone outline-none transition-colors focus:border-acid"
                      placeholder="hello@company.com"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-steel">
                      需求 / MESSAGE
                    </label>
                    <textarea
                      rows={4}
                      required
                      className="w-full resize-none border-b-2 border-steel bg-transparent py-3 font-mono text-bone outline-none transition-colors focus:border-acid"
                      placeholder="告诉我们你的项目..."
                    />
                  </div>
                  <div className="pt-4">
                    <GlitchButton type="submit">发送消息</GlitchButton>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
