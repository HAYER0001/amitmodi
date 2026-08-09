import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { GuideCard } from "./_components";
import { getPublishedPosts } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Compliance Guides | Compliance in Check",
  description:
    "Long-form, evergreen guides for Indian businesses — entity formation, GST compliance, income-tax notices, and first-time exporting. Depth is the point.",
  alternates: { canonical: "/guides" },
};

/*
 * app/guides/page.tsx — the guides hub. One card per evergreen guide,
 * rendered from the same MDX pipeline as insights, filtered to the guide
 * category.
 */

export default function GuidesPage() {
  const guides = getPublishedPosts().filter((post) => post.category === "guide");
  return (
    <div className="bg-paper-deep">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <Breadcrumbs />
        <header className="max-w-2xl pb-10 pt-4">
          <p className="font-label text-xs uppercase tracking-[0.14em] text-seal">
            Guides
          </p>
          <h1 className="mt-3 font-display text-display text-ink">
            The long reads.
          </h1>
          <p className="mt-4 font-body text-body leading-relaxed text-ink-soft">
            Not news, not notes — the complete picture. Each guide takes one
            decision a business faces and walks it through from first form to
            final filing, so you can read it once and act on it.
          </p>
        </header>

        {guides.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </div>
        ) : (
          <p className="border-t border-rule pt-8 font-body text-body leading-relaxed text-ink-soft">
            The guides are being written. Check back soon.
          </p>
        )}
      </div>
    </div>
  );
}
