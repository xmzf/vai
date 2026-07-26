import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Menu, X } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { label: "宣言", href: "#manifesto" },
  { label: "作品", href: "#works" },
  { label: "服务", href: "#services" },
  { label: "联系", href: "#contact" },
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!menuRef.current) return;

    if (open) {
      document.body.style.overflow = "hidden";
      gsap.fromTo(
        menuRef.current,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 0.6, ease: "power4.inOut" }
      );
      gsap.fromTo(
        menuRef.current.querySelectorAll(".menu-link"),
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, delay: 0.2, ease: "power3.out" }
      );
    } else {
      document.body.style.overflow = "";
      gsap.to(menuRef.current, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.5,
        ease: "power4.inOut",
      });
    }
  }, [open]);

  const handleLinkClick = (href: string) => {
    setOpen(false);
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed left-0 right-0 top-0 z-50 transition-colors duration-300 ${
          scrolled ? "bg-coal/90 backdrop-blur-sm" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto flex h-20 items-center justify-between px-6">
          <a href="#" className="font-display text-3xl text-bone">
            vAI
          </a>
          <button
            onClick={() => setOpen(true)}
            className="flex h-12 w-12 items-center justify-center border border-bone text-bone transition-colors hover:bg-acid hover:text-coal"
            aria-label="打开菜单"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      <div
        ref={menuRef}
        className="fixed inset-0 z-[60] flex flex-col justify-between bg-coal px-6 py-8"
        style={{ clipPath: "inset(0 0 100% 0)" }}
      >
        <div className="flex justify-end">
          <button
            onClick={() => setOpen(false)}
            className="flex h-12 w-12 items-center justify-center border border-bone text-bone transition-colors hover:bg-alert hover:text-bone"
            aria-label="关闭菜单"
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleLinkClick(link.href)}
              className="menu-link text-left font-display text-display-lg uppercase text-bone transition-colors hover:text-acid"
            >
              {link.label}
            </button>
          ))}
        </div>
        <div className="menu-link font-mono text-sm text-steel">
          © {new Date().getFullYear()} vAI STUDIO
        </div>
      </div>
    </>
  );
}
