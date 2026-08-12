import {
  buildSitemapBucket,
  sitemapEntriesToXml,
  type SitemapBucket,
} from "@/lib/sitemapBuild";

export const dynamic = "force-dynamic";

const ALLOWED = new Set<SitemapBucket>(["pages", "journal", "projects", "images"]);

type Props = { params: Promise<{ type: string }> };

export async function GET(_req: Request, { params }: Props) {
  const { type: raw } = await params;
  const type = raw.replace(/\.xml$/i, "") as SitemapBucket;
  if (!ALLOWED.has(type)) {
    return new Response("Not found", { status: 404 });
  }
  const entries = await buildSitemapBucket(type);
  return new Response(sitemapEntriesToXml(entries), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
