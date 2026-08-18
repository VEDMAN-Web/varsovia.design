import Image, { type ImageProps } from "next/image";

function isRemoteHttpUrl(src: string): boolean {
  return /^https?:\/\//i.test(src);
}

/**
 * next/image throws if the hostname is missing from next.config images.remotePatterns.
 * CMS URLs (Pexels, Cloudinary, etc.) can be any host, so remote http(s) srcs use a
 * native img. Local / public paths still go through next/image.
 */
export default function CmsImage({ src, alt, className, fill, sizes, priority, style }: ImageProps) {
  const url = typeof src === "string" ? src : "";
  if (!url) return null;

  if (isRemoteHttpUrl(url)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={alt ?? ""}
        className={fill ? `absolute inset-0 h-full w-full ${className ?? ""}` : className}
        sizes={typeof sizes === "string" ? sizes : undefined}
        style={style}
      />
    );
  }

  return (
    <Image
      src={url}
      alt={alt ?? ""}
      className={className}
      fill={fill}
      sizes={sizes}
      priority={priority}
      style={style}
    />
  );
}
