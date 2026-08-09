import { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.complianceincheck.com';

export const homepageMetadata: Metadata = {
  title: 'GST & Tax Compliance Practice | Compliance in Check',
  description: 'Proactive GST, Income Tax, and statutory compliance filing for growing businesses. We handle the deadlines and defend your revenue from unjust notices.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    images: [
      {
        url: `${SITE_URL}/images/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: 'Compliance in Check',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
};
