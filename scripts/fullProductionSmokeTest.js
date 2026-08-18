/**
 * Full production smoke test — pages, CMS fields, locales, admin round-trip (reverts).
 *
 * Usage (local):
 *   FE_URL=http://localhost:3000 API_URL=http://127.0.0.1:5001/api node scripts/fullProductionSmokeTest.js
 *
 * Usage (staging):
 *   FE_URL=https://staging.varsovia.design API_URL=https://staging-api.varsovia.design/api ADMIN_KEY=... node scripts/fullProductionSmokeTest.js
 */
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const FE = (process.env.FE_URL || "http://localhost:3000").replace(/\/$/, "");
const API = (process.env.API_URL || "http://127.0.0.1:5001/api").replace(/\/$/, "");
const KEY = process.env.ADMIN_KEY || process.env.VARSOVIA_ADMIN_KEY;
const LOCALES = (process.env.LOCALES || "en,th,pl").split(",").map((s) => s.trim());

const results = [];
const reverts = [];

function pass(name, detail = "") {
  results.push({ name, ok: true, detail });
  console.log(`  ✓ ${name}${detail ? ` — ${detail}` : ""}`);
}

function fail(name, detail = "") {
  results.push({ name, ok: false, detail });
  console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
}

function pickStr(v, loc = "en") {
  if (v == null) return "";
  if (typeof v === "string") return v.trim();
  if (typeof v === "object") return String(v[loc] || v.en || Object.values(v).find((x) => typeof x === "string") || "").trim();
  return String(v);
}

async function fetchHtml(path, opts = {}) {
  const res = await fetch(`${FE}${path}`, { ...opts, headers: { ...(opts.headers || {}), "User-Agent": "VarsoviaSmokeTest/1.0" } });
  const html = await res.text();
  return { status: res.status, html, url: res.url };
}

async function fetchJson(path, opts = {}) {
  const res = await fetch(`${API}${path}`, opts);
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
}

async function fetchSite(locale) {
  const r = await fetchJson(`/site?locale=${locale}`);
  return r.body?.data || r.body || {};
}

async function checkPage(path, label = path) {
  const { status } = await fetchHtml(path);
  if (status === 200) pass(`Page ${label}`, String(status));
  else fail(`Page ${label}`, String(status));
}

async function htmlContains(path, needle, label) {
  const { status, html } = await fetchHtml(path);
  if (status !== 200) {
    fail(label, `HTTP ${status}`);
    return false;
  }
  if (html.includes(needle)) {
    pass(label, needle.slice(0, 60));
    return true;
  }
  fail(label, `missing "${needle.slice(0, 80)}"`);
  return false;
}

async function cmsRoundTrip(name, putPayload, verifyPaths) {
  if (!KEY) {
    console.log(`  ⚠ ${name} round-trip skipped (no ADMIN_KEY)`);
    return;
  }

  const getRes = await fetch(`${API}/site?cms=1`, {
    headers: { "x-admin-key": KEY },
  });
  if (!getRes.ok) {
    fail(`${name} round-trip read`, String(getRes.status));
    return;
  }
  const before = (await getRes.json()).data || (await getRes.json());

  const marker = `QA-${Date.now()}`;
  const body = JSON.parse(JSON.stringify(putPayload(before, marker)));

  const putRes = await fetch(`${API}/site`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "x-admin-key": KEY },
    body: JSON.stringify(body),
  });
  if (!putRes.ok) {
    fail(`${name} round-trip write`, String(putRes.status));
    return;
  }

  reverts.push(async () => {
    await fetch(`${API}/site`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-key": KEY },
      body: JSON.stringify(putPayload(before, null, true)),
    });
  });

  await new Promise((r) => setTimeout(r, 1500));

  // API must reflect write immediately (admin → DB → public API)
  const apiSite = await fetchSite("en");
  const apiNeedle = verifyPaths(marker)[0]?.apiPick?.(apiSite) ?? marker;
  if (apiNeedle && String(apiNeedle).includes(marker)) {
    pass(`${name} API read`, marker);
  } else {
    fail(`${name} API read`, `expected ${marker}, got ${String(apiNeedle).slice(0, 40)}`);
  }

  await new Promise((r) => setTimeout(r, 1500));

  for (const { path, needle } of verifyPaths(marker)) {
    await htmlContains(path, needle, `${name} live @ ${path}`);
  }

  pass(`${name} round-trip write`, marker);
}

async function main() {
  console.log("\n═══════════════════════════════════════════");
  console.log("  Varsovia full production smoke test");
  console.log(`  FE:  ${FE}`);
  console.log(`  API: ${API}`);
  console.log(`  Locales: ${LOCALES.join(", ")}`);
  console.log("═══════════════════════════════════════════\n");

  // ── 1. Stack health ──
  try {
    const fe = await fetchHtml("/en");
    if (fe.status !== 200) throw new Error(`FE ${fe.status}`);
    pass("Frontend reachable", "/en 200");

    const api = await fetchJson("/site?locale=en");
    if (api.status !== 200) throw new Error(`API ${api.status}`);
    pass("API /site", "200");
  } catch (e) {
    fail("Stack health", e.message);
    process.exit(1);
  }

  const CORE_ROUTES = [
    "",
    "/about",
    "/contact",
    "/team",
    "/catalogue",
    "/faq",
    "/quality-sale",
    "/projects",
    "/privacy",
    "/terms",
    "/interior-design",
    "/journal",
    "/furniture",
    "/services",
    "/locations",
    "/complete-interiors",
    "/for-developers",
  ];

  // ── 2. All locales + core pages ──
  for (const loc of LOCALES) {
    for (const route of CORE_ROUTES) {
      await checkPage(`/${loc}${route}`, `/${loc}${route}`);
    }
  }

  // ── 3. CMS fields in API (en) ──
  const siteEn = await fetchSite("en");
  const cmsChecks = [
    ["faqPage.heroTitle", pickStr(siteEn.faqPage?.heroTitle)],
    ["cataloguePage.heroTitle", pickStr(siteEn.cataloguePage?.heroTitle)],
    ["contactPage.locationTitle", pickStr(siteEn.contactPage?.locationTitle)],
    ["contactPage.showroomsTitle", pickStr(siteEn.contactPage?.showroomsTitle)],
    ["legalPages.privacy.title", pickStr(siteEn.legalPages?.privacy?.title)],
    ["legalPages.terms.title", pickStr(siteEn.legalPages?.terms?.title)],
    ["aboutPageSettings.metaTitle", pickStr(siteEn.aboutPageSettings?.metaTitle)],
    ["sectionCopy.featured.ctaLabel", siteEn.sectionCopy?.featured?.ctaLabel || ""],
    ["teamPage.metaTitle", pickStr(siteEn.teamPage?.metaTitle)],
  ];
  for (const [label, val] of cmsChecks) {
    if (val) pass(`CMS API ${label}`, val.slice(0, 50));
    else fail(`CMS API ${label}`, "empty");
  }

  // ── 4. CMS content on rendered pages (en) ──
  await htmlContains("/en/faq", pickStr(siteEn.faqPage?.heroTitle, "en") || "FAQ", "FAQ hero on page");
  await htmlContains(
    "/en/catalogue",
    pickStr(siteEn.cataloguePage?.heroTitle, "en") || "Free Catalogue",
    "Catalogue hero on page",
  );
  await htmlContains(
    "/en/contact",
    pickStr(siteEn.contactPage?.locationTitle, "en") || "Our Location",
    "Contact location title on page",
  );
  await htmlContains(
    "/en/privacy",
    pickStr(siteEn.legalPages?.privacy?.title, "en") || "Privacy Policy",
    "Privacy title on page",
  );
  await htmlContains(
    "/en/terms",
    pickStr(siteEn.legalPages?.terms?.title, "en") || "Terms",
    "Terms title on page",
  );

  const featuredCta = siteEn.sectionCopy?.featured?.ctaLabel || "Explore More";
  await htmlContains("/en", featuredCta, "Featured CTA on home");

  // ── 5. Locale API strings differ or resolve (th/pl) ──
  for (const loc of ["th", "pl"]) {
    const site = await fetchSite(loc);
    const faqTitle = pickStr(site.faqPage?.heroTitle, loc);
    if (faqTitle) pass(`CMS API faqPage.heroTitle [${loc}]`, faqTitle);
    else fail(`CMS API faqPage.heroTitle [${loc}]`, "empty");

    const { status } = await fetchHtml(`/${loc}/faq`);
    if (status === 200 && faqTitle) {
      const { html } = await fetchHtml(`/${loc}/faq`);
      if (html.includes(faqTitle)) pass(`FAQ hero on /${loc}/faq`, faqTitle);
      else fail(`FAQ hero on /${loc}/faq`, "title not in HTML");
    }
  }

  // ── 6. Resource APIs ──
  for (const ep of [
    "/projects?locale=en&limit=3",
    "/products?locale=en&limit=3",
    "/partners?locale=en&limit=6",
    "/showrooms?locale=en&limit=3",
    "/faqs?locale=en&limit=3",
    "/catalogues?locale=en&limit=3",
    "/blogs?locale=en&limit=3",
  ]) {
    const r = await fetchJson(ep);
    const data = r.body?.data ?? r.body;
    const count = Array.isArray(data) ? data.length : 0;
    if (r.status === 200 && count > 0) pass(`API ${ep.split("?")[0]}`, `${count} items`);
    else fail(`API ${ep.split("?")[0]}`, `status=${r.status} count=${count}`);
  }

  // Showrooms on contact page
  const showrooms = (await fetchJson("/showrooms?locale=en&limit=3")).body?.data ?? [];
  if (Array.isArray(showrooms) && showrooms.length > 0) {
    const firstName = pickStr(showrooms[0]?.name, "en");
    if (firstName) await htmlContains("/en/contact", firstName, "Showroom on contact page");
    else pass("Showrooms API", `${showrooms.length} (name check skipped)`);
  } else {
    fail("Showrooms on contact", "no showrooms");
  }

  // ── 7. SEO / sitemap / redirects ──
  const sitemap = await fetchHtml("/sitemap.xml");
  if (sitemap.status === 200) pass("sitemap.xml", "200");
  else fail("sitemap.xml", String(sitemap.status));

  const robots = await fetchHtml("/robots.txt");
  if (robots.status === 200 && robots.html.includes("Sitemap")) pass("robots.txt", "200");
  else fail("robots.txt", String(robots.status));

  for (const [from, frag] of [
    ["/en/blog", "/en/journal"],
    ["/en/showcase", "/en/projects"],
    ["/en/interior", "/en/interior-design"],
  ]) {
    const res = await fetch(`${FE}${from}`, { redirect: "manual" });
    const loc = res.headers.get("location") || "";
    if (res.status >= 300 && res.status < 400 && loc.includes(frag.replace("/en", ""))) {
      pass(`Redirect ${from}`, `${res.status}`);
    } else {
      fail(`Redirect ${from}`, `status=${res.status} loc=${loc}`);
    }
  }

  // noindex when indexable false
  if (siteEn.faqPage?.indexable !== true) {
    const faqMeta = await fetchHtml("/en/faq");
    if (faqMeta.html.includes("noindex")) pass("FAQ noindex gate", "present");
    else fail("FAQ noindex gate", "expected noindex");
  }

  // ── 8. CMS round-trips (write → verify → revert) ──
  console.log("\n── CMS round-trip tests ──\n");

  await cmsRoundTrip(
    "faqPage",
    (before, marker, revert) => {
      const fp = before.faqPage || {};
      if (revert) return { faqPage: fp };
      return {
        faqPage: {
          ...fp,
          heroTitle:
            typeof fp.heroTitle === "object"
              ? { ...fp.heroTitle, en: marker }
              : { en: marker, th: fp.heroTitle, pl: fp.heroTitle },
        },
      };
    },
    (marker) => [
      {
        path: "/en/faq",
        needle: marker,
        apiPick: (s) => pickStr(s.faqPage?.heroTitle),
      },
    ],
  );

  await cmsRoundTrip(
    "contactPage",
    (before, marker, revert) => {
      const cp = before.contactPage || {};
      if (revert) return { contactPage: cp };
      return {
        contactPage: {
          ...cp,
          locationTitle:
            typeof cp.locationTitle === "object"
              ? { ...cp.locationTitle, en: marker }
              : { en: marker, th: cp.locationTitle, pl: cp.locationTitle },
        },
      };
    },
    (marker) => [
      {
        path: "/en/contact",
        needle: marker,
        apiPick: (s) => pickStr(s.contactPage?.locationTitle),
      },
    ],
  );

  await cmsRoundTrip(
    "cataloguePage",
    (before, marker, revert) => {
      const cp = before.cataloguePage || {};
      if (revert) return { cataloguePage: cp };
      return {
        cataloguePage: {
          ...cp,
          heroTitle:
            typeof cp.heroTitle === "object"
              ? { ...cp.heroTitle, en: marker }
              : { en: marker, th: cp.heroTitle, pl: cp.heroTitle },
        },
      };
    },
    (marker) => [
      {
        path: "/en/catalogue",
        needle: marker,
        apiPick: (s) => pickStr(s.cataloguePage?.heroTitle),
      },
    ],
  );

  await cmsRoundTrip(
    "sectionCopy.featured",
    (before, marker, revert) => {
      const sc = before.sectionCopy || {};
      const featured = sc.featured || {};
      if (revert) return { sectionCopy: { ...sc, featured } };
      return {
        sectionCopy: {
          ...sc,
          featured: { ...featured, ctaLabel: marker },
        },
      };
    },
    (marker) => [
      {
        path: "/en",
        needle: marker,
        apiPick: (s) => s.sectionCopy?.featured?.ctaLabel || "",
      },
    ],
  );

  // Revert all CMS changes
  console.log("\n── Reverting CMS test writes ──\n");
  for (const fn of reverts) {
    try {
      await fn();
    } catch (e) {
      fail("CMS revert", e.message);
    }
  }
  if (reverts.length) pass("CMS reverted", `${reverts.length} patches`);

  await new Promise((r) => setTimeout(r, 2000));

  const failed = results.filter((r) => !r.ok);
  console.log("\n═══════════════════════════════════════════");
  console.log(`  ${results.length - failed.length}/${results.length} passed`);
  if (failed.length) {
    console.log("\n  Failed:");
    failed.forEach((f) => console.log(`    • ${f.name}: ${f.detail}`));
  }
  console.log("═══════════════════════════════════════════\n");
  process.exit(failed.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
