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
    "Isaac's lead gen system booked 284 meetings in our first month, and we didn't even add a single SDR.",
  attribution: "Anna",
  role: "B2B SaaS Founder",
};

export const proofMetrics: ProofMetric[] = [
  { value: "12.4K", label: "leads / mo" },
  { value: "61%", label: "booking rate" },
  { value: "284", label: "meetings booked" },
];
