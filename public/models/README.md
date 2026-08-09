# 3D Models

Self-hosted, Meshopt-compressed `.glb` files for the hero imagery. Loaded via
`@/components/ui/Model3D` (React Three Fiber + drei `useGLTF(src, false, true)`
— Draco is off, Meshopt is on, the decoder is bundled, no external fetches).

| File            | Purpose  | Budget              | Source                          | Meshing tool |
| --------------- | -------- | ------------------- | ------------------------------- | ------------ |
| knight-brass.glb  | Hero     | ≤ 800 KB, ≤ 40k tris | `public/images/_raw/src-knight-3q.png` (3/4 angle composite) | Tripo |
| seal-stamp.glb    | Optional | ≤ 400 KB            | `public/images/_raw/src-seal-3q.png` (3/4 angle composite)  | Tripo |

## Pipeline notes

- Export from Tripo as **GLB**, Meshopt-compressed, Draco stripped.
- Keep polycounts low; the hero is a soft-lit exhibit, not a game asset.
- The `.glb` must reference **no external textures** — bake and embed.
- Rename to the exact filenames above (kebab-case) before committing.

## Current status (Phase 4)

- `knight-brass.glb` (689 KB) — within hero budget.
- `seal-stamp.glb` (685 KB) — **over its 400 KB budget**; re-run optimization
  (or accept if unused on this page) before production.
- Final keyed PNGs live in `public/images/`; the `_raw` sources are gitignored.