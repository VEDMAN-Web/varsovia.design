import { getPublicSiteUrl } from "@/lib/publicEnv";

const BUCKETS = ["pages", "journal", "projects", "images"] as const;

/** Sitemap index split by content type (Group A §5). */
export async function GET() {
  const base = getPublicSiteUrl().replace(/\/$/, "");
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${BUCKETS.map(
  (id) => `  <sitemap>
    <loc>${base}/sitemaps/${id}.xml</loc>
  </sitemap>`,
).join("\n")}
</sitemapindex>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
