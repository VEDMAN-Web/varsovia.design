"use client";

type FixedBackgroundImageProps = {
  src: string;
  alt: string;
  /** Sizing/shape classes for the clip frame (height or aspect ratio, radius, border). */
  className?: string;
};

/**
 * Background image with CSS fixed attachment - image stays in viewport while section scrolls.
 */
export default function FixedBackgroundImage({
  src,
  alt,
  className = "",
}: FixedBackgroundImageProps) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      role="img"
      aria-label={alt}
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }}
    />
  );
}
