/**
 * Full staging smoke test — reads/writes staging CMS then REVERTS.
 * Usage:
 *   FE_URL=https://staging.varsovia.design API_URL=https://staging-api.varsovia.design/api ADMIN_KEY=... node scripts/stagingSmokeTest.js
 */
const FE = (process.env.FE_URL || "https://staging.varsovia.design").replace(/\/$/, "");
const API = (process.env.API_URL || "https://staging-api.varsovia.design/api").replace(/\/$/, "");
const KEY = process.env.ADMIN_KEY;
const LOCALE = process.env.LOCALE || "en";

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

async function fetchHtml(path, opts = {}) {
  const res = await fetch(`${FE}${path}`, opts);
  const html = await res.text();
  return { status: res.status, html, url: res.url, headers: res.headers };
}

async function fetchJson(path) {
  const res = await fetch(`${API}${path}`);
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
}

async function checkRedirect(path, expectFragment) {
  const res = await fetch(`${FE}${path}`, { redirect: "manual" });
  const loc = res.headers.get("location") || "";
  const ok = res.status >= 300 && res.status < 400 && loc.includes(expectFragment);
  if (ok) pass(`Redirect ${path}`, `${res.status} → ${loc}`);
  else fail(`Redirect ${path}`, `status=${res.status} loc=${loc} want=${expectFragment}`);
}

async function checkPage(path, label = path) {
  const { status } = await fetchHtml(path);
  if (status === 200) pass(`Page ${label}`, String(status));
  else fail(`Page ${label}`, String(status));
}

async function main() {
  console.log(`\nStaging smoke test`);
  console.log(`  FE:  ${FE}`);
  console.log(`  API: ${API}\n`);

  // ── 1. Stack health ──
  try {
    const fe = await fetchHtml(`/${LOCALE}`);
    if (fe.status !== 200) throw new Error(`FE home ${fe.status}`);
    pass("Stack FE home", String(fe.status));

    const api = await fetchJson(`/site?locale=${LOCALE}`);
    if (api.status !== 200) throw new Error(`API site ${api.status}`);
    pass("Stack API /site", String(api.status));
  } catch (e) {
    fail("Stack health", e.message);
    process.exit(1);
  }

  const site = (await fetchJson(`/site?locale=${LOCALE}`)).body.data || (await fetchJson(`/site?locale=${LOCALE}`)).body;
  const pages = site.pages || {};

  // ── 2. Core pages ──
  const coreRoutes = [
    `/${LOCALE}`,
    `/${LOCALE}/about`,
    `/${LOCALE}/contact`,
    `/${LOCALE}/team`,
    `/${LOCALE}/catalogue`,
    `/${LOCALE}/faq`,
    `/${LOCALE}/quality-sale`,
    `/${LOCALE}/projects`,
    `/${LOCALE}/interior-design`,
    `/${LOCALE}/journal`,
    `/${LOCALE}/furniture`,
    `/${LOCALE}/services`,
    `/${LOCALE}/locations`,
    `/${LOCALE}/complete-interiors`,
    `/${LOCALE}/for-developers`,
  ];
  for (const r of coreRoutes) await checkPage(r);

  // ── 3. Legacy redirects ──
  await checkRedirect(`/${LOCALE}/blog`, `/${LOCALE}/journal`);
  await checkRedirect(`/${LOCALE}/blog/smoke-test-id`, `/${LOCALE}/journal/p/smoke-test-id`);
  await checkRedirect(`/${LOCALE}/showcase`, `/${LOCALE}/projects`);
  await checkRedirect(`/${LOCALE}/showcase/smoke-id`, `/${LOCALE}/projects/smoke-id`);
  await checkRedirect(`/${LOCALE}/interior`, `/${LOCALE}/interior-design`);

  // ── 4. Hub pages + CMS ──
  const journal = pages.journal;
  if (!journal) fail("CMS journal hub");
  else {
    const heroTitle =
      typeof journal.hero?.title === "string"
        ? journal.hero.title
        : journal.hero?.title?.en || "Journal";
    pass("CMS journal hub", heroTitle);

    const { html } = await fetchHtml(`/${LOCALE}/journal`);
    if (html.includes(heroTitle)) pass("Journal CMS hero on page", heroTitle);
    else fail("Journal CMS hero on page", heroTitle);

    if (html.includes("Our Blog")) fail("No legacy Our Blog on journal");
    else pass("No legacy Our Blog on journal");

    if (html.includes("All articles")) pass("Journal article grid label");
    else fail("Journal article grid label");

    const navToggles = (html.match(/toggleMenu/g) || []).length;
    if (navToggles <= 1) pass("Single navbar on journal", `count=${navToggles}`);
    else fail("Single navbar on journal", `count=${navToggles}`);

    const childSlug = journal.children?.[0]?.slug;
    if (childSlug) {
      await checkPage(`/${LOCALE}/journal/topic/${childSlug}`, `/journal/topic/${childSlug}`);
    }
  }

  // ── 5. IA hub child sample ──
  const furnitureChild = pages.furniture?.children?.[0]?.slug;
  if (furnitureChild) {
    await checkPage(`/${LOCALE}/furniture/${furnitureChild}`, `/furniture/${furnitureChild}`);
  }

  // ── 6. Articles API + detail ──
  const blogsRes = await fetchJson(`/blogs?locale=${LOCALE}&limit=5`);
  const blogs = blogsRes.body.data || blogsRes.body;
  if (Array.isArray(blogs) && blogs.length > 0) {
    pass("Articles API", `${blogs.length} articles`);
    const first = blogs[0];
    const art = await fetchHtml(`/${LOCALE}/journal/p/${first._id}`);
    if (art.status === 200) pass("Article detail page", first._id);
    else fail("Article detail page", String(art.status));
  } else {
    fail("Articles API", "empty or error");
  }

  // ── 7. Other APIs ──
  for (const ep of ["/projects?locale=en&limit=5", "/showcases?locale=en&limit=5", "/products?locale=en&limit=5"]) {
    const r = await fetchJson(ep);
    if (r.status === 200) pass(`API ${ep.split("?")[0]}`, "200");
    else fail(`API ${ep.split("?")[0]}`, String(r.status));
  }

  // ── 8. SEO / sitemap ──
  const sitemap = await fetchHtml("/sitemap.xml");
  if (sitemap.status === 200) pass("sitemap.xml", "200");
  else fail("sitemap.xml", String(sitemap.status));

  const robots = await fetchHtml("/robots.txt");
  if (robots.status === 200 && robots.html.includes("Sitemap")) pass("robots.txt", "200");
  else fail("robots.txt", String(robots.status));

  // Journal should be noindex while indexable false
  if (journal && journal.indexable !== true) {
    const jMeta = await fetchHtml(`/${LOCALE}/journal`);
    if (jMeta.html.includes("noindex") || jMeta.html.includes("nofollow")) {
      pass("Journal noindex gate", "noindex present");
    } else {
      fail("Journal noindex gate", "expected noindex when indexable=false");
    }
  }

  // ── 9. Locales ──
  for (const loc of ["th", "pl"]) {
    const r = await fetchHtml(`/${loc}/journal`);
    if (r.status === 200) pass(`Locale /${loc}/journal`, "200");
    else fail(`Locale /${loc}/journal`, String(r.status));
  }

  // ── 10. CMS round-trip (write → verify → REVERT) ──
  if (!KEY) {
    console.log("\n  ⚠ CMS round-trip skipped (ADMIN_KEY not set)");
  } else if (!journal) {
    fail("CMS round-trip", "no journal hub");
  } else {
    const originalTitle = journal.hero?.title;
    const marker = `Staging QA ${Date.now()}`;
    const putBody = {
      pages: {
        journal: {
          ...journal,
          hero: {
            ...journal.hero,
            title: { en: marker, th: journal.hero?.title?.th || "", pl: journal.hero?.title?.pl || "" },
          },
        },
      },
    };

    const putRes = await fetch(`${API}/site`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-key": KEY },
      body: JSON.stringify(putBody),
    });

    if (!putRes.ok) {
      fail("CMS round-trip write", `${putRes.status} (staging ADMIN_KEY may differ from local)`);
    } else {
      reverts.push(async () => {
        await fetch(`${API}/site`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", "x-admin-key": KEY },
          body: JSON.stringify({ pages: { journal: { ...journal, hero: { ...journal.hero, title: originalTitle } } } }),
        });
      });

      await new Promise((r) => setTimeout(r, 2000));
      const after = await fetchHtml(`/${LOCALE}/journal`);
      if (after.html.includes(marker)) pass("CMS round-trip live read", marker);
      else fail("CMS round-trip live read", `marker not in HTML (cache?)`);

      // Revert immediately
      for (const fn of reverts) await fn();
      pass("CMS reverted to original");

      await new Promise((r) => setTimeout(r, 2000));
      const restored = await fetchHtml(`/${LOCALE}/journal`);
      const restoredTitle =
        typeof originalTitle === "string" ? originalTitle : originalTitle?.en || "Journal";
      if (restored.html.includes(restoredTitle) && !restored.html.includes(marker)) {
        pass("CMS restore verified on live", restoredTitle);
      } else {
        fail("CMS restore verified on live", "title not restored yet (CDN cache may lag)");
      }
    }
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
