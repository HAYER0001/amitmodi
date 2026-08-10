import { BRAND, hasFact } from '@/data/brand';
import { SERVICES } from '@/data/services';
import type { ProcessStep } from '@/types/content';

type ServiceLike = {
  name: string;
  oneLiner: string;
  pricing?: { startsAt: number };
};

type ArticleLike = {
  title: string;
  summary: string;
  coverImage?: string;
  datePublished: Date;
  dateModified: Date | null;
  author: string;
  slug: string;
  category: string;
  wordCount?: number;
  keywords?: string[];
};

export function WebSiteSchema({ domain }: { domain: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": BRAND.tradingName,
    "url": domain,
    "publisher": {
      "@type": "Organization",
      "name": BRAND.tradingName
    },
    "inLanguage": "en-IN"
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function OrganizationSchema({ domain }: { domain: string }) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["Organization", "AccountingService"],
    "name": BRAND.tradingName,
    "url": domain
  };
  if (hasFact(BRAND.legalName)) schema.legalName = BRAND.legalName;
  schema.logo = `${domain}/icon.png`;
  if (hasFact(BRAND.contact.phone)) schema.telephone = BRAND.contact.phone;
  if (hasFact(BRAND.contact.email)) schema.email = BRAND.contact.email;
  
  schema.address = {
    "@type": "PostalAddress",
    "streetAddress": `${BRAND.address.line1}, ${BRAND.address.line2}`.replace(/,\\s*$/, ''),
    "addressLocality": BRAND.address.city,
    "addressRegion": BRAND.address.state,
    "postalCode": BRAND.address.pin,
    "addressCountry": BRAND.address.country
  };

  schema.areaServed = [BRAND.serviceArea.primaryCity, ...BRAND.serviceArea.cities, ...BRAND.serviceArea.states].map(a => ({ "@type": "Place", "name": a }));

  if (hasFact(BRAND.principal.name)) {
    schema.founder = {
      "@type": "Person",
      "name": BRAND.principal.name
    };
  }
  if (hasFact(BRAND.foundedYear)) schema.foundingDate = BRAND.foundedYear;

  schema.knowsAbout = [
    "Goods and Services Tax", "Income Tax", "Corporate Law", "Tax Appeals", "Entity Formation", "TDS",
    ...SERVICES.map(s => s.name)
  ];

  if (hasFact(BRAND.gstin)) schema.taxID = BRAND.gstin;

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function LocalBusinessSchema({ domain }: { domain: string }) {
  if (BRAND.address.lat === null || BRAND.address.lng === null) return null;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": BRAND.tradingName,
    "url": domain,
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": BRAND.address.lat,
      "longitude": BRAND.address.lng
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": `${BRAND.address.line1}, ${BRAND.address.line2}`.replace(/,\\s*$/, ''),
      "addressLocality": BRAND.address.city,
      "addressRegion": BRAND.address.state,
      "postalCode": BRAND.address.pin,
      "addressCountry": BRAND.address.country
    }
  };
  if (hasFact(BRAND.contact.phone)) schema.telephone = BRAND.contact.phone;
  
  const validHours = BRAND.hours.filter(h => hasFact(h.opens) && hasFact(h.closes));
  if (validHours.length > 0) {
    schema.openingHoursSpecification = validHours.map(h => ({
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": h.day,
      "opens": h.opens,
      "closes": h.closes
    }));
  }
  schema.priceRange = "₹₹";
  
  if (hasFact(BRAND.contact.gbpUrl)) schema.hasMap = BRAND.contact.gbpUrl;

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function ServiceSchema({ service, content, domain }: { service: unknown, content: { whatsIncluded?: string[] } | null, domain: string }) {
  const s = service as ServiceLike;
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": s.name,
    "description": s.oneLiner,
    "serviceType": s.name,
    "provider": {
      "@type": "Organization",
      "name": BRAND.tradingName,
      "url": domain
    },
    "areaServed": [BRAND.serviceArea.primaryCity, ...BRAND.serviceArea.states].map(a => ({ "@type": "Place", "name": a }))
  };

  if (s.pricing && s.pricing.startsAt > 0) {
    schema.offers = {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": s.pricing.startsAt
    };
  }

  if (content?.whatsIncluded && content.whatsIncluded.length > 0) {
    schema.hasOfferCatalog = {
      "@type": "OfferCatalog",
      "name": "What's included",
      "itemListElement": content.whatsIncluded.map((item: string, i: number) => ({
        "@type": "OfferCatalog",
        "name": item,
        "position": i + 1
      }))
    };
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function FAQPageSchema({ faqs }: { faqs: Array<{question: string, answer: string, verified?: boolean}> }) {
  const verifiedFaqs = faqs.filter(faq => faq.verified === true);
  if (verifiedFaqs.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": verifiedFaqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function ArticleSchema({ post, domain }: { post: ArticleLike, domain: string }) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.summary,
    "image": `${domain}${post.coverImage || '/images/og-default.jpg'}`,
    "datePublished": post.datePublished.toISOString(),
    "dateModified": (post.dateModified || post.datePublished).toISOString(),
    "author": {
      "@type": "Person",
      "name": post.author,
      "url": `${domain}/practice/principal`
    },
    "publisher": {
      "@type": "Organization",
      "name": BRAND.tradingName,
      "logo": {
        "@type": "ImageObject",
        "url": `${domain}/icon.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${domain}/${post.category === 'guide' ? 'guides' : 'insights'}/${post.slug}`
    }
  };

  if (post.wordCount) schema.wordCount = post.wordCount;
  if (post.keywords && post.keywords.length > 0) schema.keywords = post.keywords.join(", ");

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function PersonSchema({ domain: _domain }: { domain?: string }) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": BRAND.principal.name,
    "jobTitle": BRAND.principal.designation,
    "worksFor": {
      "@type": "Organization",
      "name": BRAND.tradingName
    },
    "knowsAbout": ["Goods and Services Tax", "Income Tax", "Corporate Law", "Tax Appeals"]
  };
  
  if (hasFact(BRAND.principal.linkedin)) {
    schema.sameAs = [BRAND.principal.linkedin];
  }
  
  if (hasFact(BRAND.principal.qualifications)) {
    schema.alumniOf = {
      "@type": "EducationalOrganization",
      "name": BRAND.principal.qualifications
    };
  }

  if (hasFact(BRAND.principal.membershipNo)) {
    schema.hasCredential = {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "Bar Council Enrolment",
      "recognizedBy": {
        "@type": "Organization",
        "name": "Bar Council of India"
      },
      "credentialNumber": BRAND.principal.membershipNo
    };
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function BreadcrumbListSchema({ crumbs, domain }: { crumbs: {label: string, path: string}[], domain: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": crumb.label,
      "item": crumb.path === '/' ? domain : `${domain}${crumb.path}`
    }))
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function HowToSchema({ steps, title, description }: { steps: ProcessStep[], title: string, description: string }) {
  if (steps.length === 0) return null;
  const totalDays = steps.reduce((acc, step) => acc + (step.durationDays || 0), 0);
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": title,
    "description": description,
    "totalTime": totalDays > 0 ? `P${totalDays}D` : undefined,
    "supply": [
      {
        "@type": "HowToSupply",
        "name": "Required Documents"
      }
    ],
    "tool": [
      {
        "@type": "HowToTool",
        "name": "Government Portal"
      }
    ],
    "step": steps.map((step, i) => ({
      "@type": "HowToStep",
      "position": i + 1,
      "name": step.title,
      "text": step.description
    }))
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function WebPageSchema({ domain, url, speakableSelector }: { domain: string, url: string, speakableSelector?: string }) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "url": `${domain}${url}`
  };
  if (speakableSelector) {
    schema.speakable = {
      "@type": "SpeakableSpecification",
      "cssSelector": [speakableSelector]
    };
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
