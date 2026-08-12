/**
 * Populate Varsovia IA pages with professional EN copy + real site images.
 * Keeps indexable=false (content gate) — flip in Admin when ready to rank.
 *
 * Local:  node src/seed/populateIaContent.js
 * Staging: TEST_API_URL=https://staging-api.varsovia.design/api node src/seed/populateIaContent.js
 */
require("dotenv").config();

const { pages } = require("../data/iaPagesSeedContent");

const API = (process.env.TEST_API_URL || "http://127.0.0.1:5001/api").replace(/\/$/, "");
const KEY = process.env.ADMIN_KEY;
if (!KEY) {
  console.error("Missing ADMIN_KEY");
  process.exit(1);
}

function L(en, th = "", pl = "") {
  return { en, th: th || en, pl: pl || en };
}

async function main() {
  console.log(`Populating IA content via ${API}`);
  const get = await fetch(`${API}/site`, { headers: { "x-admin-key": KEY } });
  const prev = await get.json();
  if (!get.ok) throw new Error(JSON.stringify(prev));

  const res = await fetch(`${API}/site`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "x-admin-key": KEY },
    body: JSON.stringify({
      pages,
      projectsPage: {
        ...(prev.data?.projectsPage || {}),
        indexable: false,
        metaTitle: L("Projects | Varsovia Design"),
        metaDescription: L(
          "Explore Varsovia Design projects — kitchens, bedrooms, and whole-home interiors across Thailand.",
        ),
        heroTitle: L("Every space, every story"),
        heroSubtitle: L("Selected interiors and furniture projects from Varsovia Design."),
      },
    }),
  });
  const out = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(JSON.stringify(out.error || out));

  const after = await fetch(`${API}/site?locale=en`).then((r) => r.json());
  const d = after.data || after;
  const furn = d.pages?.furniture;
  const dev = d.pages?.forDevelopers;
  console.log("✓ furniture sections:", furn?.sections?.length || 0);
  console.log("✓ forDevelopers body:", String(dev?.body || "").slice(0, 80));
  console.log("✓ forDevelopers sections:", dev?.sections?.length || 0);
  console.log("Done — edit in Admin → Varsovia → Site Settings.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
