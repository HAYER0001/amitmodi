import type { ReactNode } from "react";
import type { CaseStudy } from "@/lib/case-studies";

/*
 * CaseStudyCard — one STAR case study, rendered as four labelled sections
 * (Situation, Task, Action, Result) from content/case-studies/*.mdx
 * (instrtion.md §IV: Case Study Framework). The labels come straight from the
 * document headings, so a study is only ever as complete as Agent B made it.
 *
 * Consent is enforced HERE as well as in lib/case-studies.ts — a study with
 * consentObtained !== true renders nothing, in EITHER advertising mode. The
 * filter is cheap, load-bearing, and duplicated on purpose.
 */

function renderInline(text: string): ReactNode[] {
  /* Bold spans written as **like this** — the only inline markdown Agent B uses. */
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
}

function Blocks({ text }: { text: string }) {
  const blocks = text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <>
      {blocks.map((block, index) => {
        const lines = block.split("\n").filter((line) => line.trim().length > 0);
        const trimmed = lines.map((line) => line.trim());

        if (trimmed.every((line) => /^\d+\.\s/.test(line))) {
          return (
            <ol key={index} className="mt-3 space-y-2">
              {trimmed.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-3 font-body text-body leading-relaxed text-ink"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-seal"
                  />
                  <span>{renderInline(line.replace(/^\d+\.\s/, ""))}</span>
                </li>
              ))}
            </ol>
          );
        }

        if (trimmed.every((line) => /^[-*]\s/.test(line))) {
          return (
            <ul key={index} className="mt-3 space-y-2">
              {trimmed.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-3 font-body text-body leading-relaxed text-ink"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-seal"
                  />
                  <span>{renderInline(line.replace(/^[-*]\s/, ""))}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={index} className="mt-3 font-body text-body leading-relaxed text-ink">
            {renderInline(block.replace(/\n/g, " "))}
          </p>
        );
      })}
    </>
  );
}

export default function CaseStudyCard({ study }: { study: CaseStudy }) {
  if (!study.consentObtained) return null;

  return (
    <article className="space-y-10">
      {study.sections.map((section) => (
        <section
          key={section.heading}
          aria-labelledby={`star-${section.heading.toLowerCase()}`}
          className="border-t border-rule pt-8"
        >
          <p className="font-label text-xs uppercase tracking-[0.14em] text-brass">
            STAR
          </p>
          <h2
            id={`star-${section.heading.toLowerCase()}`}
            className="mt-2 font-display text-h3 text-ink"
          >
            {section.heading}
          </h2>
          <Blocks text={section.body} />
        </section>
      ))}
    </article>
  );
}
