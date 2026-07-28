import Link from "next/link";
import { LogoWingSvg } from "@/components/preloader/preloaderLogo";

/** Figma header logo — Frame 2147205489 @ 82.7×74.3, x=100 y=14 */
export default function NavbarLogo() {
  return (
    <Link href="/" className="shrink-0" aria-label="Varsovia Design home">
      <div className="flex w-[82.703px] flex-col items-center gap-[4px]">
        <LogoWingSvg className="h-[43.625px] w-[27.818px]" fill="var(--maroon)" />
        <div className="w-full text-[#2b2b2b]">
          <p className="font-display text-[16.68px] font-bold leading-[23px] tracking-[0.02em]">
            VARSOVIA
          </p>
          <p className="font-outfit text-center text-[8px] font-normal tracking-[9.5px]">
            DESIGN
          </p>
        </div>
      </div>
    </Link>
  );
}
