"use client";

import { useCallback, useState } from "react";
import { useRouter } from "@/lib/i18n/navigation";
import { LogoWingSvg } from "@/components/preloader/preloaderLogo";
import { useReplayIntro } from "@/components/preloader/IntroProvider";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";
import { resolveMediaUrl } from "@/lib/mediaAssets";

type BrandLogoVariant = "header" | "footer" | "mark";

type BrandLogoProps = {
  variant?: BrandLogoVariant;
  className?: string;
  link?: boolean;
};

const DEFAULT_LINE1 = "VARSOVIA";
const DEFAULT_LINE2 = "DESIGN";

export default function BrandLogo({ variant = "header", className = "", link = true }: BrandLogoProps) {
  const site = useSiteSettings();
  const router = useRouter();
  const replayIntro = useReplayIntro();
  const [replaying, setReplaying] = useState(false);

  const onDark = variant === "footer" || variant === "mark";

  const lockup = onDark
    ? site?.brandLogoLockupOnDark || site?.brandLogoLockup
    : site?.brandLogoLockup;
  const lockupResolved = lockup ? resolveMediaUrl(lockup) : "";

  const markSrc = resolveMediaUrl(
    onDark ? site?.brandLogoMarkOnDark || site?.brandLogoMark : site?.brandLogoMark,
    "",
  );

  const line1 = site?.brandWordmarkLine1?.trim() || DEFAULT_LINE1;
  const line2 = site?.brandWordmarkLine2?.trim() || DEFAULT_LINE2;

  const handleLogoClick = useCallback(
    (e: React.MouseEvent) => {
      // Only intercept plain left-clicks (no modifier keys = new tab etc.)
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();

      // If already replaying, ignore extra clicks
      if (replaying) return;

      setReplaying(true);

      // Navigate to home immediately (runs in background while animation plays)
      // This ensures home page content is mounted under the overlay before zoom ends
      router.push("/");

      replayIntro().then(() => {
        setReplaying(false);
      });
    },
    [replayIntro, router, replaying],
  );

  const inner = lockupResolved ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={lockupResolved}
      alt={`${line1} ${line2}`}
      className={
        variant === "header"
          ? "h-[74px] w-auto max-w-[200px] object-contain object-left"
          : variant === "footer"
            ? "mx-auto h-[72px] w-auto max-w-[220px] object-contain"
            : "h-8 w-auto max-w-[120px] object-contain"
      }
      draggable={false}
    />
  ) : (
    <div
      className={
        variant === "header"
          ? "flex w-[82.703px] flex-col items-center gap-[4px]"
          : variant === "footer"
            ? "flex shrink-0 flex-col items-center gap-2 sm:gap-[7.534px]"
            : "flex flex-col items-center gap-1"
      }
    >
      {markSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={markSrc}
          alt=""
          aria-hidden
          className={
            variant === "header"
              ? "h-[43.625px] w-auto object-contain"
              : variant === "footer"
                ? "mx-auto h-[56px] w-auto object-contain sm:h-[68px] lg:h-[82px]"
                : "h-7 w-auto object-contain"
          }
          draggable={false}
        />
      ) : (
        <LogoWingSvg
          className={
            variant === "header"
              ? "h-[43.625px] w-[27.818px]"
              : variant === "footer"
                ? "mx-auto h-[56px] w-[36px] sm:h-[68px] sm:w-[43px] lg:h-[82.169px] lg:w-[52.396px]"
                : "h-7 w-7"
          }
          fill={onDark ? "white" : "var(--maroon)"}
        />
      )}
      {variant !== "mark" ? (
        <div className={`w-full text-center ${onDark ? "text-white" : "text-[#2b2b2b]"}`}>
          <p
            className={
              variant === "header"
                ? "font-display text-[16.68px] font-bold leading-[23px] tracking-[0.02em]"
                : "font-display text-[1.5rem] font-bold leading-tight sm:text-[26px] sm:leading-[34px] lg:text-[31.413px] lg:leading-[42.835px]"
            }
          >
            {line1}
          </p>
          <p
            className={
              variant === "header"
                ? "font-outfit text-center text-[8px] font-normal tracking-[9.5px]"
                : "font-outfit text-center text-[11px] font-normal tracking-[0.38em] sm:text-[12.138px] sm:tracking-[16.9934px]"
            }
          >
            {line2}
          </p>
        </div>
      ) : null}
    </div>
  );

  if (!link) {
    return <div className={className}>{inner}</div>;
  }

  return (
    <a
      href="/"
      aria-label={`${line1} ${line2} home`}
      className={`shrink-0 ${className}`.trim()}
      onClick={handleLogoClick}
      style={{ cursor: replaying ? "default" : "pointer" }}
    >
      {inner}
    </a>
  );
}
