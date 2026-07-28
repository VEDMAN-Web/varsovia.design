import type { ReactNode } from "react";
import {
  SITE_SECTION_HEADING_WIDE,
  SITE_SECTION_SHELL,
} from "@/components/ui/layoutShared";

export { SITE_SECTION_SHELL as SECTION_SHELL, SITE_SECTION_HEADING_WIDE as SECTION_HEADING_WIDE } from "@/components/ui/layoutShared";

type SectionShellProps = {
  children: ReactNode;
  className?: string;
};

export default function SectionShell({ children, className = "" }: SectionShellProps) {
  return <div className={`${SITE_SECTION_SHELL} ${className}`.trim()}>{children}</div>;
}
