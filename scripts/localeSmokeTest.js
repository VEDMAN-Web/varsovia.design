/**
 * Locale smoke — verifies th/pl content differs from en on API + live pages.
 * Usage: FE_URL=http://127.0.0.1:3000 API_URL=http://127.0.0.1:5001/api node scripts/localeSmokeTest.js
 */
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const FE = (process.env.FE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const API = (process.env.API_URL || "http://127.0.0.1:5001/api").replace(/\/$/, "");

const results = [];
function pass(name, detail = "") {
  results.push({ name, ok: true, detail });
  console.log(`  ✓ ${name}${detail ? ` — ${detail}` : ""}`);
}
function fail(name, detail = "") {
  results.push({ name, ok: false, detail });
  console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
}

async function site(locale) {
  const r = await fetch(`${API}/site?locale=${locale}`);
  const body = await r.json();
  return body.data || body;
}

async function html(path) {
  const r = await fetch(`${FE}${path}`);
  return { status: r.status, html: await r.text() };
}

async function main() {
  console.log("\nLocale smoke test");
  console.log(`  FE: ${FE}`);
  console.log(`  API: ${API}\n`);

  const en = await site("en");
  const th = await site("th");
  const pl = await site("pl");

  const apiChecks = [
    ["heroHeadline", en.heroHeadline, th.heroHeadline, pl.heroHeadline],
    ["faqPage.heroTitle", en.faqPage?.heroTitle, th.faqPage?.heroTitle, pl.faqPage?.heroTitle],
    ["contactPage.locationTitle", en.contactPage?.locationTitle, th.contactPage?.locationTitle, pl.contactPage?.locationTitle],
    ["legalPages.privacy.title", en.legalPages?.privacy?.title, th.legalPages?.privacy?.title, pl.legalPages?.privacy?.title],
    ["sectionCopy.featured.title", en.sectionCopy?.featured?.title, th.sectionCopy?.featured?.title, pl.sectionCopy?.featured?.title],
    ["sectionCopy.featured.ctaLabel", en.sectionCopy?.featured?.ctaLabel, th.sectionCopy?.featured?.ctaLabel, pl.sectionCopy?.featured?.ctaLabel],
    ["teamPage.heroTitle", en.teamPage?.heroTitle, th.teamPage?.heroTitle, pl.teamPage?.heroTitle],
    ["aboutTitle", en.aboutTitle, th.aboutTitle, pl.aboutTitle],
    ["cataloguePage.heroTitle", en.cataloguePage?.heroTitle, th.cataloguePage?.heroTitle, pl.cataloguePage?.heroTitle],
  ];

  for (const [label, e, t, p] of apiChecks) {
    if (!e) {
      fail(`API ${label} en`, "empty");
      continue;
    }
    if (t && t !== e) pass(`API ${label} th≠en`, String(t).slice(0, 40));
    else fail(`API ${label} th≠en`, `th="${String(t).slice(0, 40)}"`);
    if (p && p !== e) pass(`API ${label} pl≠en`, String(p).slice(0, 40));
    else fail(`API ${label} pl≠en`, `pl="${String(p).slice(0, 40)}"`);
  }

  // Live pages must contain locale-specific strings
  const pageChecks = [
    ["/th", th.heroHeadline],
    ["/pl", pl.heroHeadline],
    ["/th/faq", th.faqPage?.heroTitle],
    ["/pl/faq", pl.faqPage?.heroTitle],
    ["/th/contact", th.contactPage?.locationTitle],
    ["/pl/contact", pl.contactPage?.locationTitle],
    ["/th/privacy", th.legalPages?.privacy?.title],
    ["/pl/privacy", pl.legalPages?.privacy?.title],
    ["/th/catalogue", th.cataloguePage?.heroTitle],
    ["/pl/catalogue", pl.cataloguePage?.heroTitle],
    ["/th/team", th.teamPage?.heroTitle],
    ["/pl/team", pl.teamPage?.heroTitle],
  ];

  for (const [path, needle] of pageChecks) {
    if (!needle) {
      fail(`Page ${path}`, "no needle");
      continue;
    }
    const { status, html: body } = await html(path);
    if (status !== 200) fail(`Page ${path}`, `HTTP ${status}`);
    else if (body.includes(needle)) pass(`Page ${path}`, needle.slice(0, 40));
    else fail(`Page ${path}`, `missing "${needle.slice(0, 40)}"`);
  }

  // FAQs API locale
  for (const loc of ["th", "pl"]) {
    const r = await fetch(`${API}/faqs?locale=${loc}&limit=5`);
    const body = await r.json();
    const rows = body.data || body;
    const q = Array.isArray(rows) && rows[0] ? rows[0].question : "";
    const enFaq = await fetch(`${API}/faqs?locale=en&limit=5`).then((x) => x.json());
    const enQ = (enFaq.data || enFaq)?.[0]?.question || "";
    if (q && q !== enQ) pass(`FAQ API ${loc}≠en`, String(q).slice(0, 40));
    else fail(`FAQ API ${loc}≠en`, String(q).slice(0, 40));
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  if (failed.length) {
    console.log("\nFailed:");
    failed.forEach((f) => console.log(`  - ${f.name}: ${f.detail}`));
  }
  console.log("");
  process.exit(failed.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
