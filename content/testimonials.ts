export type Testimonial = {
  quote: string;
  attribution: string;
  role?: string;
};

export type ProofMetric = {
  value: string;
  label: string;
};

export const featuredTestimonial: Testimonial = {
  quote:
    "Ziggy's lead gen system booked 284 meetings in our first month — we didn't add a single SDR.",
  attribution: "Growth lead",
  role: "B2B SaaS operator",
};

export const proofMetrics: ProofMetric[] = [
  { value: "12.4K", label: "leads / mo" },
  { value: "61%", label: "booking rate" },
  { value: "284", label: "meetings booked" },
];
