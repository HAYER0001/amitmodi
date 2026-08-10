import Marginalia from "@/components/ui/Marginalia";
import CutOut from "@/components/ui/CutOut";
import { ASSETS, type AssetKey } from "@/data/assets";

/*
 * PageAtmosphere — the paper texture every page shares.
 *
 * In the reference, the chess notation is on EVERY screen of the scroll. It is
 * not an accent on the hero; it is what the page is made of. Eight of our pages
 * had none at all, which is why they read as a different, plainer site than the
 * homepage even after their headings were fixed.
 *
 * Density is a rule, not a per-page guess:
 *
 *   "landing"  12  — homepage, section fronts. The page is the message.
 *   "interior"  8  — service pages, practice. Content leads, texture supports.
 *   "utility"   5  — tools, contact, calendar. Someone is doing a task here.
 *   "reading"   0  — articles and guides. Nothing competes with running text.
 *
 * Every seed differs per page so no two pages share a scatter — repeated
 * placement is what makes a texture look like a template.
 */

export type Density = "landing" | "interior" | "utility" | "reading";

const COUNT: Record<Density, number> = {
  landing: 12,
  interior: 8,
  utility: 5,
  reading: 0,
};

export default function PageAtmosphere({
  density = "interior",
  seed = 3,
  object,
  objectClassName = "right-[5%] top-[10%] hidden w-24 rotate-6 lg:block xl:w-32",
  exclude = { top: 4, left: 0, right: 72, bottom: 96 },
}: {
  density?: Density;
  seed?: number;
  /** One collage object. Each page gets a different one — see ASSET-ROLES.md. */
  object?: AssetKey;
  objectClassName?: string;
  exclude?: { top: number; left: number; right: number; bottom: number };
}) {
  const count = COUNT[density];
  const asset = object ? ASSETS[object] : null;
  if (count === 0 && !asset) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {count > 0 && <Marginalia count={count} seed={seed} exclude={exclude} />}
      {asset && (
        <div className={`cut-out-drift absolute ${objectClassName}`}>
          <CutOut
            src={asset.src}
            alt=""
            width={asset.width}
            height={asset.height}
          />
        </div>
      )}
    </div>
  );
}
