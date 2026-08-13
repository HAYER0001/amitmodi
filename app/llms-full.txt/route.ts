import { NextResponse } from 'next/server';
import { CITABLE_FACTS } from '@/data/citable-facts';
import { PRACTICE_CONTENT } from '@/data/practice-content';
import { SERVICES } from '@/data/services';
import { SITE_URL } from '@/lib/seo';
import { getPublishedPosts } from '@/lib/mdx';
import { getPublishedTerms } from '@/lib/glossary';
import { getConsentedCaseStudies, sectionExcerpt } from '@/lib/case-studies';
import { brand } from '@/lib/brand';

/*
 * app/llms-full.txt/route.ts — the everything-knowledge-base (plan 2.3).
 *
 * Covers every indexable URL as readable text: practice, principal, citable
 * facts, services, the statutory Q&A posts, tools, guides, the full glossary,
 * consent-gated case studies, and confirmed contact facts. Unconfirmed facts
 * (email, whatsapp) are omitted rather than guessed.
 */

const STATUTORY_SLUGS = new Set([
  'section-73-vs-74-cgst',
  'gstr-2b-vs-books-mismatch',
  'section-143-1-vs-143-2',
  'section-148-reassessment-notice',
  'input-tax-credit-reversal-rule-42-43',
  'what-happens-after-gst-notice',
  'filing-appeal-cit-a-timelines-fees',
]);

function stripMarkdown(text: string): string {
  return text
    .replace(/[*_`>#]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function GET() {
  const posts = getPublishedPosts();
  const statutory = posts.filter((p) => STATUTORY_SLUGS.has(p.slug));
  const guides = posts.filter((p) => p.category === 'guide');
  const articles = posts.filter((p) => p.category === 'article' && !STATUTORY_SLUGS.has(p.slug));
  const terms = getPublishedTerms();
  const caseStudies = getConsentedCaseStudies();

  let content = `# Amit Modi & Co. — Complete Knowledge Base\n\n`;
  content += `Site: ${SITE_URL}\n\n`;

  // 1. Practice Overview
  content += `## 1. Practice Overview\n`;
  content += `${PRACTICE_CONTENT.about.narrative}\n\n`;
  content += `${PRACTICE_CONTENT.about.approach}\n\n`;

  // 2. Principal
  content += `## 2. Principal\n`;
  content += `${PRACTICE_CONTENT.principal.bio}\n\n`;

  // 3. Citable Facts
  content += `## 3. Citable Facts\n`;
  content += CITABLE_FACTS.map((f) => `- ${stripMarkdown(f.fact)}`).join('\n') + `\n\n`;

  // 4. Services
  content += `## 4. Services\n`;
  SERVICES.forEach((s) => {
    content += `### ${s.name}\n`;
    content += `${s.oneLiner}\n`;
    if (s.statuteRefs && s.statuteRefs.length > 0) {
      content += `Statute references: ${s.statuteRefs.join(', ')}\n`;
    }
    content += `URL: ${SITE_URL}/services/${s.slug}\n\n`;
  });

  // 5. Statutory Q&A
  content += `## 5. Statutory Q&A\n`;
  statutory.forEach((p) => {
    content += `### ${p.title}\n`;
    content += `URL: ${SITE_URL}/insights/${p.slug}\n`;
    content += `Summary: ${p.summary}\n`;
    if (p.excerpt) content += `${stripMarkdown(p.excerpt)}\n`;
    if (p.faqs.length > 0) {
      p.faqs.filter((f) => f.verified).forEach((f) => {
        content += `Q: ${f.question}\nA: ${f.answer}\n`;
      });
    }
    content += `\n`;
  });

  // 6. Other Articles
  content += `## 6. Articles\n`;
  articles.forEach((p) => {
    content += `### ${p.title}\n`;
    content += `URL: ${SITE_URL}/insights/${p.slug}\n`;
    content += `Summary: ${p.summary}\n\n`;
  });

  // 7. Tools
  content += `## 7. Tools\n`;
  const tools = [
    { name: 'GST Amount Calculator', slug: 'gst-calculator', about: 'Computes GST on a supply — exclusive or inclusive — split into CGST and SGST (intra-state) or IGST (inter-state).' },
    { name: 'Late Fee & Interest Calculator', slug: 'late-fee-calculator', about: 'Estimates the late fee and interest at 18% a year on a delayed GST return, capped by turnover tier.' },
    { name: 'TDS Rate Finder', slug: 'tds-rate-finder', about: 'Returns the section, rate, threshold and amount to deduct for a payment type and payee.' },
    { name: 'Which ITR Should I File?', slug: 'itr-form-selector', about: 'Recommends the correct income tax return form from a short profile of the taxpayer.' },
    { name: 'HSN & SAC Code Lookup', slug: 'hsn-sac-lookup', about: 'Searches goods (HSN) and services (SAC) codes with their GST slab rates.' },
  ];
  tools.forEach((t) => {
    content += `### ${t.name}\n${t.about}\nURL: ${SITE_URL}/tools/${t.slug}\n\n`;
  });

  // 8. Guides
  content += `## 8. Guides\n`;
  guides.forEach((g) => {
    content += `### ${g.title}\n`;
    content += `URL: ${SITE_URL}/guides/${g.slug}\n`;
    content += `Summary: ${g.summary}\n\n`;
  });

  // 9. Glossary
  content += `## 9. Glossary\n`;
  terms.forEach((term) => {
    content += `### ${term.term}${term.fullForm ? ` (${term.fullForm})` : ''}\n`;
    content += `${stripMarkdown(term.definition)}\n`;
    if (term.related.length > 0) {
      content += `Related: ${term.related.join(', ')}\n`;
    }
    content += `\n`;
  });

  // 10. Case Studies (consent-gated — empty until consentObtained: true)
  content += `## 10. Case Studies\n`;
  if (caseStudies.length === 0) {
    content += `Case studies are not published yet.\n\n`;
  } else {
    caseStudies.forEach((study) => {
      content += `### ${study.title}\n`;
      content += `URL: ${SITE_URL}/case-studies/${study.slug}\n`;
      const situation = sectionExcerpt(study, 'Situation', 400);
      if (situation) content += `${situation}\n`;
      content += `\n`;
    });
  }

  // 11. Contact (confirmed facts only — email/whatsapp stay omitted while TBD)
  content += `## 11. Contact\n`;
  const cityLine = [brand.address.city, brand.address.state, brand.address.pin].filter((v) => v !== null).join(', ');
  const addressLines = [brand.address.line1, brand.address.line2, cityLine || null].filter((line) => line !== null);
  content += `Address: ${addressLines.join(', ')}\n`;
  if (brand.contact.phone) content += `Phone: ${brand.contact.phone}\n`;
  content += `URL: ${SITE_URL}/contact\n`;

  return new NextResponse(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
