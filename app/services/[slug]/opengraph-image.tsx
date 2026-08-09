import { ImageResponse } from "next/og";
import { getContent, CATEGORY_LABEL } from "../_content-bridge";
import { getAllServices } from "@/lib/content";

/*
 * opengraph-image — dynamic 1200×630 OG image per service, edge runtime.
 *
 * Paper surface with the ledger grid, the service name in a display serif,
 * the category eyebrow, and the intro line from Agent B's content. Uses
 * system fonts only so the edge build has no network dependencies.
 */

export const runtime = "edge";
export const alt = "Amit Modi & Co. — service overview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const LEDGER =
  "repeating-linear-gradient(to bottom, transparent 0, transparent 59px, #d9d6ce 59px, #d9d6ce 60px)," +
  "repeating-linear-gradient(to right, transparent 0, transparent 59px, #d9d6ce 59px, #d9d6ce 60px)";

const SERIF = "Georgia, 'Times New Roman', serif";
const MONO = "'Courier New', monospace";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getAllServices().find((s) => s.slug === slug);

  if (!service) {
    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#efede8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: SERIF,
          fontSize: 48,
        }}
      >
        Amit Modi & Co.
      </div>,
      size,
    );
  }

  const content = getContent(slug);
  const intro = content?.intro ?? service.oneLiner;
  const category = CATEGORY_LABEL[service.category] ?? "Services";

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
          {category}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <h1
          style={{
            fontSize: 72,
            lineHeight: 1.05,
            fontWeight: 400,
            margin: 0,
            maxWidth: 1000,
          }}
        >
          {service.name}
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
          {intro}
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ width: 48, height: 3, backgroundColor: "#a8842c" }} />
        <span style={{ fontSize: 18, color: "#55534b" }}>
          Tax and compliance for Indian businesses, made simple
        </span>
      </div>
    </div>,
    size,
  );
}
