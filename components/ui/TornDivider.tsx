import Image from "next/image";
import { ASSETS } from "@/data/assets";

/*
 * TornDivider — a torn-paper edge between sections.
 *
 * The site's sections currently meet on 1px hairlines, which is correct for a
 * ledger but leaves every transition identical. One torn edge at the point where
 * the page changes register (paper -> paper-deep) reads as a physical page turn
 * and breaks the grid without adding a new colour or a new shape.
 *
 * Purely decorative: aria-hidden, and it carries no meaning a screen reader
 * would need. Fixed height so it can never shift layout as the image loads.
 */
export default function TornDivider({ className = "" }: { className?: string }) {
  const tex = ASSETS["tex-torn-edge"];
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative h-6 w-full overflow-hidden sm:h-8 ${className}`}
    >
      <Image
        src={tex.src}
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center opacity-70"
      />
    </div>
  );
}
