/**
 * Pre-deploy smoke: seed contracts, partner logo files, homepage product cap,
 * then optional live API/FE checks when servers are up.
 *
 *   node scripts/preDeploySmoke.js
 *   FE_URL=http://localhost:3000 API_URL=http://127.0.0.1:5001/api node scripts/preDeploySmoke.js
 */
const fs = require("fs");
const path = require("path");
const { productsDocs, partnersDocs } = require("../src/seed/seedData");

const FE = (process.env.FE_URL || "http://localhost:3000").replace(/\/$/, "");
const API = (process.env.API_URL || "http://127.0.0.1:5001/api").replace(/\/$/, "");
const PUBLIC = path.join(__dirname, "..", "..", "frontend", "public");
const HOME_PRODUCT_LIMIT = 3;

const results = [];

function pass(name, detail = "") {
  results.push({ name, ok: true, detail });
  console.log(`  ✓ ${name}${detail ? ` — ${detail}` : ""}`);
}

function fail(name, detail = "") {
  results.push({ name, ok: false, detail });
  console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
}

function publicFile(rel) {
  const clean = String(rel || "").replace(/^\/+/, "");
  return path.join(PUBLIC, clean);
}

function pickHomeProducts(products) {
  const visible = (products || []).filter((p) => p.visible !== false);
  const featured = visible.filter((p) => p.featured === true);
  const source = featured.length > 0 ? featured : visible;
  return [...source]
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
    .slice(0, HOME_PRODUCT_LIMIT);
}

async function probe(url, ms = 2500) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal, redirect: "follow" });
    return res;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function jsonOk(url) {
  const res = await probe(url, 4000);
  if (!res) return { ok: false, status: 0, body: null };
  const body = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, body };
}

function runOffline() {
  console.log("\n── Offline seed + asset contracts ──\n");

  const partners = partnersDocs();
  if (partners.length >= 1) pass("Partner seed rows", String(partners.length));
  else fail("Partner seed rows", "empty");

  for (const partner of partners) {
    const file = publicFile(partner.logo);
    if (fs.existsSync(file)) pass(`Partner file ${partner.name}`, partner.logo);
    else fail(`Partner file ${partner.name}`, `missing ${partner.logo}`);
  }

  const staleFigma = partners.some((p) => String(p.logo).includes("/figma/"));
  if (!staleFigma) pass("Partner logos not using missing /partners/figma paths");
  else fail("Partner logos", "still pointing at /partners/figma");

  const products = productsDocs();
  const featured = products.filter((p) => p.featured === true && p.visible !== false);
  if (featured.length === HOME_PRODUCT_LIMIT) {
    pass("Homepage featured product count", String(featured.length));
  } else {
    fail(
      "Homepage featured product count",
      `expected ${HOME_PRODUCT_LIMIT} featured, got ${featured.length}`,
    );
  }

  const picked = pickHomeProducts(products);
  const pickedSlugs = picked.map((p) => p.slug).join(",");
  if (picked.length === HOME_PRODUCT_LIMIT && pickedSlugs === "kitchen-cabinet,bedroom-interior,bedroom-suite") {
    pass("pickHomeProducts order", pickedSlugs);
  } else {
    fail("pickHomeProducts order", pickedSlugs || "empty");
  }

  const extras = pickHomeProducts(products.concat({ slug: "should-not-show", featured: false, order: 99 }));
  if (extras.every((p) => p.slug !== "should-not-show")) {
    pass("Extra products stay off homepage");
  } else {
    fail("Extra products stay off homepage", "library item leaked into home pick");
  }

  const allFeatured = products.map((p) => ({ ...p, featured: true }));
  const capped = pickHomeProducts(allFeatured);
  if (capped.length === HOME_PRODUCT_LIMIT) pass("Homepage hard cap", String(capped.length));
  else fail("Homepage hard cap", String(capped.length));
}

async function runLive() {
  console.log("\n── Live API / frontend ──\n");

  const apiHealth = await probe(`${API.replace(/\/api$/, "")}/api/home?locale=en`);
  const feHealth = await probe(`${FE}/en`);

  if (!apiHealth) {
    console.log("  ⚠ Varsovia API not reachable — skipping live API checks");
  } else {
    pass("Varsovia API reachable", `${apiHealth.status}`);

    const partners = await jsonOk(`${API}/partners?locale=en&limit=20`);
    const partnerRows = partners.body?.data ?? partners.body ?? [];
    if (partners.ok && Array.isArray(partnerRows) && partnerRows.length > 0) {
      pass("API /partners", `${partnerRows.length} items`);
      const firstLogo = String(partnerRows[0]?.logo || "");
      if (firstLogo && !firstLogo.includes("/figma/")) pass("Live partner logo path", firstLogo);
      else if (firstLogo.includes("/figma/")) {
        fail("Live partner logo path", `stale ${firstLogo} — reseed or save logos`);
      }
    } else {
      fail("API /partners", `status=${partners.status}`);
    }

    const products = await jsonOk(`${API}/products?locale=en&limit=50`);
    const productRows = products.body?.data ?? products.body ?? [];
    if (products.ok && Array.isArray(productRows) && productRows.length > 0) {
      pass("API /products", `${productRows.length} items`);
      const home = pickHomeProducts(productRows);
      if (home.length <= HOME_PRODUCT_LIMIT) pass("Live homepage product cap", String(home.length));
      else fail("Live homepage product cap", String(home.length));
    } else {
      fail("API /products", `status=${products.status}`);
    }

    const home = await jsonOk(`${API}/home?locale=en`);
    if (home.ok) pass("API /home", String(home.status));
    else fail("API /home", `status=${home.status}`);
  }

  if (!feHealth) {
    console.log("  ⚠ Varsovia frontend not reachable — skipping live page checks");
    return;
  }

  pass("Varsovia frontend reachable", `${feHealth.status}`);
  if (feHealth.status !== 200) {
    fail("GET /en", String(feHealth.status));
    return;
  }

  const html = await feHealth.text();
  if (/Our Products|Nasze produkty|ผลิตภัณฑ์/i.test(html)) pass("Home contains Our Products");
  else fail("Home contains Our Products", "heading missing");

  if (/Our Global Partners|partner/i.test(html)) pass("Home contains partners section");
  else fail("Home contains partners section", "missing");

  for (const logo of ["/partners/blum.svg", "/partners/fischer-mask.svg", "/partners/bostik-mask.svg"]) {
    const res = await probe(`${FE}${logo}`);
    if (res && res.ok) pass(`FE ${logo}`, String(res.status));
    else fail(`FE ${logo}`, res ? String(res.status) : "unreachable");
  }
}

(async () => {
  console.log("Varsovia pre-deploy smoke");
  runOffline();
  await runLive();

  const failed = results.filter((r) => !r.ok);
  console.log("\n═══════════════════════════════════════════");
  console.log(`  ${results.length - failed.length}/${results.length} passed`);
  if (failed.length) {
    console.log("\n  Failed:");
    failed.forEach((f) => console.log(`    • ${f.name}: ${f.detail}`));
  }
  console.log("═══════════════════════════════════════════\n");
  process.exit(failed.length ? 1 : 0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
