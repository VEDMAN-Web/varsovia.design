"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ContactCollage from "@/components/forms/ContactCollage";
const BOARD_W = 1240;
const BOARD_H = 846;
const MOSAIC_W = BOARD_W * 0.475;

type ContactMosaicBandProps = {
  images?: string[];
  className?: string;
  /** Row height from ContactFormPanel (form column); improves scale before flex stretch settles */
  maxHeight?: number;
};

type MosaicLayout = {
  scaleX: number;
  scaleY: number;
};

export default function ContactMosaicBand({
  images = [],
  className = "",
  maxHeight = 0,
}: ContactMosaicBandProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<MosaicLayout>({ scaleX: 0.75, scaleY: 0.75 });

  const measure = useCallback(() => {
    const el = hostRef.current;
    if (!el) return;
    const width = el.clientWidth;
    const measuredH = el.clientHeight;
    const height =
      maxHeight > 0 ? Math.max(maxHeight, measuredH) : measuredH;
    if (width < 1) return;

    const scaleForWidth = width / MOSAIC_W;
    const heightFromWidth = BOARD_H * scaleForWidth;

    if (height < 1) {
      setLayout({ scaleX: scaleForWidth, scaleY: scaleForWidth });
      return;
    }

    if (height > heightFromWidth) {
      const s = height / BOARD_H;
      setLayout({ scaleX: s, scaleY: s });
      return;
    }

    setLayout({ scaleX: scaleForWidth, scaleY: scaleForWidth });
  }, [maxHeight]);

  useEffect(() => {
    measure();
    const el = hostRef.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure, maxHeight]);

  return (
    <div
      ref={hostRef}
      className={`relative h-full min-h-0 w-full overflow-hidden ${className}`.trim()}
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width: BOARD_W,
          height: BOARD_H,
          transform: `scale(${layout.scaleX}, ${layout.scaleY})`,
        }}
      >
        <div className="relative h-full w-full">
          <ContactCollage images={images} variant="section" />
        </div>
      </div>
    </div>
  );
}
