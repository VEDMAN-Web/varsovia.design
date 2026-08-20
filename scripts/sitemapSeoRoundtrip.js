/**
 * Sitemap + SEO indexable roundtrip.
 * Turns Contact indexable on, checks sitemap/robots/meta, then restores the original flag.
 *
 *   FE_URL=http://127.0.0.1:3000 API_URL=http://127.0.0.1:5001/api node scripts/sitemapSeoRoundtrip.js
 */
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const FE = (process.env.FE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const API = (process.env.API_URL || "http://127.0.0.1:5001/api").replace(/\/$/, "");
const KEY = process.env.ADMIN_KEY || process.env.VARSOVIA_ADMIN_KEY || "";

const results = [];

function pass(name, detail = "") {
  results.push({ name, ok: true, detail });
  console.log(`  ✓ ${name}${detail ? ` — ${detail}` : ""}`);
}
function fail(name, detail = "") {
  results.push({ name, ok: false, detail });
  console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
}

async function getHtml(path) {
  const res = await fetch(`${FE}${path}`, { cache: "no-store" });
  return { status: res.status, html: await res.text() };
}

async function cmsGet() {
  const res = await fetch(`${API}/site?cms=1`, { headers: { "x-admin-key": KEY } });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, site: body.data || body };
}

async function cmsPut(patch) {
  const res = await fetch(`${API}/site`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "x-admin-key": KEY },
    body: JSON.stringify(patch),
  });
  return res.status;
}

function hasNoindex(html) {
  return /noindex/i.test(html);
}

function contactInSitemap(xml) {
  return /\/en\/contact(?:["<\s?]|$)/i.test(xml) || xml.includes("/en/contact");
}

async function main() {
  console.log("\nVarsovia sitemap + SEO roundtrip");
  console.log(`FE  ${FE}`);
  console.log(`API ${API}\n`);

  if (!KEY) {
    fail("ADMIN_KEY", "missing — cannot round-trip");
    process.exit(1);
  }

  const index = await getHtml("/sitemap.xml");
  if (index.status === 200 && /sitemapindex/i.test(index.html) && /sitemaps\/pages\.xml/i.test(index.html)) {
    pass("sitemap.xml index", "pages/journal/projects/images");
  } else {
    fail("sitemap.xml index", `HTTP ${index.status}`);
  }

  const robots = await getHtml("/robots.txt");
  if (robots.status === 200 && /Sitemap:/i.test(robots.html) && /sitemap\.xml/i.test(robots.html)) {
    pass("robots.txt Sitemap", "present");
  } else {
    fail("robots.txt Sitemap", `HTTP ${robots.status}`);
  }

  const beforeRes = await cmsGet();
  if (beforeRes.status !== 200) {
    fail("CMS snapshot", `HTTP ${beforeRes.status}`);
    process.exit(1);
  }
  const originalContact = beforeRes.site.contactPage || {};
  const originalFlag = originalContact.indexable === true;
  pass("CMS snapshot", `contactPage.indexable=${originalFlag}`);

  try {
    const onStatus = await cmsPut({
      contactPage: { ...originalContact, indexable: true },
    });
    if (onStatus >= 400) fail("indexable ON write", `HTTP ${onStatus}`);
    else pass("indexable ON write");

    await new Promise((r) => setTimeout(r, 1500));

    const pagesOn = await getHtml("/sitemaps/pages.xml");
    if (pagesOn.status === 200 && contactInSitemap(pagesOn.html)) {
      pass("pages.xml includes /en/contact when indexable");
    } else {
      fail("pages.xml includes /en/contact when indexable", `HTTP ${pagesOn.status}`);
    }

    const contactOn = await getHtml("/en/contact");
    if (contactOn.status === 200 && !hasNoindex(contactOn.html)) {
      pass("/en/contact indexable (no noindex meta)");
    } else if (contactOn.status === 200) {
      fail("/en/contact indexable (no noindex meta)", "still noindex");
    } else {
      fail("/en/contact", `HTTP ${contactOn.status}`);
    }

    const offStatus = await cmsPut({
      contactPage: { ...originalContact, indexable: false },
    });
    if (offStatus >= 400) fail("indexable OFF write", `HTTP ${offStatus}`);
    else pass("indexable OFF write");

    await new Promise((r) => setTimeout(r, 1500));

    const pagesOff = await getHtml("/sitemaps/pages.xml");
    if (pagesOff.status === 200 && !contactInSitemap(pagesOff.html)) {
      pass("pages.xml excludes /en/contact when not indexable");
    } else {
      fail("pages.xml excludes /en/contact when not indexable", "URL still listed");
    }

    const contactOff = await getHtml("/en/contact");
    if (contactOff.status === 200 && hasNoindex(contactOff.html)) {
      pass("/en/contact noindex gate");
    } else {
      fail("/en/contact noindex gate", "expected noindex");
    }
  } finally {
    const restore = await cmsPut({ contactPage: originalContact });
    if (restore >= 400) fail("restore original indexable", `HTTP ${restore}`);
    else pass("restore original indexable", String(originalFlag));
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length} passed · ${failed.length} failed · ${results.length} checks`);
  process.exit(failed.length ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
