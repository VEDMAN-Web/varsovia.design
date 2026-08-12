/**
 * Reset IA + projectsPage indexable flags to false (Group A content gate).
 * Keeps copy/meta; only flips indexable so sitemap stays clean until real content.
 * Usage: node src/seed/resetIaIndexable.js
 */
require("dotenv").config();

const API = (process.env.TEST_API_URL || "http://127.0.0.1:5001/api").replace(/\/$/, "");
const KEY = process.env.ADMIN_KEY;

if (!KEY) {
  console.error("Missing ADMIN_KEY");
  process.exit(1);
}

async function main() {
  const get = await fetch(`${API}/site`, { headers: { "x-admin-key": KEY } });
  const body = await get.json();
  if (!get.ok) throw new Error(JSON.stringify(body));
  const site = body.data || {};
  const pages = site.pages || {};

  const nextPages = {};
  for (const [key, hub] of Object.entries(pages)) {
    if (!hub || typeof hub !== "object") continue;
    const h = hub;
    nextPages[key] = {
      ...h,
      indexable: false,
      children: Array.isArray(h.children)
        ? h.children.map((c) => ({ ...c, indexable: false }))
        : [],
    };
  }

  // Attach default locationSlugs on services for geo-relevant modules
  const LOCATION_SERVICE_AFFINITY = {
    "koh-samui": ["custom-furniture", "furniture-packages", "interior-design", "installation"],
    phuket: ["custom-furniture", "furniture-packages", "interior-design", "installation", "renovation"],
    bangkok: ["interior-design", "custom-furniture", "renovation", "installation"],
    pattaya: ["furniture-packages", "custom-furniture", "installation", "renovation"],
    "hua-hin": ["furniture-packages", "interior-design", "custom-furniture", "installation"],
    "chiang-mai": ["interior-design", "custom-furniture", "renovation", "furniture-packages"],
  };
  const serviceToLocations = {};
  for (const [loc, services] of Object.entries(LOCATION_SERVICE_AFFINITY)) {
    for (const slug of services) {
      if (!serviceToLocations[slug]) serviceToLocations[slug] = [];
      if (!serviceToLocations[slug].includes(loc)) serviceToLocations[slug].push(loc);
    }
  }
  if (nextPages.services?.children) {
    nextPages.services.children = nextPages.services.children.map((c) => ({
      ...c,
      locationSlugs: serviceToLocations[c.slug] || Object.keys(LOCATION_SERVICE_AFFINITY),
      indexable: false,
    }));
  }

  const res = await fetch(`${API}/site`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "x-admin-key": KEY },
    body: JSON.stringify({
      pages: nextPages,
      projectsPage: {
        ...(site.projectsPage || {}),
        indexable: false,
      },
    }),
  });
  const out = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(JSON.stringify(out.error || out));

  const after = await fetch(`${API}/site?locale=en`).then((r) => r.json());
  const hubs = after.data?.pages || {};
  let indexed = 0;
  for (const h of Object.values(hubs)) {
    if (h?.indexable === true) indexed++;
    for (const c of h?.children || []) if (c.indexable === true) indexed++;
  }
  console.log(`✓ Indexable reset. Remaining indexable=true count=${indexed}`);
  console.log(`✓ projectsPage.indexable=${after.data?.projectsPage?.indexable}`);
  const svc = hubs.services?.children?.[0];
  console.log(`✓ sample service locationSlugs=${JSON.stringify(svc?.locationSlugs || [])}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
