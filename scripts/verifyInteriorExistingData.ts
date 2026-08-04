/**
 * CMS / seed interior data alignment (Render DB + offline fallback).
 * Run: npx tsx scripts/verifyInteriorExistingData.ts
 * Live API: set INTERIOR_VERIFY_API=1 and NEXT_PUBLIC_API_URL
 */
import { CMS_INTERIOR_SEED_SLUGS } from "../lib/cmsInteriorSeedSlugs";
import { buildInteriorCatalog, getInteriorProjectFromFallback } from "../lib/interiorData";
import { interiorDetailPath, interiorDetailSlug, legacyInteriorSlugRedirect } from "../lib/interiorRoutes";
import { fallbackHomeData } from "../lib/fallbackData";

let failed = 0;
function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error("FAIL:", msg);
    failed += 1;
  } else {
    console.log("OK:", msg);
  }
}

async function main() {
  assert(fallbackHomeData.projects.length === 8, "fallback has 8 seed-shaped projects");

  for (const slug of CMS_INTERIOR_SEED_SLUGS) {
    assert(
      fallbackHomeData.projects.some((p) => p.slug === slug),
      `fallback includes seed slug ${slug}`,
    );
  }

  const catalog = buildInteriorCatalog(
    fallbackHomeData.projects as unknown as Record<string, unknown>[],
    "en",
  );
  assert(catalog.length === 8, "buildInteriorCatalog accepts all seed fallback rows");

  for (const item of catalog) {
    const path = interiorDetailPath(item);
    assert(!path.match(/\/interior\/\d+$/), `catalog link not numeric: ${path}`);
    assert(!path.match(/\/interior\/seed-/), `catalog link not internal id: ${path}`);
  }

  for (const slug of CMS_INTERIOR_SEED_SLUGS) {
    const detail = getInteriorProjectFromFallback(slug, "en");
    assert(detail !== null, `fallback detail by slug ${slug}`);
    assert(detail?.slug === slug, `fallback detail slug ${slug}`);
    const path = interiorDetailPath({ slug, _id: detail?._id, title: detail?.title });
    assert(path === `/interior/${slug}`, `interiorDetailPath for CMS ${slug}`);
  }

  assert(legacyInteriorSlugRedirect("1") === "amber-residence", "legacy numeric 1 → amber-residence");
  assert(legacyInteriorSlugRedirect("2") === "skyline-apartment", "legacy numeric 2 → skyline-apartment");
  assert(legacyInteriorSlugRedirect("9") === "urban-loft-bedroom", "legacy numeric 9 → mock slug");

  for (const slug of CMS_INTERIOR_SEED_SLUGS) {
    const explicit = interiorDetailSlug({ slug, _id: "6a6c47b77a0ea575782afb36", title: "X" });
    assert(explicit === slug, `interiorDetailSlug prefers CMS slug ${slug} over mongo id`);
  }

  if (process.env.INTERIOR_VERIFY_API === "1") {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://varsovia-design.onrender.com/api";
    console.log("\nLive API:", apiBase);
    const res = await fetch(`${apiBase}/projects?limit=50`);
    assert(res.ok, "GET /projects ok");
    const body = await res.json();
    const rows = (body.data ?? body) as Array<{ slug?: string; _id?: string; title?: string }>;
    const list = Array.isArray(rows) ? rows : [];
    assert(list.length >= 8, "API returns at least 8 projects");

    for (const slug of CMS_INTERIOR_SEED_SLUGS) {
      const row = list.find((p) => p.slug === slug);
      assert(Boolean(row), `live API has project slug ${slug}`);
      if (!row?._id) continue;
      const bySlug = await fetch(`${apiBase}/projects/${encodeURIComponent(slug)}`);
      assert(bySlug.ok, `GET /projects/${slug} ok`);
      const byId = await fetch(`${apiBase}/projects/${encodeURIComponent(String(row._id))}`);
      assert(byId.ok, `GET /projects/${row._id} (mongo id) ok`);
    }

    const { fetchProjectById } = await import("../lib/api");
    const live = await fetchProjectById("amber-residence", "en");
    assert(live?.slug === "amber-residence", "fetchProjectById(amber-residence)");
    const mongoId = list.find((p) => p.slug === "skyline-apartment")?._id;
    if (mongoId) {
      const byMongo = await fetchProjectById(String(mongoId), "en");
      assert(byMongo?.slug === "skyline-apartment", "fetchProjectById(mongo id) resolves slug");
    }
  }

  console.log("\n---");
  if (failed > 0) {
    console.error(`${failed} assertion(s) failed`);
    process.exit(1);
  }
  console.log("All existing-data interior assertions passed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
