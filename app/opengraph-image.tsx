/*
 * app/opengraph-image.tsx — the default social card for every route that does
 * not ship its own opengraph-image (Phase 17, Agent A). Services already carry
 * a per-route card at app/services/[slug]/opengraph-image.tsx.
 *
 * Paper surface with the ledger grid, the practice name in the display serif,
 * and the brass rule — the same visual language as the site, rendered as real
 * text at 1200×630 on the edge runtime with system fonts only (no network
 * dependencies at build time).
 */

import { ImageResponse } from "next/og";
import { SITE_URL } from "@/lib/seo";

export const runtime = "edge";
export const alt = "Amit Modi & Co. — tax, GST and compliance practice";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const DOMAIN_DISPLAY = SITE_URL.replace(/^https?:\/\//, "").replace(/\/$/, "");

const LEDGER =
  "repeating-linear-gradient(to bottom, transparent 0, transparent 59px, #d9d6ce 59px, #d9d6ce 60px)," +
  "repeating-linear-gradient(to right, transparent 0, transparent 59px, #d9d6ce 59px, #d9d6ce 60px)";

const SERIF = "Georgia, 'Times New Roman', serif";
const MONO = "'Courier New', monospace";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#efede8",
        backgroundImage: LEDGER,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        fontFamily: SERIF,
        color: "#14140f",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <span
          style={{
            fontSize: 22,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#0a6b4e",
            fontFamily: MONO,
          }}
        >
          Amit Modi & Co.
        </span>
        <span
          style={{
            fontSize: 18,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#55534b",
          }}
        >
          Advocate · Suratgarh
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <h1
          style={{
            fontSize: 76,
            lineHeight: 1.05,
            fontWeight: 400,
            margin: 0,
            maxWidth: 1000,
          }}
        >
          Tax, GST and compliance for Indian businesses.
        </h1>
        <p
          style={{
            fontSize: 28,
            lineHeight: 1.3,
            color: "#55534b",
            marginTop: 24,
            maxWidth: 900,
            marginLeft: 0,
            marginRight: 0,
          }}
        >
          Registration, filing, and appeals — handled end to end, before the
          deadline.
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ width: 48, height: 3, backgroundColor: "#a8842c" }} />
        <span style={{ fontSize: 18, color: "#55534b" }}>
          {DOMAIN_DISPLAY}
        </span>
      </div>
    </div>,
    size,
  );
}
