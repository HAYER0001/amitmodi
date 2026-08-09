/*
 * CutOut.tsx — a transparent-background "cut out" PNG with a soft shadow that
 * follows the silhouette.
 *
 * The shadow is a CSS `filter: drop-shadow()`, NEVER `box-shadow`: box-shadow
 * hugs the rectangle of the element, so on an irregular transparent cutout it
 * draws a hard rectangle. drop-shadow samples the rendered alpha instead.
 */

import type { CSSProperties } from "react";
import Image from "next/image";

type CutOutProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Clockwise degrees. Applied via a CSS custom property so it survives
   *  wrapping (e.g. inside decorative figures without breaking transforms). */
  rotate?: number;
  className?: string;
};

export default function CutOut({
  src,
  alt,
  width,
  height,
  rotate = 0,
  className = "",
}: CutOutProps) {
  /* Mirrors the --shadow-cut token rbg/opacity stack, as a filter. */
  const drop = [
    "drop-shadow(0 1px 1px rgb(20 20 15 / 0.04))",
    "drop-shadow(0 4px 8px rgb(20 20 15 / 0.08))",
    "drop-shadow(0 16px 32px rgb(20 20 15 / 0.10))",
  ].join(" ");

  const style = {
    "--rot": `${rotate}deg`,
    filter: drop,
  } as CSSProperties;

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      aria-hidden={alt === "" ? true : undefined}
      className={className}
      style={style}
    />
  );
}