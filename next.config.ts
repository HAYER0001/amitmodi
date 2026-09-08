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
  /*
   * rewrites() — serve Vercel Web Analytics from a first-party path that
   * content blockers do not recognise.
   *
   * The analytics script and its page-view beacon live at /_vercel/insights/*.
   * That prefix is on the common blocker filter lists, so Brave Shields, uBlock
   * and similar refuse to load it — and the practice owner uses Brave, which
   * is why the Analytics dashboard showed nothing for their own visits. The
   * <Analytics basePath="/ledger" /> in app/layout.tsx makes the component load
   * the script from /ledger/insights/script.js and post views to
   * /ledger/insights/view; this rule proxies that whole family back to the real
   * endpoint. Nothing about what is collected changes — Vercel Analytics is
   * cookieless and this is the site owner measuring their own site — only the
   * path a blocker sees. `basePath` is the package's documented mechanism for
   * exactly this.
   */
  async rewrites() {
    return [
      {
        source: "/ledger/insights/:path*",
        destination: "/_vercel/insights/:path*",
      },
    ];
  },
};

const withBundleAnalyzer =
  process.env.ANALYZE === "true"
    ? // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("@next/bundle-analyzer")({ enabled: true })
    : (config: NextConfig) => config;

export default withBundleAnalyzer(nextConfig);
