"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ContactCollage from "@/components/forms/ContactCollage";
import { CONTACT_MOSAIC_BAND } from "@/components/forms/contactLayoutShared";

const BOARD_W = 1240;
const BOARD_H = 846;
const MOSAIC_W = BOARD_W * 0.475;

type ContactMosaicBandProps = {
  images?: string[];
  className?: string;
  fillParent?: boolean;
  maxHeight?: number;
};

type MosaicLayout = {
  scaleX: number;
  scaleY: number;
};

export default function ContactMosaicBand({
  images = [],
  className = "",
  fillParent = false,
  maxHeight = 0,
}: ContactMosaicBandProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<MosaicLayout>({ scaleX: 0.75, scaleY: 0.75 });

  const measure = useCallback(() => {
    const el = hostRef.current;
    if (!el) return;
    const width = el.clientWidth;
    const height = maxHeight > 0 ? maxHeight : el.clientHeight;
    if (width < 1 || height < 1) return;

    const scaleForWidth = width / MOSAIC_W;
    const scaledH = BOARD_H * scaleForWidth;

    if (scaledH <= height) {
      setLayout({ scaleX: scaleForWidth, scaleY: scaleForWidth });
      return;
    }

    const scaleY = height / BOARD_H;
    const scaleX = width / (MOSAIC_W * scaleY);
    setLayout({ scaleX, scaleY });
  }, [maxHeight]);

  useEffect(() => {
    if (!fillParent) return;
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
  }, [fillParent, measure, maxHeight]);

  const collage = (
    <div className="relative aspect-[1240/846] w-[210.526316%] max-w-none shrink-0">
      <ContactCollage images={images} variant="section" />
    </div>
  );

  if (fillParent) {
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

  return (
    <div className={`relative overflow-hidden ${CONTACT_MOSAIC_BAND} ${className}`.trim()}>
      {collage}
    </div>
  );
}
