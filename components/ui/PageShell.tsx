import type { ReactNode } from "react";
import { SITE_SECTION_SHELL } from "@/components/ui/layoutShared";

export { SITE_SECTION_SHELL as PAGE_SHELL } from "@/components/ui/layoutShared";

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

export default function PageShell({ children, className = "" }: PageShellProps) {
  return <div className={`${SITE_SECTION_SHELL} ${className}`.trim()}>{children}</div>;
}
