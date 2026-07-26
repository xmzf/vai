import { useEffect, useRef, Component, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GlitchText } from "@/components/GlitchText";
import { Typewriter } from "@/components/Typewriter";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

// WebGL 渲染失败时的静态 Logo 回退
function StaticLogo() {
  return (
    <div className="flex h-64 w-64 items-center justify-center overflow-hidden border-[3px] border-bone md:h-80 md:w-80">
      <img
        src="/logo.jpg"
        alt="vAI Logo"
        className="h-full w-full object-cover"
        style={{ filter: "grayscale(100%) contrast(120%)" }}
      />
    </div>
  );
}

// ErrorBoundary 包裹 WebGL 组件，失败时回退到静态图
class ErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

// 为立方体每个面生成带文字的 Canvas 纹理
function createFaceTexture(text: string, bg: string, fg: string, accent: string): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // 背景
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);

  // 网格线
  ctx.strokeStyle = "rgba(244,241,234,0.08)";
  ctx.lineWidth = 1;
  const grid = 64;
  for (let i = 0; i <= size; i += grid) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(size, i);
    ctx.stroke();
  }

  // 边框
  ctx.strokeStyle = accent;
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, size - 6, size - 6);

  // 角标
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, 60, 60);
  ctx.fillRect(size - 60, 0, 60, 60);
  ctx.fillRect(0, size - 60, 60, 60);
  ctx.fillRect(size - 60, size - 60, 60, 60);

  // 主文字
  ctx.fillStyle = fg;
  ctx.font = "bold 200px Anton, Impact, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, size / 2, size / 2);

  // 底部小字
  ctx.font = "20px 'Space Mono', monospace";
  ctx.fillStyle = "rgba(244,241,234,0.4)";
  ctx.fillText("vAI · XMZF", size / 2, size - 50);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// 立方体各面：+X, -X, +Y, -Y, +Z, -Z
const FACE_CONFIGS = [
  { text: "v", bg: "#0A0A0A", fg: "#F4F1EA", accent: "#CCFF00" },
  { text: "A", bg: "#0A0A0A", fg: "#F4F1EA", accent: "#0055FF" },
  { text: "I", bg: "#0A0A0A", fg: "#F4F1EA", accent: "#FF2A2A" },
  { text: "XMZF", bg: "#0A0A0A", fg: "#CCFF00", accent: "#F4F1EA" },
  { text: "vAI", bg: "#0A0A0A", fg: "#CCFF00", accent: "#CCFF00" },
  { text: "STUDIO", bg: "#0A0A0A", fg: "#F4F1EA", accent: "#0055FF" },
];

// 共享的拖拽状态（在 Canvas 外部创建，传给内部组件）
interface DragState {
  isDragging: boolean;
  lastX: number;
  lastY: number;
  rotX: number;
  rotY: number;
}

// Canvas 内部的立方体组件（可以使用 useFrame）
function CubeMesh({
  dragState,
  reduced,
  materials,
}: {
  dragState: React.MutableRefObject<DragState>;
  reduced: boolean;
  materials: THREE.MeshStandardMaterial[];
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (!dragState.current.isDragging && !reduced) {
      // 自动缓慢旋转
      groupRef.current.rotation.y += delta * 0.3;
      groupRef.current.rotation.x += delta * 0.08;
    } else {
      // 拖拽时同步外部旋转值
      groupRef.current.rotation.x = dragState.current.rotX;
      groupRef.current.rotation.y = dragState.current.rotY;
    }

    if (meshRef.current) {
      // 轻微呼吸缩放
      const scale = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} material={materials}>
        <boxGeometry args={[2.4, 2.4, 2.4]} />
      </mesh>
      {/* 边缘线框 */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(2.42, 2.42, 2.42)]} />
        <lineBasicMaterial color="#CCFF00" linewidth={2} />
      </lineSegments>
    </group>
  );
}

function LogoCube({ reduced }: { reduced: boolean }) {
  const dragState = useRef<DragState>({
    isDragging: false,
    lastX: 0,
    lastY: 0,
    rotX: 0,
    rotY: 0,
  });

  // 生成六个面的材质
  const faceMaterials = FACE_CONFIGS.map((cfg) => {
    const texture = createFaceTexture(cfg.text, cfg.bg, cfg.fg, cfg.accent);
    return new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.4,
      metalness: 0.6,
    });
  });

  const handlePointerDown = (e: React.PointerEvent) => {
    if (reduced) return;
    dragState.current.isDragging = true;
    dragState.current.lastX = e.clientX;
    dragState.current.lastY = e.clientY;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState.current.isDragging || reduced) return;
    const dx = e.clientX - dragState.current.lastX;
    const dy = e.clientY - dragState.current.lastY;
    dragState.current.rotY += dx * 0.01;
    dragState.current.rotX += dy * 0.01;
    dragState.current.lastX = e.clientX;
    dragState.current.lastY = e.clientY;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    dragState.current.isDragging = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  return (
    <div
      className="relative h-full w-full cursor-grab active:cursor-grabbing"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={Math.min(window.devicePixelRatio, 2)}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
        <pointLight position={[-5, -5, -5]} intensity={0.4} color="#CCFF00" />
        <CubeMesh dragState={dragState} reduced={reduced} materials={faceMaterials} />
      </Canvas>
    </div>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

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
          z-index: 5;
          pointer-events: none;
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

        .cube-container::before {
          content: "";
          position: absolute;
          inset: -20%;
          background: radial-gradient(circle, rgba(204,255,0,0.15) 0%, transparent 70%);
          pointer-events: none;
        }
      `}</style>

      <div ref={contentRef} className="container mx-auto flex h-full flex-col justify-center px-6 pt-20">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="order-2 lg:order-1">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-[2px] w-12 bg-acid" />
              <span className="font-mono text-xs uppercase tracking-widest text-acid">
                AI PRODUCT STUDIO
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
                text="我们是一群年轻的开发者，在 XMZF Studio 旗下打造实用的 AI 产品。"
                className="font-mono text-base text-steel md:text-lg"
                speed={50}
                delay={1500}
              />
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#works"
                className="inline-flex items-center border-[3px] border-bone bg-bone px-8 py-4 font-mono text-sm font-bold uppercase tracking-widest text-coal transition-colors hover:bg-acid hover:text-coal"
              >
                浏览项目
              </a>
              <a
                href="#contact"
                className="inline-flex items-center border-[3px] border-bone bg-transparent px-8 py-4 font-mono text-sm font-bold uppercase tracking-widest text-bone transition-colors hover:bg-bone hover:text-coal"
              >
                联系我们
              </a>
            </div>
          </div>

          <div className="cube-container order-1 flex h-[280px] w-full justify-center sm:h-[360px] lg:order-2 lg:h-[460px] lg:w-auto">
            {reduced ? (
              <div className="flex h-64 w-64 items-center justify-center overflow-hidden border-[3px] border-bone md:h-80 md:w-80">
                <img
                  src="/logo.jpg"
                  alt="vAI Logo"
                  className="h-full w-full object-cover"
                  style={{ filter: "grayscale(100%) contrast(120%)" }}
                />
                <div className="hero-scanline" />
              </div>
            ) : (
              <ErrorBoundary fallback={<StaticLogo />}>
                <LogoCube reduced={reduced} />
              </ErrorBoundary>
            )}
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
