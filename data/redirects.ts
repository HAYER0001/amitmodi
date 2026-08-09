// EMPTY until the old site's URL list is supplied (BRAND-FACTS.md section 7).
// Every URL on the old site that had inbound links or ranked for anything must
// 301 here, or that accumulated authority is thrown away at launch.
// Get the list from Google Search Console > Pages, or from the old sitemap.xml.

export interface Redirect {
  source: string;
  destination: string;
  permanent: true;
}

export const REDIRECTS: Redirect[] = [
  { source: '/gst', destination: '/services/gst-registration', permanent: true },
  { source: '/gst-registration', destination: '/services/gst-registration', permanent: true },
  { source: '/pan', destination: '/services/pan-card-services', permanent: true },
  { source: '/itr', destination: '/services/income-tax-tds-returns', permanent: true },
  { source: '/tds', destination: '/services/income-tax-tds-returns', permanent: true },
  { source: '/appeals', destination: '/services/income-tax-appeals', permanent: true },
  { source: '/iec', destination: '/services/import-export-licence', permanent: true },
  { source: '/import-export', destination: '/services/import-export-licence', permanent: true },
  { source: '/about', destination: '/practice', permanent: true },
  { source: '/about-us', destination: '/practice', permanent: true },
  { source: '/blog', destination: '/insights', permanent: true },
  { source: '/contact-us', destination: '/contact', permanent: true },
];
