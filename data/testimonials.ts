// EMPTY BY DESIGN. Do not add testimonials here.
// Every entry requires: (1) the client's written consent to publish, and
// (2) confirmation that publishing testimonials is permitted under the
// advertising rules applicable to this practice — see BRAND-FACTS.md.
// Components render nothing while this array is empty. That is correct behaviour.

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  serviceSlug: string;
  consentObtained: boolean;
  datePublished: string;
};

export const TESTIMONIALS: Testimonial[] = [];

export const TESTIMONIALS_ENABLED = false;
