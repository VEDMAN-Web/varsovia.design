/** Shared motion tokens for marketing / homepage sections */

export const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

export const VIEWPORT_ONCE = { once: true, margin: "-8%" as const };

export const VIEWPORT_ONCE_TIGHT = { once: true, margin: "-5%" as const };

export const revealTransition = (delay = 0, duration = 0.65) => ({
  duration,
  delay,
  ease: REVEAL_EASE,
});

export const staggerContainer = (stagger = 0.1, delayChildren = 0.06) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

export const fadeUpItem = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: revealTransition(0),
  },
};

export const fadeUpBlurItem = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: revealTransition(0, 0.75),
  },
};

/** Collage cards — index picks entrance direction */
export function collageReveal(index: number) {
  const fromLeft = index === 0 || index === 2;
  return {
    hidden: {
      opacity: 0,
      x: fromLeft ? -36 : 36,
      y: index === 2 ? 28 : 18,
      scale: 0.96,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: revealTransition(index * 0.12, 0.8),
    },
  };
}

export const reducedFadeUpItem = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

export const scaleFadeItem = {
  hidden: { opacity: 0, scale: 0.94, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: revealTransition(0, 0.55),
  },
};

export const reducedScaleFadeItem = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35 } },
};
