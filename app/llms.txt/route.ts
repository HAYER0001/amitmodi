import { NextResponse } from 'next/server';
import { SITE_URL } from '@/lib/seo';
import { SERVICES } from '@/data/services';
import { getPublishedPosts } from '@/lib/mdx';
import { getPublishedTerms } from '@/lib/glossary';
import { getConsentedCaseStudies } from '@/lib/case-studies';

/*
 * app/llms.txt/route.ts — the llms.txt index (SEO-GEO-AEO plan, 2.3).
 *
 * The spec's links normally point at .md endpoints; this site has none, so
 * every link below is the real, indexable URL rather than a dead .md path.
 * Case studies render ONLY when consentObtained is true (lib/case-studies.ts
 * contract) — none are today, so the section self-suppresses.
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

export async function GET() {
  const posts = getPublishedPosts();
  const statutory = posts.filter((p) => STATUTORY_SLUGS.has(p.slug));
  const guides = posts.filter((p) => p.category === 'guide');
  const terms = getPublishedTerms();
  const caseStudies = getConsentedCaseStudies();

  const lines: string[] = [
    '# Amit Modi & Co.',
    '',
    '> Amit Modi & Co. is a tax, GST and compliance practice in Suratgarh, Rajasthan, serving private limited companies, limited liability partnerships, partnership firms, and proprietorships. The practice handles GST and income tax compliance, returns, entity formation, statutory notices and appeals.',
    '',
    `Full knowledge base: ${SITE_URL}/llms-full.txt`,
    '',
    '## Practice',
    '- [About](/practice): the practice, its approach and principles.',
    '- [Principal](/practice/principal): the named professional behind the practice.',
    '- [Contact](/contact): request a consultation.',
    '',
    '## Services',
  ];

  for (const service of SERVICES) {
    lines.push(
      `- [${service.name}](/services/${service.slug}): ${service.oneLiner}`,
    );
  }

  lines.push('', '## Statutory Q&A');

  for (const post of statutory) {
    lines.push(
      `- [${post.title}](/insights/${post.slug}): ${post.summary}`,
    );
  }

  lines.push('', '## Tools');

  const tools = [
    { name: 'GST Calculator', slug: 'gst-calculator', summary: 'Compute GST on a supply, split into CGST/SGST or IGST.' },
    { name: 'GST Late Fee Calculator', slug: 'late-fee-calculator', summary: 'Estimate the late fee and interest on a delayed GST return.' },
    { name: 'TDS Rate Finder', slug: 'tds-rate-finder', summary: 'Find the section, rate and threshold for a TDS deduction.' },
    { name: 'ITR Form Selector', slug: 'itr-form-selector', summary: 'Find the right income tax return form for a taxpayer profile.' },
    { name: 'HSN & SAC Lookup', slug: 'hsn-sac-lookup', summary: 'Find the GST rate for a goods or services code.' },
  ];

  for (const tool of tools) {
    lines.push(
      `- [${tool.name}](/tools/${tool.slug}): ${tool.summary}`,
    );
  }

  lines.push('', '## Guides');

  for (const guide of guides) {
    lines.push(
      `- [${guide.title}](/guides/${guide.slug}): ${guide.summary}`,
    );
  }

  lines.push('', '## Glossary');

  lines.push(
    `- [Glossary](/glossary): ${terms.length} statutory terms and abbreviations in plain language.`,
  );

  if (caseStudies.length > 0) {
    lines.push('', '## Case Studies');

    for (const study of caseStudies) {
      lines.push(`- [${study.title}](/case-studies/${study.slug})`);
    }
  }

  lines.push('', '## Full knowledge base');
  lines.push(`- [llms-full.txt](${SITE_URL}/llms-full.txt): every indexable page as readable text.`);
  lines.push('');

  return new NextResponse(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
