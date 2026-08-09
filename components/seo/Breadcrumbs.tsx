'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BreadcrumbListSchema } from '@/components/seo/SchemaEmitters';

// We import the label map from navigation data. If a route isn't explicitly
// mapped, we fallback to a formatted version of the URL segment.
import { BREADCRUMB_LABELS } from '@/data/navigation';

export function Breadcrumbs() {
  const pathname = usePathname();
  
  if (!pathname || pathname === '/') {
    return null;
  }

  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = segments.map((segment, index) => {
    const path = `/${segments.slice(0, index + 1).join('/')}`;
    
    // Attempt to match the exact path in the label map.
    // If not found, create a title-cased fallback from the segment string.
    const label = (BREADCRUMB_LABELS && BREADCRUMB_LABELS[path]) 
      || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    
    return { path, label, isLast: index === segments.length - 1 };
  });

  const schemaCrumbs = [{ label: 'Home', path: '/' }, ...breadcrumbs.map(c => ({ label: c.label, path: c.path }))];

  return (
    <>
      <BreadcrumbListSchema crumbs={schemaCrumbs} domain={process.env.NEXT_PUBLIC_SITE_URL ?? "https://amitmodi.com"} />
      <nav aria-label="Breadcrumb" className="my-6">
        <ol className="flex flex-wrap items-center space-x-2 text-sm font-label text-ink-soft">
        <li>
          <Link href="/" className="hover:text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-seal rounded">
            Home
          </Link>
        </li>
        {breadcrumbs.map((crumb) => (
          <React.Fragment key={crumb.path}>
            <li aria-hidden="true" className="text-rule select-none">/</li>
            <li>
              {crumb.isLast ? (
                <span aria-current="page" className="text-ink font-medium">
                  {crumb.label}
                </span>
              ) : (
                <Link 
                  href={crumb.path} 
                  className="hover:text-ink transition-colors focus:outline-none focus:ring-2 focus:ring-seal rounded"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
      </nav>
    </>
  );
}
