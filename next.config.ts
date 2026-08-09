import type { NextConfig } from "next";

type RedirectEntry = {
  source: string;
  destination: string;
  permanent?: boolean;
};

/*
 * redirects() — the 301/308 map, driven by data/redirects.ts (Agent C's
 * deliverable this phase).
 *
 * These redirects are PERMANENT (308). They must never be changed once live:
 * inbound links depend on them — directory listings, court judgments citing
 * an old URL, other firms' blogs, archived pages. A permanent redirect that
 * quietly starts 404ing erases every inbound link it carried. Any change to
 * the old → new mapping belongs in data/redirects.ts as a NEW entry; the map
 * only ever grows.
 */
let REDIRECTS: RedirectEntry[] = [];
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mod = require("./data/redirects");
  REDIRECTS = mod.REDIRECTS ?? mod.default ?? [];
} catch (error) {
  if (
    !(error instanceof Error) ||
    !("code" in error) ||
    (error as NodeJS.ErrnoException).code !== "MODULE_NOT_FOUND"
  ) {
    throw error;
  }
  // data/redirects.ts has not landed yet — the map is empty and nothing is
  // misdirected until Agent C's file arrives.
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // redirects() and headers() are intentionally empty in Phase 1.
  // Later phases fill them: 301 redirect maps and security/CSP headers.
  async redirects() {
    return REDIRECTS.map(({ source, destination, permanent = true }) => ({
      source,
      destination,
      permanent,
    }));
  },
  async headers() {
    return [];
  },
};

const withBundleAnalyzer =
  process.env.ANALYZE === "true"
    ? // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("@next/bundle-analyzer")({ enabled: true })
    : (config: NextConfig) => config;

export default withBundleAnalyzer(nextConfig);
