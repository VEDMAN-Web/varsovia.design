"use client";

import { Link } from "@/lib/i18n/navigation";
import { LogoWingSvg } from "@/components/preloader/preloaderLogo";
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

  const inner = lockupResolved ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={lockupResolved}
      alt={`${line1} ${line2}`}
      className={
        variant === "header"
          ? "h-[44px] w-auto max-w-[160px] object-contain object-left md:h-[74px] md:max-w-[200px]"
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
          ? "flex w-[72px] flex-col items-center gap-[3px] md:w-[82.703px] md:gap-[4px]"
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
              ? "h-[30px] w-auto object-contain md:h-[43.625px]"
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
              ? "h-[30px] w-[19px] md:h-[43.625px] md:w-[27.818px]"
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
                ? "font-display text-[12px] font-bold leading-[17px] tracking-[0.02em] md:text-[16.68px] md:leading-[23px]"
                : "font-display text-[1.5rem] font-bold leading-tight sm:text-[26px] sm:leading-[34px] lg:text-[31.413px] lg:leading-[42.835px]"
            }
          >
            {line1}
          </p>
          <p
            className={
              variant === "header"
                ? "font-outfit text-center text-[6px] font-normal tracking-[7px] md:text-[8px] md:tracking-[9.5px]"
                : "font-outfit text-center text-[11px] font-normal tracking-[0.38em] sm:text-[12.138px] sm:tracking-[16.9934px]"
            }
          >
            {line2}
          </p>
        </div>
      ) : null}
    </div>
  );

  const wrapped = link ? (
    <Link href="/" className={`shrink-0 ${className}`.trim()} aria-label={`${line1} ${line2} home`}>
      {inner}
    </Link>
  ) : (
    <div className={className}>{inner}</div>
  );

  return wrapped;
}
