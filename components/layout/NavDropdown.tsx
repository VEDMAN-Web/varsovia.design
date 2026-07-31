"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";

export const NAV_DROPDOWN_EASE = [0.22, 1, 0.36, 1] as const;

/** Panel open/close — use with AnimatePresence on the parent */
export const navDropdownVariants = {
  initial: {
    opacity: 0,
    y: 8,
    scale: 0.96,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.34,
      ease: NAV_DROPDOWN_EASE,
    },
  },
  exit: {
    opacity: 0,
    y: 4,
    scale: 0.98,
    transition: {
      duration: 0.2,
      ease: NAV_DROPDOWN_EASE,
    },
  },
};

export const navDropdownReducedVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
};

/** @deprecated Use navDropdownVariants + AnimatePresence */
export const NAV_DROPDOWN_MOTION = {
  initial: navDropdownVariants.initial,
  animate: navDropdownVariants.animate,
  exit: navDropdownVariants.exit,
  transition: { duration: 0.34, ease: NAV_DROPDOWN_EASE },
};

const PANEL_BASE =
  "absolute top-full z-50 mt-3 overflow-hidden rounded-[14px] border border-[#e5dcd3]/90 bg-gradient-to-b from-white via-white to-[#fdf8f7] shadow-[0_22px_54px_rgba(107,44,58,0.13),0_6px_18px_rgba(42,26,30,0.05)] backdrop-blur-md will-change-[transform,opacity]";

const LINK_HOVER =
  "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#f7f1f2]/90 hover:pl-[22px]";

const ACCENT_BAR =
  "absolute left-0 top-1/2 h-0 w-[3px] -translate-y-1/2 rounded-r-full bg-maroon transition-all duration-300 group-hover:h-[55%]";

type PanelProps = {
  children: ReactNode;
  className?: string;
  align?: "left" | "right";
  wide?: boolean;
};

export function NavDropdownPanel({
  children,
  className = "",
  align = "left",
  wide = false,
}: PanelProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      role="menu"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={reduceMotion ? navDropdownReducedVariants : navDropdownVariants}
      style={{ transformOrigin: align === "right" ? "top right" : "top left" }}
      className={`${PANEL_BASE} ${align === "right" ? "right-0 left-auto" : "left-0"} ${
        wide ? "w-[min(92vw,600px)]" : "min-w-[272px]"
      } ${className}`}
    >
      {/* Closes the hover gap between trigger and panel */}
      <div className="absolute -top-3 left-0 right-0 h-3" aria-hidden />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c4a484]/50 to-transparent"
        aria-hidden
      />
      {children}
    </motion.div>
  );
}

export const navDropdownItemVariants = {
  initial: { opacity: 0, x: -8 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.28, ease: NAV_DROPDOWN_EASE },
  },
};

export function NavDropdownBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`py-2 ${className}`}
      initial={reduceMotion ? false : "initial"}
      animate={reduceMotion ? undefined : "animate"}
      variants={{
        initial: {},
        animate: {
          transition: { staggerChildren: 0.035, delayChildren: 0.06 },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function NavDropdownFeatured({
  href,
  label,
  subtitle,
  onNavigate,
}: {
  href: string;
  label: string;
  subtitle?: string;
  onNavigate?: () => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: NAV_DROPDOWN_EASE, delay: 0.04 }}
    >
      <Link
        href={href}
        onClick={onNavigate}
        className="group relative flex items-center justify-between gap-3 border-b border-[#ece3df]/80 bg-gradient-to-r from-[#6a414d]/[0.07] via-[#6a414d]/[0.03] to-transparent px-5 py-4 transition-colors duration-300 hover:from-[#6a414d]/[0.1]"
      >
        <span className="min-w-0">
          <span className="block font-outfit text-[11px] font-medium uppercase tracking-[0.14em] text-[#6a414d]/55">
            Explore
          </span>
          <span className="mt-0.5 block font-outfit text-[16px] font-medium leading-snug text-maroon">
            {label}
          </span>
          {subtitle && (
            <span className="mt-0.5 block font-outfit text-[13px] font-normal leading-snug text-[#6a414d]/65">
              {subtitle}
            </span>
          )}
        </span>
        <ChevronRight
          size={16}
          strokeWidth={1.75}
          className="shrink-0 text-maroon/50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-maroon"
        />
      </Link>
    </motion.div>
  );
}

export function NavDropdownDivider() {
  return (
    <div
      className="mx-5 h-px bg-gradient-to-r from-transparent via-[#e5dcd3]/90 to-transparent"
      aria-hidden
    />
  );
}

function NavDropdownLinkMotion({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <>{children}</>;
  return (
    <motion.div variants={navDropdownItemVariants} className="min-w-0">
      {children}
    </motion.div>
  );
}

export function NavDropdownLink({
  href,
  label,
  subtitle,
  onNavigate,
}: {
  href: string;
  label: string;
  subtitle?: string;
  onNavigate?: () => void;
}) {
  return (
    <NavDropdownLinkMotion>
      <Link
        href={href}
        onClick={onNavigate}
        className={`group relative flex items-center justify-between gap-3 py-2.5 pl-5 pr-4 ${LINK_HOVER}`}
      >
        <span className={ACCENT_BAR} aria-hidden />
        <span className="min-w-0 flex-1">
          <span className="block font-outfit text-[15px] font-medium leading-snug text-[#2b2b2b] transition-colors duration-300 group-hover:text-maroon">
            {label}
          </span>
          {subtitle && (
            <span className="mt-0.5 block font-outfit text-[12px] font-normal leading-snug text-[#6a414d]/60 transition-colors duration-300 group-hover:text-[#6a414d]/75">
              {subtitle}
            </span>
          )}
        </span>
        <ChevronRight
          size={14}
          strokeWidth={1.75}
          className="shrink-0 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-maroon/70"
        />
      </Link>
    </NavDropdownLinkMotion>
  );
}

export function NavDropdownRichLink({
  href,
  title,
  subtitle,
  onNavigate,
}: {
  href: string;
  title: string;
  subtitle: string;
  onNavigate?: () => void;
}) {
  return (
    <NavDropdownLinkMotion>
      <Link
        href={href}
        onClick={onNavigate}
        className={`group relative block px-5 py-3 ${LINK_HOVER}`}
      >
        <span className={ACCENT_BAR} aria-hidden />
        <span className="block font-outfit text-[15px] font-medium leading-snug text-maroon transition-colors duration-300 group-hover:text-[#5a3540]">
          {title}
        </span>
        <span className="mt-0.5 block font-outfit text-[12px] font-normal leading-snug text-[#6a414d]/65 transition-colors duration-300 group-hover:text-[#6a414d]/80">
          {subtitle}
        </span>
      </Link>
    </NavDropdownLinkMotion>
  );
}

export function NavDropdownSectionLabel({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.p
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={reduceMotion ? undefined : { opacity: 1 }}
      transition={{ duration: 0.25, delay: 0.08 }}
      className="px-5 pb-1 pt-2 font-outfit text-[10px] font-medium uppercase tracking-[0.16em] text-[#6a414d]/45"
    >
      {children}
    </motion.p>
  );
}

export function NavLanguageOption({
  flag,
  label,
  active,
  onClick,
}: {
  flag: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <NavDropdownLinkMotion>
      <button
        type="button"
        onClick={onClick}
        className={`group flex w-full items-center gap-3 px-5 py-3 text-left transition-all duration-300 ${
          active
            ? "bg-[#6a414d]/[0.06] text-maroon"
            : "text-[#2b2b2b] hover:bg-[#f7f1f2]/90 hover:text-maroon"
        }`}
      >
        <span
          className={`relative flex h-[18px] w-[26px] shrink-0 overflow-hidden rounded-[3px] ring-1 transition-all duration-300 ${
            active ? "ring-maroon/30 shadow-sm" : "ring-[#e5dcd3]/80 group-hover:ring-maroon/20"
          }`}
        >
          <Image src={flag} alt="" width={26} height={18} className="h-full w-full object-cover" />
        </span>
        <span className="flex-1 font-outfit text-[15px] font-medium">{label}</span>
        {active && <Check size={15} strokeWidth={2} className="shrink-0 text-maroon" />}
      </button>
    </NavDropdownLinkMotion>
  );
}

/** Mobile accordion sub-links — matches desktop dropdown language */
export const mobileSubLink =
  "relative block py-2.5 pl-3 font-outfit text-[15px] font-normal leading-snug text-[#555] transition-all duration-300 before:absolute before:left-0 before:top-1/2 before:h-0 before:w-[2px] before:-translate-y-1/2 before:rounded-full before:bg-maroon before:transition-all before:duration-300 hover:pl-4 hover:text-maroon hover:before:h-[50%]";

export const mobileSubLinkFeatured =
  "block py-2.5 font-outfit text-[15px] font-medium leading-snug text-maroon transition-colors duration-300 hover:text-[#5a3540]";

export const mobileSubLinkRich =
  "relative block py-2.5 pl-3 transition-all duration-300 before:absolute before:left-0 before:top-1/2 before:h-0 before:w-[2px] before:-translate-y-1/2 before:rounded-full before:bg-maroon before:transition-all before:duration-300 hover:pl-4 hover:before:h-[50%]";
