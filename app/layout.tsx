import type { Metadata } from "next";
import { Oswald, Outfit } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import { fetchSite } from "@/lib/api";
import FooterWrapper from "@/components/layout/FooterWrapper";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Varsovia Kitchen | Premium Modular Kitchens",
  description:
    "Varsovia crafts high-quality modular kitchens with timeless design, premium finishes, and lasting craftsmanship.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = await fetchSite();

  return (
    <html lang="en" className={`${oswald.variable} ${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-ink font-sans">
        <SmoothScroll>
          {children}
          <FooterWrapper site={site} />
        </SmoothScroll>
      </body>
    </html>
  );
}
