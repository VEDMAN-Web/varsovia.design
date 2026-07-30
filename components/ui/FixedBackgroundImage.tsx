"use client";

import { useEffect, useState } from "react";

type FixedBackgroundImageProps = {
  src: string;
  alt: string;
  /** Sizing/shape classes for the clip frame (height or aspect ratio, radius, border). */
  className?: string;
};

/**
 * Image stays fixed in the viewport; only this clip frame scrolls with the page
 * (background-attachment: fixed window effect).
 *
 * Keep this out of any transformed ancestor — a transform on a parent makes the
 * fixed background scroll with the element and kills the effect.
 */
export default function FixedBackgroundImage({
  src,
  alt,
  className = "",
}: FixedBackgroundImageProps) {
  const [fixedSupported, setFixedSupported] = useState(true);

  useEffect(() => {
    const test = document.createElement("div");
    test.style.backgroundAttachment = "fixed";
    setFixedSupported(test.style.backgroundAttachment === "fixed");
  }, []);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      role="img"
      aria-label={alt}
    >
      {fixedSupported ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${src})`,
            backgroundAttachment: "fixed",
          }}
        />
      ) : (
        // Mobile fallback where fixed backgrounds are unsupported
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover object-center"
          draggable={false}
        />
      )}
    </div>
  );
}
