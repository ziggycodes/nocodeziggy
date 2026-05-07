import type { Transition, Variants } from "motion/react";

export const ease = {
  outCubic: [0.22, 1, 0.36, 1] as const,
  outQuart: [0.16, 1, 0.3, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: ease.outCubic } },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: ease.outQuart },
  },
};

export const stagger = (delay = 0.06): Transition => ({
  staggerChildren: delay,
});

export const sectionReveal: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.4, ease: ease.outCubic, when: "beforeChildren", staggerChildren: 0.06 },
  },
};

export const drawIn: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.9, ease: ease.outQuart },
  },
};
