import type { Variants, Transition } from "framer-motion";

/** House ease — calm, decisive, good for text and section entrances. */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const baseTransition: Transition = {
  duration: 0.7,
  ease: EASE,
};

/** Fade + rise. Use for headings, paragraphs, cards on view enter. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: baseTransition,
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: EASE } },
};

/** Parent that staggers its children by ~80ms (within the 60–100ms budget). */
export const staggerContainer = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
});

/** Shared whileInView config — animate once, trigger a little before fully visible. */
export const inViewport = {
  once: true,
  amount: 0.3,
  margin: "0px 0px -10% 0px",
} as const;
