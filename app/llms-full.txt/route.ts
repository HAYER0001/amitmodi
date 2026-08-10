import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { CITABLE_FACTS } from '@/data/citable-facts';
import { SERVICE_FAQS } from '@/data/service-faqs';
import { PRACTICE_CONTENT } from '@/data/practice-content';
import { SERVICES } from '@/data/services';

export async function GET() {
  let content = `# Amit Modi & Co. - Complete Knowledge Base\n\n`;

  // 1. Practice Facts
  content += `## 1. Practice Overview\n`;
  content += PRACTICE_CONTENT.about.narrative + `\n\n`;
  content += PRACTICE_CONTENT.about.approach + `\n\n`;
  content += `Principal: ${PRACTICE_CONTENT.principal.bio}\n\n`;

  // 2. Citable Facts
  content += `## 2. Citable Facts\n`;
  content += CITABLE_FACTS.map(f => `- ${f.fact}`).join('\n') + `\n\n`;

  // 3. Service Summaries
  content += `## 3. Services Overview\n`;
  SERVICES.forEach(s => {
    content += `### ${s.name}\n`;
    content += `${s.oneLiner}\n\n`;
  });

  // 4. Service FAQs
  content += `## 4. Frequently Asked Questions\n`;
  Object.values(SERVICE_FAQS).forEach(faqList => {
    faqList.forEach(faq => {
      content += `Q: ${faq.question}\nA: ${faq.answer.replace(/\s*<!-- VERIFY -->\s*/g, '').replace(/\s*\/\* VERIFY \*\/\s*/g, '')}\n\n`;
    });
  });

  // 5. Glossary
  content += `## 5. Glossary of Terms\n`;
  try {
    const glossaryDir = path.join(process.cwd(), 'content', 'glossary');
    const files = fs.readdirSync(glossaryDir).filter(f => f.endsWith('.mdx'));
    files.forEach(f => {
      const text = fs.readFileSync(path.join(glossaryDir, f), 'utf-8');
      // Strip frontmatter and append
      const body = text.replace(/---[\\s\\S]*?---/, '').trim();
      content += `### ${f.replace('.mdx', '').toUpperCase()}\n${body}\n\n`;
    });
  } catch {
    // Fail gracefully if directory not found
  }

  return new NextResponse(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
