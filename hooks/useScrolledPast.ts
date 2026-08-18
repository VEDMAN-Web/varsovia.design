"use client";

import { useEffect, useState } from "react";

/**
 * True once the user has scrolled past `px`. Uses IntersectionObserver —
 * no scroll event, no layout reads on every frame.
 */
export function useScrolledPast(px: number) {
  const [past, setPast] = useState(false);

  useEffect(() => {
    const sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText = [
      "position:absolute",
      "top:0",
      "left:0",
      "width:1px",
      `height:${Math.max(1, px)}px`,
      "pointer-events:none",
      "visibility:hidden",
      "z-index:-1",
    ].join(";");
    document.body.prepend(sentinel);

    const io = new IntersectionObserver(
      ([entry]) => {
        setPast(!entry.isIntersecting);
      },
      { threshold: 0 },
    );
    io.observe(sentinel);

    return () => {
      io.disconnect();
      sentinel.remove();
    };
  }, [px]);

  return past;
}
