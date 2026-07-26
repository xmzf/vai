import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Footer } from "@/components/Footer";
import { Mail, ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

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

  return (
    <>
      <section ref={sectionRef} id="contact" className="relative py-32">
        <div className="container mx-auto px-6">
          <div className="contact-reveal">
            <p className="font-mono text-sm uppercase tracking-widest text-acid">
              / CONTACT
            </p>
            <h2 className="mt-2 font-display text-display-lg uppercase text-bone">
              开始
            </h2>
            <h2 className="font-display text-display-lg uppercase text-bone">
              对话
            </h2>
            <p className="mt-8 max-w-md font-mono text-base leading-relaxed text-steel">
              想了解我们的项目，或者想和一群年轻的开发者聊聊 AI？
              随时给我们发邮件。
            </p>

            <a
              href="mailto:xmzfstudio@outlook.com"
              className="contact-reveal mt-8 inline-flex items-center gap-3 font-mono text-lg text-bone transition-colors hover:text-acid md:text-2xl"
            >
              <Mail size={24} />
              xmzfstudio@outlook.com
              <ArrowUpRight size={20} />
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
