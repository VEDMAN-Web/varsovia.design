/**
 * Interior detail URL slug invariants (no numeric public paths for mock catalog).
 * Run: npx tsx scripts/verifyInteriorRoutes.ts
 */
import { CMS_FALLBACK_NUMERIC_SLUGS } from "../lib/cmsInteriorSeedSlugs";
import { INTERIOR_ITEMS } from "../lib/interiorData";
import {
  INTERIOR_MOCK_SLUGS,
  interiorDetailPath,
  interiorDetailSlug,
  legacyInteriorSlugRedirect,
} from "../lib/interiorRoutes";
import { getInteriorProjectById, interiorStaticParams } from "../lib/interiorData";

let failed = 0;
function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error("FAIL:", msg);
    failed += 1;
  } else {
    console.log("OK:", msg);
  }
}

const mockIds = INTERIOR_ITEMS.map((i) => i.id);
assert(mockIds.length === 24, "mock catalog has 24 items");
assert(
  Object.keys(INTERIOR_MOCK_SLUGS).length === 24,
  "INTERIOR_MOCK_SLUGS covers all mock ids",
);

for (const id of mockIds) {
  assert(Boolean(INTERIOR_MOCK_SLUGS[id]), `mock slug for id ${id}`);
  assert(!/^\d+$/.test(INTERIOR_MOCK_SLUGS[id]), `slug for ${id} is not numeric`);
}

const slugSet = new Set<string>();
for (const item of INTERIOR_ITEMS) {
  const slug = interiorDetailSlug({ _id: item.id, title: item.title });
  assert(!/^\d+$/.test(slug), `id ${item.id} resolves to non-numeric slug (${slug})`);
  assert(!slugSet.has(slug), `unique slug for id ${item.id}: ${slug}`);
  slugSet.add(slug);

  const path = interiorDetailPath({ _id: item.id, title: item.title });
  assert(path === `/interior/${slug}`, `interiorDetailPath for id ${item.id}`);
  assert(!path.match(/\/interior\/\d+$/), `path for id ${item.id} is not /interior/<number>`);

  const legacy = legacyInteriorSlugRedirect(item.id);
  const expectedLegacy =
    CMS_FALLBACK_NUMERIC_SLUGS[item.id] ?? INTERIOR_MOCK_SLUGS[item.id];
  assert(legacy === expectedLegacy, `legacy redirect id ${item.id} → ${expectedLegacy}`);

  const byId = getInteriorProjectById(item.id);
  const bySlug = getInteriorProjectById(slug);
  assert(byId !== null, `getInteriorProjectById(${item.id})`);
  assert(bySlug !== null, `getInteriorProjectById(${slug})`);
  assert(byId?.slug === slug, `project slug for id ${item.id}`);
  assert(byId?._id === item.id, `project _id preserved for id ${item.id}`);
}

const staticParams = interiorStaticParams();
assert(staticParams.length === 24, "interiorStaticParams count");
for (const { slug } of staticParams) {
  assert(slugSet.has(slug), `static param slug registered: ${slug}`);
}

assert(legacyInteriorSlugRedirect("2") === "skyline-apartment", "legacy /2 → skyline-apartment");
assert(legacyInteriorSlugRedirect("1") === "amber-residence", "legacy /1 → amber-residence (CMS seed)");
assert(legacyInteriorSlugRedirect("999") === null, "unknown numeric id no legacy redirect");
assert(legacyInteriorSlugRedirect("skyline-apartment") === null, "slug param no legacy redirect");

console.log("\n---");
if (failed > 0) {
  console.error(`${failed} assertion(s) failed`);
  process.exit(1);
}
console.log("All interior route assertions passed.");
