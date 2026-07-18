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

/** Shared whileInView config — animate once when any part enters the viewport.
 *  Use amount: "some" (not a fraction): tall mobile sections can exceed 100vh,
 *  so requiring e.g. 30% of the element visible would never fire. */
export const inViewport = {
  once: true,
  amount: "some" as const,
  margin: "0px 0px -48px 0px",
};

/** Softer enter for story beats — slight rise + fade for drama. */
export const storyReveal: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: EASE },
  },
};

/** Scale + fade for illustrations. */
export const illustrReveal: Variants = {
  hidden: { opacity: 0, scale: 0.88, rotate: -2 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
};

/** Slide from the side — flip direction with custom prop via variants factory. */
export const slideFrom = (dir: "start" | "end"): Variants => ({
  hidden: { opacity: 0, x: dir === "start" ? -40 : 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: EASE },
  },
});
