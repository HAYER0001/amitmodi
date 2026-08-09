import { NextResponse } from 'next/server';

export async function GET() {
  const content = `# Compliance in Check

> Compliance in Check is an Indian tax consultancy and regulatory compliance practice. The firm serves private limited companies, limited liability partnerships, partnership firms, and proprietorships. It is authorised to represent clients in matters relating to Goods and Services Tax (GST), Income Tax, and entity formation, providing structured compliance filing and diagnostic review services.

## Services
- [GST Registration](/services/gst-registration.md): Statutory registration for the Goods and Services Tax network.
- [GST Returns](/services/gst-returns.md): Filing of GSTR-1, GSTR-3B, and annual reconciliations.
- [Income Tax Returns](/services/income-tax-returns.md): Filing of corporate, partnership, and individual returns.
- [TDS Returns](/services/tds-returns.md): Quarterly filing and deductee certificate generation.
- [Entity Formation](/services/entity-formation.md): Structuring and registration of new business entities.
- [PAN Card](/services/pan-card.md): Application and correction of Permanent Account Numbers.
- [Tax Appeals](/services/tax-appeals.md): Preparation and representation for statutory notices.
- [Import Export Licence](/services/import-export-licence.md): Securing IEC and GST LUT for cross-border trade.

## Tools
- [GST Calculator](/tools/gst-calculator.md)
- [GST Late Fee Calculator](/tools/gst-late-fee-calculator.md)
- [TDS Rate Finder](/tools/tds-rate-finder.md)
- [ITR Form Selector](/tools/itr-form-selector.md)
- [HSN/SAC Lookup](/tools/hsn-sac-lookup.md)

## Guides
- [Business Entity Registration Guide](/guides/business-entity-registration-guide.md)
- [GST Compliance Guide](/guides/gst-compliance-guide-growing-business.md)
- [Income Tax Notices Response Guide](/guides/income-tax-notices-response-guide.md)
- [First-Time Exporter Compliance Guide](/guides/first-time-exporter-compliance-guide.md)

## Glossary
- [Glossary](/glossary/index.md)

## About
- [About](/practice.md)
- [Principal](/practice/principal.md)

## Contact
- [Contact Us](/contact.md)
`;

  return new NextResponse(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
