import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useMousePosition } from "@/hooks/useMousePosition";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  varying vec2 vUv;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(st);
      st *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 st = vUv * 3.0;
    vec2 mouseInfluence = (uMouse * 0.5 + 0.5) * 0.3;
    float t = uTime * 0.15;

    float n = fbm(st + t + mouseInfluence);
    float n2 = fbm(st * 1.5 - t * 0.7 + mouseInfluence * 2.0);

    float pattern = smoothstep(0.3, 0.7, n * n2);
    vec3 color1 = vec3(0.039, 0.039, 0.039);
    vec3 color2 = vec3(0.08, 0.08, 0.08);
    vec3 color = mix(color1, color2, pattern);

    gl_FragColor = vec4(color, 1.0);
  }
`;

function NoisePlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouse = useMousePosition();
  const reduced = useReducedMotion();
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    }),
    []
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const material = meshRef.current.material as THREE.ShaderMaterial;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    if (!reduced) {
      material.uniforms.uMouse.value.x += (mouse.normalizedX - material.uniforms.uMouse.value.x) * 0.05;
      material.uniforms.uMouse.value.y += (mouse.normalizedY - material.uniforms.uMouse.value.y) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export function NoiseBackground() {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className="fixed inset-0 -z-10 bg-coal grid-bg" />;
  }

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        gl={{ antialias: false, alpha: false }}
        dpr={Math.min(window.devicePixelRatio, 1.5)}
      >
        <NoisePlane />
      </Canvas>
    </div>
  );
}
