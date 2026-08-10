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
import { useGLTF, Center, Environment, Lightformer } from "@react-three/drei";
import { useReducedMotion, type MotionValue } from "framer-motion";
import * as THREE from "three";

type Model3DProps = {
  /** Path to a self-hosted, Meshopt-compressed .glb. */
  src: string;
  /** Static PNG shown while loading / when the model is unavailable. Omit to
      show the placeholder shimmer instead — never a stand-in object. */
  fallbackImage?: string;
  /** Radians per second of idle rotation. 0 for a static exhibit. */
  rotationSpeed?: number;
  /** External driver, usually a scroll-linked MotionValue in 0..1. While
      provided, the model's Y rotation is owned by it: 0..1 maps to
      `driverTurns` full turns, so every scroll pixel is a visible turn in
      true 3D under the perspective camera. Idle rotation continues on top
      after arrival. */
  spinDriver?: MotionValue<number>;
  /** Full turns the spinDriver covers over its 0..1 range. */
  driverTurns?: number;
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

    const evaluate = () => {
      const cores = navigator.hardwareConcurrency ?? 8;
      if (cores > 0 && cores < 4) return setState("fallback");
      const coarsePointer =
        window.matchMedia?.("(pointer: coarse)").matches ?? false;
      if (coarsePointer && window.innerWidth < 768) return setState("fallback");
      return setState("ok");
    };

    evaluate();

    /*
     * Re-evaluate on resize and orientation change.
     *
     * Running this once on mount meant the decision was frozen at whatever the
     * viewport happened to be when the page loaded. Rotate a tablet from
     * portrait to landscape, or drag a desktop window wider, and the model
     * stayed switched off for the rest of the session — the user crossed the
     * threshold and nothing noticed. A media query listener is the right
     * instrument here because it fires on exactly the transitions we care
     * about, rather than on every pixel of a drag.
     */
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => evaluate();
    mq.addEventListener("change", onChange);
    window.addEventListener("orientationchange", onChange);
    return () => {
      mq.removeEventListener("change", onChange);
      window.removeEventListener("orientationchange", onChange);
    };
  }, []);

  return state;
}

/* ── the spinning model ───────────────────────────────────────────────────── */

function Model({
  src,
  rotationSpeed,
  spinDriver,
  driverTurns,
}: {
  src: string;
  rotationSpeed: number;
  spinDriver?: MotionValue<number>;
  driverTurns?: number;
}) {
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
  const drift = useRef(0);
  const leanRef = useRef<THREE.Group>(null);
  const pointerX = useRef(0);
  const spinOffset = useRef(0);
  const lastDriver = useRef(0);

  /*
   * Pointer tracked at WINDOW level, not via R3F's state.pointer.
   *
   * The hero wrapper is pointer-events-none — it has to be, or the knight would
   * swallow clicks meant for the headline and CTA behind it. But that also means
   * the canvas never receives pointermove, so state.pointer would sit frozen at
   * 0 forever and the lean would never move. Listening on window sidesteps that
   * entirely and costs one passive listener.
   *
   * Only a ref is written — never state — so moving the mouse does not trigger a
   * single React re-render. The value is read inside useFrame, which is already
   * running every frame.
   */
  useEffect(() => {
    if (reducedMotion) return;
    const onMove = (e: PointerEvent) => {
      pointerX.current = (e.clientX / window.innerWidth) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reducedMotion]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g || reducedMotion) return;

    /* Scroll in progress? The pose freezes — no float, no idle spin — so the
       knight's angle is a pure function of scroll position while it travels.
       The float and idle turn resume the moment the visitor stops scrolling. */
    const d = spinDriver?.get() ?? 0;
    const moving = spinDriver ? Math.abs(d - lastDriver.current) >= 1e-4 : false;
    if (spinDriver) lastDriver.current = d;

    /* ── Anti-gravity float ────────────────────────────────────────────────
     * A sine on Y plus two much slower sines on X/Z tilt. Different periods
     * (1.1 / 0.7 / 0.9) so the axes never sync into an obvious loop — matched
     * periods are what make "floating" read as "bobbing on a spring".
     * Amplitudes are deliberately tiny: this should register as the object
     * being alive, not as an animation playing. While the visitor scrolls,
     * the float yields to a calm centred pose so the turn reads purely as a
     * scroll-driven rotation and the back-swing is exact; the float resumes,
     * seamlessly, the moment the scroll stops. */
    if (moving) {
      g.position.y = 0;
      g.rotation.x = 0;
      g.rotation.z = 0;
    } else {
      const t = state.clock.elapsedTime;
      g.position.y = Math.sin(t * 1.1) * 0.035;
      g.rotation.x = Math.sin(t * 0.7) * 0.045;
      g.rotation.z = Math.sin(t * 0.9) * 0.03;
    }

    /* ── Cursor lean ───────────────────────────────────────────────────────
     * state.pointer is already normalised to -1..1 across the canvas, so no
     * manual coordinate maths and no resize listener.
     *
     * Adapted, not copied: the brief this came from wanted a drone "menacingly
     * tracking" the visitor. A tax practice wants the opposite feeling, so the
     * knight only leans ~14° toward the pointer — enough that the piece feels
     * aware of you, not enough to feel watched.
     *
     * Damped with a frame-rate-independent exponential (1 - e^-kt). Lerping by
     * a fixed fraction per frame ties the speed to refresh rate: identical code
     * moves twice as fast on a 120Hz display. */
    const target = pointerX.current * 0.25;
    const k = 1 - Math.exp(-3.5 * delta);
    drift.current += (target - drift.current) * k;

    /* Idle rotation continues underneath, so the piece still turns when the
       pointer is still or absent — touch devices never fire pointer moves at
       all, and there the float plus idle spin carry the whole effect.

       With a spinDriver, scroll owns Y rotation (absolute, reversible — scroll
       up and the knight turns back). A small idle offset spins ON TOP only
       while the driver is still; the instant the driver moves again the offset
       decays exponentially, so during scroll the angle is (and returns to) a
       pure function of scroll position — the knight always lands back exactly
       where the scroll says, and keeps turning only when parked. */
    if (spinDriver) {
      const turns = driverTurns ?? 1;
      if (Math.abs(d - lastDriver.current) < 1e-4) {
        spinOffset.current += delta * rotationSpeed;
      } else {
        spinOffset.current *= Math.exp(-8 * delta);
      }
      g.rotation.y = d * Math.PI * 2 * turns + spinOffset.current;
    } else {
      g.rotation.y += delta * rotationSpeed;
    }

    /* The lean is applied to the PARENT group, not here. Both want rotation.y,
       and writing to one channel from two places means the last writer wins —
       the spin would erase the lean every frame. Parent holds the lean, child
       holds the spin, and the transforms compose. */
    if (leanRef.current) leanRef.current.rotation.y = drift.current;
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

  /* Centre the model on the origin so it rotates about its own axis rather
     than orbiting. Tripo exports sit on the ground plane (y: 0 → ~0.98), so
     without this the knight swings around a point beneath its feet. */
  return (
    <group ref={leanRef}>
      <group ref={group}>
        <Center>
          <primitive object={scene} />
        </Center>
      </group>
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
  spinDriver,
  driverTurns = 1,
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

  /* Never substitute a different object while the model loads or when the
     device gate decides against WebGL: an empty reserved box (or shimmer)
     keeps the knight the only thing that lives in this space. */
  const shimmer = () => (
    <div
      aria-hidden="true"
      className="h-full w-full animate-pulse rounded-full bg-[radial-gradient(circle_at_50%_45%,var(--rule),transparent_62%)] opacity-50"
    />
  );
  const fallback = () =>
    fallbackImage ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={fallbackImage}
        alt=""
        aria-hidden
        className="h-full w-full object-contain"
      />
    ) : (
      shimmer()
    );

  return (
    <div ref={container} className={className ?? "relative h-full w-full"}>
      {showModel ? (
        <ModelBoundary fallback={fallback()}>
          <Suspense fallback={fallback()}>
            <Canvas
              dpr={[1, 1.75]}
              camera={{ position: [0, 0, 2.7], fov: 35 }}
              gl={{ antialias: true, alpha: true }}
              style={{ position: "absolute", inset: 0 }}
            >
              {/* Brass is a METAL. A metallic PBR surface is almost entirely
                  reflection, so with lights alone and nothing to reflect it
                  renders near-black — which is exactly what happens without
                  this Environment.

                  drei's <Environment preset="..."> would fix it by fetching an
                  HDR from a CDN, which the Phase-20 Content Security Policy
                  blocks. Building the environment from <Lightformer>s instead
                  renders it into a local render target: same effect, zero
                  network requests, nothing for the CSP to reject. */}
              <Environment resolution={128}>
                <Lightformer
                  intensity={2.2}
                  position={[0, 3, 2]}
                  scale={[6, 6, 1]}
                  color="#fffaf0"
                />
                <Lightformer
                  intensity={1.1}
                  position={[-4, 1, 1]}
                  scale={[4, 6, 1]}
                  color="#e8e4d8"
                />
                <Lightformer
                  intensity={0.8}
                  position={[4, -1, -2]}
                  scale={[4, 4, 1]}
                  color="#cfc6b0"
                />
              </Environment>
              <ambientLight intensity={0.35} />
              <directionalLight position={[4, 6, 5]} intensity={1.1} />
              <Model
                src={src}
                rotationSpeed={rotationSpeed}
                spinDriver={spinDriver}
                driverTurns={driverTurns}
              />
            </Canvas>
          </Suspense>
        </ModelBoundary>
      ) : (
        fallback()
      )}
    </div>
  );
}