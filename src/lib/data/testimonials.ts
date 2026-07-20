// Testimonials — none exist yet; the Signals section renders the press feature as
// its anchor and lays out any entries added here as floating quote cards.
// Ahmad: add real, attributed quotes (e.g. LION Lab advisor, First Solar manager,
// Toledo Athletics staff). Do not add placeholder or invented quotes.

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  org: string;
  avatar?: string;
}

export const testimonials: Testimonial[] = [];
