import React from 'react';
import Link from 'next/link';

export interface RelatedServiceProps {
  slug: string;
  title: string;
  description: string;
}

export function RelatedServices({ services }: { services: RelatedServiceProps[] }) {
  if (!services || services.length === 0) return null;

  return (
    <section className="my-14 pt-10 border-t border-rule" aria-labelledby="related-services-heading">
      <h2 id="related-services-heading" className="font-display text-3xl text-ink mb-8">
        Related Compliance Services
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Link 
            key={service.slug} 
            href={`/${service.slug}`}
            className="group block p-6 border border-rule rounded-sm bg-white hover:bg-paper hover:border-seal transition-all focus:outline-none focus:ring-2 focus:ring-seal h-full flex flex-col"
          >
            <h3 className="font-display text-xl text-ink group-hover:text-seal transition-colors mb-3">
              {service.title}
            </h3>
            <p className="font-body text-base text-ink-soft line-clamp-3 mb-6 flex-grow">
              {service.description}
            </p>
            <div className="mt-auto font-label text-sm text-seal flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
              View Service <span aria-hidden="true">&rarr;</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
