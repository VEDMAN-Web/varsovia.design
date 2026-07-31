"use client";

import Magnetic, { type MagneticProps } from "@/components/ui/Magnetic";
import { Link } from "@/lib/i18n/navigation";

type MagneticButtonVariant = "primary" | "outline" | "ghost";

type MagneticButtonBase = {
  children: React.ReactNode;
  className?: string;
  variant?: MagneticButtonVariant;
  fullWidthMobile?: boolean;
  magnetic?: boolean;
  magneticPadding?: MagneticProps["padding"];
  magneticStrength?: MagneticProps["strength"];
  magneticMaxOffset?: MagneticProps["maxOffset"];
};

type MagneticButtonAsLink = MagneticButtonBase & {
  href: string;
  onClick?: never;
  type?: never;
};

type MagneticButtonAsButton = MagneticButtonBase & {
  href?: never;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
};

export type MagneticButtonProps = MagneticButtonAsLink | MagneticButtonAsButton;

const VARIANT_CLASS: Record<MagneticButtonVariant, string> = {
  primary: "btn-primary rounded-md",
  outline:
    "inline-flex items-center justify-center rounded-md border border-white/70 bg-transparent px-6 py-3 font-outfit text-[0.75rem] font-medium uppercase tracking-[0.1em] text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-[var(--maroon)] sm:px-7 sm:text-[0.8rem] sm:tracking-[0.12em]",
  ghost:
    "inline-flex items-center justify-center rounded-md border border-[#ecd5db] bg-white px-6 py-3 font-outfit text-[0.75rem] font-medium uppercase tracking-[0.1em] text-[#6a414d] transition-colors duration-300 hover:border-[#d65a7c] hover:text-[#d65a7c] sm:px-7 sm:text-[0.8rem]",
};

function isHashOrExternal(href: string) {
  return href.startsWith("#") || /^https?:\/\//i.test(href);
}

function mergeClasses(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export default function MagneticButton({
  children,
  className,
  variant = "primary",
  fullWidthMobile = true,
  magnetic = true,
  magneticPadding = 12,
  magneticStrength = 0.34,
  magneticMaxOffset = 14,
  ...rest
}: MagneticButtonProps) {
  const sizeClass = fullWidthMobile ? "w-full text-center sm:w-auto" : "";
  const surfaceClass = mergeClasses(VARIANT_CLASS[variant], sizeClass, className);

  const inner =
    "href" in rest && rest.href ? (
      isHashOrExternal(rest.href) ? (
        <a href={rest.href} className={surfaceClass}>
          {children}
        </a>
      ) : (
        <Link href={rest.href} className={surfaceClass}>
          {children}
        </Link>
      )
    ) : (
      <button type={rest.type ?? "button"} onClick={rest.onClick} className={surfaceClass}>
        {children}
      </button>
    );

  if (!magnetic) return inner;

  return (
    <Magnetic
      padding={magneticPadding}
      strength={magneticStrength}
      maxOffset={magneticMaxOffset}
      className={fullWidthMobile ? "block w-full sm:inline-block sm:w-auto" : undefined}
    >
      <div className={fullWidthMobile ? "w-full sm:w-auto" : undefined}>{inner}</div>
    </Magnetic>
  );
}
