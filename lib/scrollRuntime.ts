/** Client-only scroll capability helpers — keep native momentum on phones. */

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isCoarsePointer(): boolean {
  return (
    window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(hover: none)").matches
  );
}

export function isLowPowerDevice(): boolean {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  if (nav.connection?.saveData) return true;
  const type = nav.connection?.effectiveType;
  if (type === "slow-2g" || type === "2g") return true;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4) return true;
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
    return window.innerWidth < 1024;
  }
  return false;
}

/** Desktop mouse/trackpad only. Touch OS already has compositor-smooth scrolling. */
export function shouldSmoothWheel(): boolean {
  if (prefersReducedMotion()) return false;
  if (isCoarsePointer()) return false;
  if (window.innerWidth < 1024) return false;
  if (isLowPowerDevice()) return false;
  return true;
}

export function shouldUseScrollParallax(): boolean {
  return (
    !prefersReducedMotion() &&
    !isCoarsePointer() &&
    window.matchMedia("(min-width: 1024px)").matches
  );
}

/** Run `fn` at most once per animation frame. */
export function rafThrottle(fn: () => void): () => void {
  let ticking = false;
  return () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      fn();
    });
  };
}
