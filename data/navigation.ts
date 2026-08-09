import { SERVICES } from './services'

const serviceLinks = SERVICES.map((s) => ({
  label: s.shortName,
  href: `/services/${s.slug}`,
}))

export const MAIN_NAV = [
  { label: 'Services', href: '/services', children: serviceLinks },
  { label: 'Tools', href: '/tools' },
  { label: 'Insights', href: '/insights' },
  { label: 'Guides', href: '/guides' },
  { label: 'The Practice', href: '/practice' },
  { label: 'Contact', href: '/contact' },
] as const

export const FOOTER_NAV = [
  {
    heading: 'The Practice',
    links: [
      { label: 'The Practice', href: '/practice' },
      { label: 'The Principal', href: '/practice/principal' },
      { label: 'Case Studies', href: '/case-studies' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    heading: 'Services',
    links: serviceLinks,
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Tools', href: '/tools' },
      { label: 'Guides', href: '/guides' },
      { label: 'Glossary', href: '/glossary' },
      { label: 'Insights', href: '/insights' },
      { label: 'Compliance Calendar', href: '/compliance-calendar' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Disclaimer', href: '/disclaimer' },
      { label: 'Refund Policy', href: '/refund-policy' },
    ],
  },
] as const

const serviceBreadcrumbLabels = Object.fromEntries(
  SERVICES.map((s) => [s.slug, s.name]),
) as Record<string, string>

export const BREADCRUMB_LABELS: Record<string, string> = {
  services: 'Services',
  tools: 'Tools',
  insights: 'Insights',
  guides: 'Guides',
  practice: 'The Practice',
  contact: 'Contact',
  glossary: 'Glossary',
  'case-studies': 'Case Studies',
  'compliance-calendar': 'Compliance Calendar',
  privacy: 'Privacy Policy',
  terms: 'Terms of Service',
  disclaimer: 'Disclaimer',
  'refund-policy': 'Refund Policy',
  principal: 'The Principal',
  ...serviceBreadcrumbLabels,
}

export const CTA = { label: 'Book a consultation', href: '/contact' } as const
