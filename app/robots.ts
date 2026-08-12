import type { MetadataRoute } from "next";
import { getPublicSiteUrl } from "@/lib/publicEnv";

export default function robots(): MetadataRoute.Robots {
  const base = getPublicSiteUrl().replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      // LLM / AI search crawler (Group A SEO directive — confirm with client if needed)
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
