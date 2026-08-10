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
  /** Fired once the model has actually rendered its first frame. Lets a boot
      sequence hold until the knight is really there — so the reveal never
      catches a shimmer or a pop-in. Not fired when the device gate or an
      error substitutes the fallback. */
  onReady?: () => void;
  /** Boot-fill driver in 0..1. When provided the model is rendered as a faint
      ghost plus a solid copy clipped at a rising plane, so the piece appears to
      fill itself from the feet up. Reads the MotionValue inside useFrame — no
      re-renders. Omit for a plain static/spinning model. */
  fill?: MotionValue<number>;
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
      /*
       * Phones DO get the knight.
       *
       * This used to bail out on any coarse pointer under 768px, which switched
       * the model off for every phone on earth — and the knight is now the boot
       * screen's centrepiece and the chat button, so the whole opening sequence
       * silently did not exist on mobile. A 673 KB Meshopt model at 97k tris is
       * within reach of any phone that can run a modern browser; what it cannot
       * afford is the desktop pixel budget, so Model3D drops dpr instead of
       * dropping the model (see the Canvas dpr below).
       *
       * The only remaining bail-out is genuine hardware weakness — under four
       * cores — which the cores check above already covers.
       */
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
  onReady,
  fill,
}: {
  src: string;
  rotationSpeed: number;
  spinDriver?: MotionValue<number>;
  driverTurns?: number;
  onReady?: () => void;
  fill?: MotionValue<number>;
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
  /* One-shot readiness: fires on the model's first rendered frame, even under
     reduced motion (the useFrame bails early there but the model is up). */
  const ready = useRef(false);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  /* ── boot-fill layers ─────────────────────────────────────────────────────
   * With a `fill` driver the model is built twice from the same geometry: a
   * faint frosted "ghost" of the whole knight, plus a solid brass copy clipped
   * at a horizontal plane that rises from the feet. The clip planes are LOCAL
   * (renderer.localClippingEnabled) and per-mesh, expressed in each mesh's own
   * geometry space — so the level is always "feet + f × height" no matter what
   * node translations the GLB carries, and it follows the model through the
   * centering offset, float, lean and spin. Updated per-frame from the
   * MotionValue: a pure GPU effect, no per-frame React work. When the fill
   * hits 1 the ghost hides and the result is pixel-identical to the un-filled
   * path. */
  const ghostLayer = useRef<THREE.Group>(null);
  const fillLayer = useRef<THREE.Group>(null);
  const meshPlanes = useRef<{ plane: THREE.Plane; min: number; height: number }[]>(
    [],
  );
  const layersBuilt = useRef(false);

  useEffect(() => {
    if (
      !fill ||
      layersBuilt.current ||
      !ghostLayer.current ||
      !fillLayer.current
    )
      return;
    layersBuilt.current = true;

    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3()
      .addVectors(box.min, box.max)
      .multiplyScalar(0.5);

    /* Clones share the GLB's geometries (never re-uploaded) but get their own
       material instances — one frosted ghost, one clipped brass. */
    const makeLayer = (ghost: boolean) => {
      const layer = scene.clone(true);
      layer.traverse((obj: THREE.Object3D) => {
        const mesh = obj as THREE.Mesh;
        if (!mesh.isMesh) return;
        const srcMat = Array.isArray(mesh.material)
          ? mesh.material[0]
          : mesh.material;
        if (!srcMat) return;
        const mat = srcMat.clone();
        if (ghost) {
          mat.transparent = true;
          mat.opacity = 0.09;
          mat.depthWrite = false;
          mesh.renderOrder = 2;
        } else {
          mesh.geometry.computeBoundingBox();
          const gb = mesh.geometry.boundingBox;
          const plane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
          meshPlanes.current.push({
            plane,
            min: gb ? gb.min.y : 0,
            height: gb ? Math.max(gb.max.y - gb.min.y, 1e-6) : 1,
          });
          mat.clippingPlanes = [plane];
          mesh.renderOrder = 1;
        }
        mesh.material = mat;
      });
      return layer;
    };

    ghostLayer.current.add(makeLayer(true));
    fillLayer.current.add(makeLayer(false));

    /* Centre the layers on the origin, exactly as drei's <Center> would for
       React children — but these layers are populated imperatively, so Center
       never sees them. Without this offset the model sits on its ground plane
       and swings around a point beneath its feet. Offsetting the WRAPPER group
       leaves each mesh's local (and clip) space untouched. */
    ghostLayer.current.position.set(-center.x, -center.y, -center.z);
    fillLayer.current.position.set(-center.x, -center.y, -center.z);

    /* Seed the planes from the driver so an instant fill (reduced motion) never
       leaves the knight empty on its first frame. */
    const seed = Math.min(1, Math.max(0, fill.get()));
    for (const entry of meshPlanes.current) {
      entry.plane.constant = entry.min + seed * entry.height;
    }
    if (ghostLayer.current) ghostLayer.current.visible = seed < 0.999;
  }, [scene, fill]);

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
    /* Fill and readiness run even under reduced motion: the knight must exist
       and (with a driver) must be visible before the boot overlay clears. */
    if (fill && meshPlanes.current.length > 0) {
      const f = Math.min(1, Math.max(0, fill.get()));
      for (const entry of meshPlanes.current) {
        entry.plane.constant = entry.min + f * entry.height;
      }
      if (ghostLayer.current) ghostLayer.current.visible = f < 0.999;
    }
    if (
      !ready.current &&
      (!fill || (fillLayer.current && fillLayer.current.children.length > 0))
    ) {
      ready.current = true;
      onReadyRef.current?.();
    }
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
     * knight only leans ~4.5° toward the pointer — below the threshold where a
     * yaw reads as the knight turning profile-on (and therefore "shrinking");
     * just enough that the piece feels aware of you, not watched.
     *
     * Damped with a frame-rate-independent exponential (1 - e^-kt). Lerping by
     * a fixed fraction per frame ties the speed to refresh rate: identical code
     * moves twice as fast on a 120Hz display. */
    const target = pointerX.current * 0.08;
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
    const ghost = ghostLayer.current;
    const fill = fillLayer.current;
    return () => {
      /* Clone layers (fill mode) share geometry but own their materials. */
      for (const layer of [ghost, fill]) {
        if (!layer) continue;
        layer.traverse((obj: THREE.Object3D) => {
          const mesh = obj as THREE.Mesh;
          if (mesh.isMesh && mesh.material) {
            const material = Array.isArray(mesh.material)
              ? mesh.material[0]
              : mesh.material;
            material?.dispose?.();
          }
        });
      }
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
     without this the knight swings around a point beneath its feet. The fill
     layers are centred imperatively (see the build effect); the plain model
     goes through drei's <Center>. */
  return (
    <group ref={leanRef}>
      <group ref={group}>
        {fill ? (
          <>
            <group ref={ghostLayer} />
            <group ref={fillLayer} />
          </>
        ) : (
          <Center>
            <primitive object={scene} />
          </Center>
        )}
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
  onReady,
  fill,
  className,
}: Model3DProps) {
  const gate = useModelGating();
  /* Coarse pointer or a narrow viewport = phone-class pixel budget. Read once
     on mount; a resize past this boundary is not worth remounting the canvas. */
  const [isCompact, setIsCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse), (max-width: 767px)");
    const sync = () => setIsCompact(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  const [inView, setInView] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const onReadyRef = useRef(onReady);
  useEffect(() => {
    onReadyRef.current = onReady;
  });

  /* When the device gate switches this instance off, there is nothing more
     coming: report ready immediately so a boot sequence tied to `onReady`
     can proceed instead of waiting on a model that will never render. */
  useEffect(() => {
    if (gate === "fallback") onReadyRef.current?.();
  }, [gate]);

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
              /* Phones render the same model at a lower pixel budget rather
                 than not at all. A 3x-DPR phone painting 97k triangles at full
                 device resolution is the actual cost — not the geometry — so
                 cap it there and keep the knight on every device. */
              dpr={[1, isCompact ? 1.25 : 1.75]}
              camera={{ position: [0, 0, 2.7], fov: 35 }}
              gl={{ antialias: true, alpha: true }}
              onCreated={({ gl }) => {
                gl.localClippingEnabled = true;
              }}
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
                onReady={onReady}
                fill={fill}
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