import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface CountUpProps {
  target: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
  label?: string;
}

export function CountUp({
  target,
  suffix = "",
  prefix = "",
  decimals = 0,
  className = "",
  label,
}: CountUpProps) {
  const ref = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(prefix + "0" + suffix);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!ref.current || !valueRef.current) return;

    if (reduced) {
      setDisplay(prefix + target.toFixed(decimals) + suffix);
      return;
    }

    const obj = { value: 0 };
    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          value: target,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => {
            setDisplay(prefix + obj.value.toFixed(decimals) + suffix);
          },
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [target, prefix, suffix, decimals, reduced]);

  return (
    <div ref={ref} className={`flex flex-col ${className}`}>
      <span ref={valueRef} className="font-display text-display-md text-bone">
        {display}
      </span>
      {label && <span className="mt-2 font-mono text-sm uppercase text-steel">{label}</span>}
    </div>
  );
}
