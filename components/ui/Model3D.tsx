/*
 * Model3D.tsx — React Three Fiber wrapper for self-hosted .glb models.
 *
 * ⛔ NEVER IMPORT THIS FILE STATICALLY.
 * It drags THREE.js into the main bundle. Consumers MUST load it via
 * next/dynamic with { ssr: false } and a skeleton, e.g.:
 *
 *   const Model3D = dynamic(() => import("@/components/ui/Model3D"), {
 *     ssr: false,
 *     loading: () => <div className="animate-pulse ..." />,
 *   });
 *
 * The model loads only when it is within 200px of the viewport, and not at all
 * on weak devices (see gate below) — those render the static fallback image.
 */

"use client";

import { Component, Suspense, type ReactNode, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

type Model3DProps = {
  /** Path to a self-hosted, Meshopt-compressed .glb. */
  src: string;
  /** Static PNG shown while loading / when the model is unavailable. */
  fallbackImage: string;
  /** Radians per second of idle rotation. 0 for a static exhibit. */
  rotationSpeed?: number;
  className?: string;
};

/* ── device gate ────────────────────────────────────────────────────────────
 * The hero model is decorative. If the device can't render it smoothly, or the
 * user asked for less motion, show the fallback. Cheap check first (reduced
 * motion), then core count, then coarse-pointer small-screen.
 */
function useModelGating(): "loading" | "fallback" | "ok" {
  const [state, setState] = useState<"loading" | "fallback" | "ok">("loading");
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof navigator === "undefined" ||
      typeof IntersectionObserver === "undefined"
    ) {
      setState("fallback");
      return;
    }
    const cores = navigator.hardwareConcurrency ?? 8;
    if (cores > 0 && cores < 4) {
      setState("fallback");
      return;
    }
    const coarsePointer = window.matchMedia?.("(pointer: coarse)").matches ?? false;
    if (coarsePointer && window.innerWidth < 768) {
      setState("fallback");
      return;
    }
    setState("ok");
  }, []);
  return state;
}

/* ── the spinning model ───────────────────────────────────────────────────── */

function Model({ src, rotationSpeed }: { src: string; rotationSpeed: number }) {
  /*
   * CRITICAL — useGLTF(src, false, true)
   *   1st param: model path.
   *   2nd: useDraco — we pass `false`. drei defaults Draco to ON and then
   *        fetches its decoder from https://www.gstatic.com/draco/... — an
   *        external request the Phase 20 CSP will block (and one that only
   *        fails in production, never in local dev).
   *   3rd: useMeshopt — we pass `true`. Our models are Meshopt-compressed and
   *        its decoder ships inside three-stdlib (base64-wasm, bundled), so
   *        NOTHING is fetched from the network.
   * Do NOT "fix" this back to defaults.
   */
  const { scene } = useGLTF(src, false, true);
  const reducedMotion = useReducedMotion();
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (reducedMotion || rotationSpeed === 0) return;
    if (group.current) group.current.rotation.y += delta * rotationSpeed;
  });

  /* Dispose GPU resources when this Hero model unmounts. */
  useEffect(() => {
    return () => {
      scene.traverse((obj: THREE.Object3D) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.geometry?.dispose();
          const material = mesh.material as THREE.MeshStandardMaterial | undefined;
          if (material && typeof material === "object") {
            for (const value of Object.values(material)) {
              if (value && typeof value === "object" && "isTexture" in value) {
                (value as THREE.Texture).dispose();
              }
            }
          }
        }
      });
      useGLTF.clear(src);
    };
  }, [scene, src]);

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

/* ── error boundary: a missing/broken .glb must never break the page ──────── */

class ModelBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    /* The fallback image below is the graceful path; nothing to log here. */
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/* ── main component ───────────────────────────────────────────────────────── */

export default function Model3D({
  src,
  fallbackImage,
  rotationSpeed = 0.4,
  className,
}: Model3DProps) {
  const gate = useModelGating();
  const [inView, setInView] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  /* Mount the canvas only when the model is within 200px of the viewport. */
  useEffect(() => {
    const node = container.current;
    if (!node || gate === "fallback") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [gate]);

  const showModel = gate === "ok" && inView;
  const fallback = () => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={fallbackImage}
      alt=""
      aria-hidden
      className="h-full w-full object-contain"
    />
  );

  return (
    <div ref={container} className={className ?? "relative h-full w-full"}>
      {showModel ? (
        <ModelBoundary fallback={fallback()}>
          <Suspense fallback={fallback()}>
            <Canvas
              dpr={[1, 1.75]}
              camera={{ position: [0, 0, 5], fov: 40 }}
              gl={{ antialias: true, alpha: true }}
              style={{ position: "absolute", inset: 0 }}
            >
              <ambientLight intensity={0.9} />
              <directionalLight position={[4, 6, 5]} intensity={1.2} />
              <Model src={src} rotationSpeed={rotationSpeed} />
            </Canvas>
          </Suspense>
        </ModelBoundary>
      ) : (
        fallback()
      )}
    </div>
  );
}