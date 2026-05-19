"use client";

import { motion } from "motion/react";
import {
  featuredTestimonial,
  proofMetrics,
} from "@/content/testimonials";

export function SocialProof() {
  return (
    <section
      aria-label="Client outcomes"
      className="relative border-y border-[var(--color-grid)] bg-[color:rgb(0_0_0/0.45)]"
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between md:gap-10 md:px-10 md:py-10"
      >
        <blockquote className="max-w-[52ch]">
          <p className="text-[15px] leading-relaxed text-[var(--color-hi)] md:text-[16px]">
            &ldquo;{featuredTestimonial.quote}&rdquo;
          </p>
          <footer className="mt-2 text-[12px] text-[var(--color-mid)]">
            — {featuredTestimonial.attribution}
            {featuredTestimonial.role ? `, ${featuredTestimonial.role}` : ""}
          </footer>
        </blockquote>

        <ul
          className="flex flex-wrap gap-6 md:gap-10"
          role="list"
        >
          {proofMetrics.map((m) => (
            <li key={m.label} className="flex flex-col gap-0.5">
              <span className="font-mono text-[clamp(1.25rem,2.5vw,1.75rem)] font-medium text-[var(--color-accent)]">
                {m.value}
              </span>
              <span className="text-hud-label text-[var(--color-mid)]">
                {m.label}
              </span>
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
