import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-steel bg-coal py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="font-display text-4xl text-bone">vAI</p>
            <p className="mt-2 font-mono text-sm text-steel">
              AI PRODUCT STUDIO
            </p>
            <p className="mt-1 font-mono text-sm text-steel">
              A STUDIO OF{" "}
              <a
                href="https://xmzf.space"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bone underline decoration-acid underline-offset-4 transition-colors hover:text-acid"
              >
                XMZF Studio
              </a>
            </p>
          </div>
          <div className="flex flex-col gap-2 font-mono text-sm text-steel md:text-right">
            <a
              href="mailto:vai@xmzf.space"
              className="transition-colors hover:text-acid"
            >
              vai@xmzf.space
            </a>
            <a
              href="https://github.com/XMZF-vAI"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-start gap-2 transition-colors hover:text-acid md:justify-end"
            >
              <Github size={14} />
              github.com/XMZF-vAI
            </a>
            <span>© {new Date().getFullYear()} vAI. ALL RIGHTS RESERVED.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
