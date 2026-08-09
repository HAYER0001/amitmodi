/*
 * app/robots.ts — robots.txt generated from data/robots-reference.txt
 * (Phase 17, Agent A).
 *
 * The reference file is the source of truth: AI crawlers are allowed by
 * default — a deliberate strategy decision recorded in that file — while the
 * universal group restricts the admin-facing and internal routes. This module
 * parses it at build time so the two can never drift.
 */

import fs from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

type AgentGroup = { agents: string[]; disallow: string[] };

/** One "User-agent:" block from the reference file, comments stripped. */
function parseReference(): { groups: AgentGroup[]; sitemap: string } {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "data", "robots-reference.txt"),
    "utf8",
  );

  const groups: AgentGroup[] = [];
  let current: AgentGroup | null = null;
  let sitemap = "";

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    if (trimmed.startsWith("User-agent:")) {
      current = { agents: [trimmed.slice("User-agent:".length).trim()], disallow: [] };
      groups.push(current);
      continue;
    }

    if (trimmed.startsWith("Disallow:")) {
      const value = trimmed.slice("Disallow:".length).trim();
      if (current && value) current.disallow.push(value);
      continue;
    }

    if (trimmed.startsWith("Sitemap:")) {
      sitemap = trimmed.slice("Sitemap:".length).trim();
    }
  }

  return { groups, sitemap };
}

export default function robots(): MetadataRoute.Robots {
  const { groups, sitemap } = parseReference();

  const rules: MetadataRoute.Robots["rules"] = groups.map((group) => {
    /* An agent whose group has no non-empty Disallow lines is allowed
     * everywhere. The reference encodes that as a single empty "Disallow:". */
    if (group.disallow.length === 0) {
      return {
        userAgent: group.agents.length === 1 ? group.agents[0] : group.agents,
        allow: "/",
      };
    }
    return {
      userAgent: group.agents.length === 1 ? group.agents[0] : group.agents,
      disallow: group.disallow,
    };
  });

  return {
    rules,
    sitemap: sitemap.replace(
      "<NEXT_PUBLIC_SITE_URL>",
      SITE_URL,
    ),
  };
}
