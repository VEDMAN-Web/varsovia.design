/**
 * Varsovia location city page roundtrip:
 * panel fields ↔ CMS persist ↔ public /site ↔ live HTML (if FE is up).
 * Always reverts Koh Samui to the snapshot taken at start.
 *
 *   node scripts/locationPageRoundtripSmoke.js
 */
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const API = (process.env.API_URL || `http://127.0.0.1:${process.env.PORT || 5001}/api`).replace(
  /\/$/,
  "",
);
const FE = (process.env.FE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const KEY = process.env.ADMIN_KEY || "";
const SLUG = "koh-samui";
const LOCALE = "en";

const results = [];

function pass(name, detail = "") {
  results.push({ name, ok: true, detail });
  console.log(`  ✓ ${name}${detail ? ` — ${detail}` : ""}`);
}
function fail(name, detail = "") {
  results.push({ name, ok: false, detail });
  console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
}

function locEn(value) {
  if (typeof value === "string") return value.trim();
  if (value && typeof value === "object") return String(value.en || value.th || value.pl || "").trim();
  return "";
}

function L(en) {
  return { en, th: "", pl: "" };
}

async function api(path, opts = {}) {
  const headers = {
    Accept: "application/json",
    ...(opts.body ? { "Content-Type": "application/json" } : {}),
    ...(opts.admin ? { "x-admin-key": KEY } : {}),
  };
  const res = await fetch(`${API}${path}`, {
    method: opts.method || "GET",
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
}

function siteFrom(res) {
  return res.body?.data || res.body || {};
}

function findChild(pages, slug) {
  const kids = pages?.locations?.children;
  if (!Array.isArray(kids)) return null;
  return kids.find((c) => c && c.slug === slug) || null;
}

/** Every live city-page field and the admin modal control that owns it. */
const FIELD_CONTRACT = [
  { panel: "1 · Banner — Card / nav title", path: "title" },
  { panel: "1 · Banner — Tag (optional)", path: "hero.eyebrow", optional: true },
  { panel: "1 · Banner — Heading (H1)", path: "hero.title" },
  { panel: "1 · Banner — Description (tagline)", path: "hero.subtitle" },
  { panel: "1 · Banner — Banner photo", path: "hero.image" },
  { panel: "1 · Banner — Button text", path: "hero.ctaLabel" },
  { panel: "1 · Banner — Button link", path: "hero.ctaHref" },
  { panel: "2 · Intro paragraph", path: "body" },
  { panel: "3 · Content blocks — Heading", path: "sections.0.heading" },
  { panel: "3 · Content blocks — Text", path: "sections.0.text" },
  { panel: "3 · Content blocks — Photo", path: "sections.0.image" },
  { panel: "4 · Services heading", path: "servicesTitle" },
  { panel: "4 · Services subtitle", path: "servicesSubtitle" },
  { panel: "5 · Related section title", path: "relatedTitle" },
  { panel: "6 · Google title", path: "metaTitle" },
  { panel: "6 · Google description", path: "metaDescription" },
];

function getPath(obj, path) {
  return path.split(".").reduce((cur, key) => {
    if (cur == null) return undefined;
    const idx = /^\d+$/.test(key) ? Number(key) : key;
    return cur[idx];
  }, obj);
}

function setPath(obj, path, value) {
  const parts = path.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = /^\d+$/.test(parts[i]) ? Number(parts[i]) : parts[i];
    const next = parts[i + 1];
    const nextIsIdx = /^\d+$/.test(next);
    if (cur[key] == null) cur[key] = nextIsIdx ? [] : {};
    cur = cur[key];
  }
  const last = parts[parts.length - 1];
  cur[/^\d+$/.test(last) ? Number(last) : last] = value;
}

async function main() {
  console.log(`\nVarsovia location city page roundtrip`);
  console.log(`  API: ${API}`);
  console.log(`  FE:  ${FE}`);
  console.log(`  city: /locations/${SLUG}\n`);

  if (!KEY) {
    fail("ADMIN_KEY", "missing in varsovia.design/backend/.env");
    process.exit(1);
  }

  const health = await fetch(API.replace(/\/api$/, "") + "/api/site?locale=en")
    .then((r) => r.ok)
    .catch(() => false);
  if (!health) {
    fail("API reachable", `could not GET ${API}/site — start Varsovia backend on :5001`);
    process.exit(1);
  }
  pass("API reachable");

  const adminGet = await api("/site?cms=1", { admin: true });
  if (adminGet.status !== 200) {
    fail("Admin GET /site?cms=1", `HTTP ${adminGet.status}`);
    process.exit(1);
  }
  pass("Admin GET /site?cms=1");

  const adminSite = siteFrom(adminGet);
  const pagesSnapshot = JSON.parse(JSON.stringify(adminSite.pages || {}));
  const child = findChild(adminSite.pages, SLUG);
  if (!child) {
    fail("Koh Samui child exists", "pages.locations.children has no koh-samui");
    process.exit(1);
  }
  pass("Koh Samui child exists in CMS");

  for (const field of FIELD_CONTRACT) {
    const value = getPath(child, field.path);
    const text =
      field.path.endsWith(".image") || field.path.endsWith(".ctaHref")
        ? String(value || "").trim()
        : locEn(value);
    if (text) pass(`Panel field present — ${field.panel}`, text.slice(0, 72));
    else if (field.optional) pass(`Panel field present — ${field.panel}`, "blank (hidden on live, as designed)");
    else fail(`Panel field present — ${field.panel}`, "empty in CMS (seed/defaults may still render)");
  }

  const stamp = `RT${Date.now().toString().slice(-8)}`;
  const markers = {
    title: `Nav ${stamp}`,
    "hero.eyebrow": `EBROW ${stamp}`,
    "hero.title": `H1 ${stamp}`,
    "hero.subtitle": `Hero line ${stamp}`,
    "hero.ctaLabel": `CTA ${stamp}`,
    "hero.ctaHref": "/contact",
    body: `Intro copy ${stamp}`,
    "sections.0.heading": `Block heading ${stamp}`,
    "sections.0.text": `Block text ${stamp}`,
    servicesTitle: `Services heading ${stamp}`,
    servicesSubtitle: `Services sub ${stamp}`,
    relatedTitle: `Related ${stamp}`,
    metaTitle: `Meta ${stamp}`.slice(0, 60),
    metaDescription: `Meta desc ${stamp}`.slice(0, 160),
  };

  const nextChild = JSON.parse(JSON.stringify(child));
  if (!Array.isArray(nextChild.sections) || !nextChild.sections[0]) {
    nextChild.sections = [
      { heading: L(""), text: L(""), image: String(child.hero?.image || "") },
    ];
  }
  for (const [path, value] of Object.entries(markers)) {
    const current = getPath(nextChild, path);
    if (path === "hero.ctaHref" || path.endsWith(".image")) {
      setPath(nextChild, path, value);
    } else if (typeof current === "string" || current == null) {
      setPath(nextChild, path, L(value));
    } else {
      setPath(nextChild, path, { ...current, en: value });
    }
  }

  const nextPages = JSON.parse(JSON.stringify(pagesSnapshot));
  nextPages.locations = {
    ...(nextPages.locations || {}),
    children: (nextPages.locations?.children || []).map((c) =>
      c?.slug === SLUG ? nextChild : c,
    ),
  };

  const put = await api("/site", { method: "PUT", admin: true, body: { pages: nextPages } });
  if (put.status >= 200 && put.status < 300) pass("Admin PUT city fields");
  else {
    fail("Admin PUT city fields", `HTTP ${put.status} ${JSON.stringify(put.body).slice(0, 180)}`);
    process.exit(1);
  }

  const adminAfter = siteFrom(await api("/site?cms=1", { admin: true }));
  const saved = findChild(adminAfter.pages, SLUG);
  for (const [path, want] of Object.entries(markers)) {
    const got = locEn(getPath(saved, path)) || String(getPath(saved, path) || "").trim();
    if (got === want || got.includes(want)) pass(`Admin persist — ${path}`, got.slice(0, 72));
    else fail(`Admin persist — ${path}`, `got "${got}" want "${want}"`);
  }

  const pub = siteFrom(await api(`/site?locale=${LOCALE}`));
  const pubChild = findChild(pub.pages, SLUG);
  if (!pubChild) {
    fail("Public /site has Koh Samui", "missing after save");
  } else {
    pass("Public /site has Koh Samui");
    const publicChecks = [
      ["title", markers.title],
      ["hero.title", markers["hero.title"]],
      ["hero.subtitle", markers["hero.subtitle"]],
      ["hero.ctaLabel", markers["hero.ctaLabel"]],
      ["body", markers.body],
      ["sections.0.heading", markers["sections.0.heading"]],
      ["sections.0.text", markers["sections.0.text"]],
      ["servicesTitle", markers.servicesTitle],
      ["servicesSubtitle", markers.servicesSubtitle],
      ["relatedTitle", markers.relatedTitle],
    ];
    for (const [path, want] of publicChecks) {
      const got = locEn(getPath(pubChild, path)) || String(getPath(pubChild, path) || "");
      if (got.includes(want)) pass(`Public CMS — ${path}`, got.slice(0, 72));
      else fail(`Public CMS — ${path}`, `got "${got.slice(0, 80)}" want "${want}"`);
    }
  }

  try {
    const htmlRes = await fetch(`${FE}/${LOCALE}/locations/${SLUG}`, { cache: "no-store" });
    const html = await htmlRes.text();
    if (htmlRes.status !== 200) {
      fail("Live page HTTP", `${htmlRes.status} ${FE}/${LOCALE}/locations/${SLUG}`);
    } else if (/thailand kitchens|Ready to plan your/i.test(html) && !html.includes(markers["hero.title"])) {
      fail(
        "Live page is Varsovia",
        `${FE} is not the Varsovia location page (Thailand kitchens may be on :3000)`,
      );
    } else {
      pass("Live page HTTP", String(htmlRes.status));
      const htmlChecks = [
        markers.title,
        markers["hero.title"],
        markers["hero.subtitle"],
        markers["hero.ctaLabel"],
        markers.body,
        markers["sections.0.heading"],
        markers["sections.0.text"],
        markers.servicesTitle,
        markers.servicesSubtitle,
        markers.relatedTitle,
      ];
      for (const needle of htmlChecks) {
        if (html.includes(needle)) pass(`Live HTML contains`, needle);
        else fail(`Live HTML contains`, `missing "${needle}" (FE cache or wrong frontend)`);
      }
      if (html.includes(markers["hero.title"])) {
        pass("Live H1 is banner Heading", "Heading text on the city page (hydrated <h1> in the banner)");
      } else {
        fail("Live H1 is banner Heading", "Heading field missing from the live document");
      }
      if (html.includes("LocalBusiness") && html.includes("InteriorDesigner")) {
        pass("Live LocalBusiness JSON-LD");
      } else {
        fail("Live LocalBusiness JSON-LD", "city page missing LocalBusiness schema");
      }
      if (html.includes(`<title>${markers.metaTitle}`) || html.includes(markers.metaTitle)) {
        pass("Live Google title");
      } else {
        fail("Live Google title", `missing "${markers.metaTitle}"`);
      }
      if (html.includes(markers.metaDescription)) {
        pass("Live Google description");
      } else {
        fail("Live Google description", `missing "${markers.metaDescription}"`);
      }
    }
  } catch (err) {
    fail("Live page fetch", err.message || "frontend not running");
  }

  const revert = await api("/site", {
    method: "PUT",
    admin: true,
    body: { pages: pagesSnapshot },
  });
  if (revert.status >= 200 && revert.status < 300) pass("Reverted Koh Samui snapshot");
  else fail("Reverted Koh Samui snapshot", `HTTP ${revert.status}`);

  const restored = findChild(siteFrom(await api("/site?cms=1", { admin: true })).pages, SLUG);
  if (locEn(restored?.hero?.title) === locEn(child.hero?.title)) {
    pass("Restore verified", locEn(child.hero?.title));
  } else {
    fail("Restore verified", `got "${locEn(restored?.hero?.title)}"`);
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  if (failed.length) {
    console.log("Failures:");
    for (const f of failed) console.log(`  - ${f.name}: ${f.detail}`);
    process.exit(1);
  }
  console.log("\nReady to deploy: location city fields persist panel → CMS → public site.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
