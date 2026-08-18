type FixedBackgroundImageProps = {
  src: string;
  alt: string;
  /** Sizing/shape classes for the clip frame (height or aspect ratio, radius, border). */
  className?: string;
};

/** Cover image in a clip frame. No `background-attachment: fixed` (GPU killer). */
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
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover object-center"
        draggable={false}
      />
    </div>
  );
}
