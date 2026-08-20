/**
 * Field-by-field CMS roundtrip for About + remaining Varsovia pages.
 * Confirms panel values in Mongo/public /site and live HTML.
 *
 *   node scripts/cmsPagesRoundtripSmoke.js
 */
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const API = (process.env.API_URL || `http://127.0.0.1:${process.env.PORT || 5001}/api`).replace(
  /\/$/,
  "",
);
const FE = (process.env.FE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const KEY = process.env.ADMIN_KEY || "";

const results = [];

function pass(name, detail = "") {
  results.push({ name, ok: true, detail });
  console.log(`  ✓ ${name}${detail ? ` — ${detail}` : ""}`);
}
function fail(name, detail = "") {
  results.push({ name, ok: false, detail });
  console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
}

function loc(value) {
  if (typeof value === "string") return value.trim();
  if (value && typeof value === "object") {
    return String(value.en || value.th || value.pl || "").trim();
  }
  return "";
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

function getPath(obj, path) {
  return path.split(".").reduce((cur, key) => {
    if (cur == null) return undefined;
    const idx = /^\d+$/.test(key) ? Number(key) : key;
    return cur[idx];
  }, obj);
}

const HUBS = [
  { key: "aboutBrand", path: "/en/about", label: "About" },
  { key: "completeInteriors", path: "/en/complete-interiors", label: "Complete Interiors" },
  { key: "forDevelopers", path: "/en/for-developers", label: "For Developers" },
  { key: "journal", path: "/en/journal", label: "Journal" },
  { key: "locations", path: "/en/locations", label: "Locations" },
  { key: "furniture", path: "/en/furniture", label: "Furniture" },
];

const STANDALONE = [
  { path: "/en/catalogue", keys: ["cataloguePage.heroTitle", "cataloguePage.metaTitle"], label: "Free Catalogue" },
  { path: "/en/team", keys: ["teamPage.heroTitle", "teamPage.metaTitle"], label: "Our Team" },
  { path: "/en/quality-sale", keys: ["qualitySale.heroTitle", "qualitySale.metaTitle"], label: "Quality After Sales" },
  { path: "/en/contact", keys: ["contactPage.metaTitle", "contactPage.heroTitle", "contactPage.locationTitle", "contactPage.showroomsTitle", "inquiryForm.compactTitle", "inquiryForm.submitLabel"], label: "Contact" },
  { path: "/en/faq", keys: ["faqPage.heroTitle", "faqPage.metaTitle"], label: "FAQ" },
];

const HUB_FIELDS = [
  "hero.title",
  "hero.subtitle",
  "hero.image",
  "hero.ctaLabel",
  "hero.ctaHref",
  "body",
  "metaTitle",
  "metaDescription",
];

async function fetchHtml(path) {
  const res = await fetch(`${FE}${path}`, { cache: "no-store" });
  const html = await res.text();
  return { status: res.status, html };
}

(async () => {
  console.log("\nVarsovia CMS roundtrip");
  console.log(`API ${API}`);
  console.log(`FE  ${FE}\n`);

  const pubRes = await api("/site?locale=en");
  if (pubRes.status !== 200) {
    fail("GET /site public", `status ${pubRes.status}`);
    process.exit(1);
  }
  const publicSite = siteFrom(pubRes);
  pass("GET /site public");

  const cmsRes = await api("/site?cms=1", { admin: true });
  if (cmsRes.status !== 200) {
    fail("GET /site cms=1", `status ${cmsRes.status} — check ADMIN_KEY`);
  } else {
    pass("GET /site cms=1");
  }
  const cmsSite = cmsRes.status === 200 ? siteFrom(cmsRes) : {};

  if (KEY && cmsRes.status === 200) {
    const { DEFAULT_FOOTER_NAVIGATION } = require("../src/validation/footerNavigation");
    const { PAGE_CMS_DEFAULTS } = require("../src/data/pageCmsDefaults");
    const patch = {};
    const cmsNav = cmsSite.footerNavigation || {};
    if (Number(cmsNav.version || 0) < 3) {
      patch.footerNavigation = DEFAULT_FOOTER_NAVIGATION;
    }
    const cp = { ...(cmsSite.contactPage || {}) };
    if (!loc(cp.heroTitle)) {
      cp.heroTitle = PAGE_CMS_DEFAULTS.contactPage.heroTitle;
      cp.heroSubtitle = PAGE_CMS_DEFAULTS.contactPage.heroSubtitle;
      patch.contactPage = cp;
    }
    const bio = loc(cmsSite.footerBio);
    if (!bio || /Varsovia Kitchen/i.test(bio)) {
      patch.footerBio = {
        en: "Transforming homes with thoughtfully designed interiors tailored to your lifestyle and vision.",
        th: "เปลี่ยนบ้านของคุณด้วยอินทีเรียที่ออกแบบอย่างพิถีพิถันให้เข้ากับไลฟ์สไตล์และวิสัยทัศน์ของคุณ",
        pl: "Przekształcamy domy dzięki przemyślanym wnętrzom dopasowanym do Twojego stylu życia i wizji.",
      };
    }
    if (Object.keys(patch).length) {
      await api("/site", { method: "PUT", admin: true, body: patch });
      Object.assign(publicSite, siteFrom(await api("/site?locale=en")));
      Object.assign(cmsSite, siteFrom(await api("/site?cms=1", { admin: true })));
      pass("Filled missing footer/contact live fields");
    }
  }

  const about = publicSite.pages?.aboutBrand || {};
  const aboutCms = cmsSite.pages?.aboutBrand || {};
  const aboutImage = loc(about.hero?.image);
  const cmsImage = loc(aboutCms.hero?.image);
  const child = (about.children || []).find((c) => String(c.slug || "").toLowerCase() === "varsovia");
  const childImage = loc(child?.hero?.image);

  if (aboutImage) pass("About hub has banner photo", aboutImage.slice(-48));
  else fail("About hub has banner photo");

  if (cmsImage && aboutImage && cmsImage === aboutImage) {
    pass("About public image matches CMS");
  } else {
    fail("About public image matches CMS", `cms=${cmsImage} public=${aboutImage}`);
  }

  if (aboutImage && childImage && aboutImage !== childImage) {
    pass(
      "About hub photo is not the hidden varsovia child seed",
      "live /about must use hub.hero.image",
    );
  } else if (aboutImage && childImage && aboutImage === childImage) {
    pass("About hub and varsovia child share the same photo");
  }

  const aboutTitle = loc(about.hero?.title);
  if (aboutTitle) pass("About hub heading", aboutTitle);

  console.log("\nHub pages");
  for (const hub of HUBS) {
    const row = publicSite.pages?.[hub.key] || {};
    for (const field of HUB_FIELDS) {
      const value = loc(getPath(row, field));
      if (value) pass(`${hub.label} ${field}`, value.length > 70 ? `${value.slice(0, 67)}…` : value);
      else fail(`${hub.label} ${field}`, "empty");
    }
    try {
      const page = await fetchHtml(hub.path);
      if (page.status !== 200) {
        fail(`${hub.label} live ${hub.path}`, `HTTP ${page.status}`);
        continue;
      }
      pass(`${hub.label} live ${hub.path}`, `HTTP ${page.status}`);
      const image = loc(row.hero?.image);
      if (image) {
        const token = image.split("/").pop().split("?")[0];
        if (token && page.html.includes(token)) {
          pass(`${hub.label} live HTML includes banner file`, token);
        } else {
          fail(`${hub.label} live HTML includes banner file`, token || image);
        }
      }
      const heading = loc(row.hero?.title);
      if (heading && page.html.toLowerCase().includes(heading.toLowerCase())) {
        pass(`${hub.label} live HTML includes heading`);
      } else if (heading) {
        fail(`${hub.label} live HTML includes heading`, heading);
      }
    } catch (err) {
      fail(`${hub.label} live ${hub.path}`, err.message);
    }
  }

  console.log("\nStandalone pages");
  for (const page of STANDALONE) {
    for (const key of page.keys) {
      const value = loc(getPath(publicSite, key));
      if (value) pass(`${page.label} ${key}`, value);
      else fail(`${page.label} ${key}`, "empty");
    }
    try {
      const html = await fetchHtml(page.path);
      if (html.status === 200) pass(`${page.label} live ${page.path}`);
      else fail(`${page.label} live ${page.path}`, `HTTP ${html.status}`);
    } catch (err) {
      fail(`${page.label} live ${page.path}`, err.message);
    }
  }

  console.log("\nFooter + contact fields");
  const footerNav = publicSite.footerNavigation || {};
  const primaryHrefs = (footerNav.linkColumns || [])
    .find((col) => col.id === "primary")
    ?.links?.map((l) => l.href) || [];
  const productHrefs = (footerNav.linkColumns || [])
    .find((col) => col.id === "products")
    ?.links?.map((l) => l.href) || [];
  const expectedPrimary = ["/journal", "/about", "/contact", "/faq", "/catalogue"];
  const expectedProducts = [
    "/interior-design?category=Kitchen",
    "/interior-design?category=Bedroom",
    "/interior-design?category=Bathroom",
    "/furniture",
    "/interior-design?category=Door%20%26%20Windows",
    "/interior-design?category=Whole%20House%20Solutions",
  ];
  if (JSON.stringify(primaryHrefs) === JSON.stringify(expectedPrimary)) {
    pass("Footer primary links 1:1");
  } else {
    fail("Footer primary links 1:1", primaryHrefs.join(", "));
  }
  if (JSON.stringify(productHrefs) === JSON.stringify(expectedProducts)) {
    pass("Footer product links 1:1");
  } else {
    fail("Footer product links 1:1", productHrefs.join(", "));
  }
  for (const key of [
    "footerBio",
    "email",
    "contactPhone",
    "footerNavigation.contactHeading",
    "footerOffices.0.address",
    "inquiryForm.compactTitle",
    "inquiryForm.submitLabel",
    "inquiryForm.fields.0.label",
    "contactPage.heroTitle",
    "contactPage.locationTitle",
    "contactPage.showroomsTitle",
  ]) {
    const value = loc(getPath(publicSite, key));
    if (value) pass(`Field ${key}`, value.length > 70 ? `${value.slice(0, 67)}…` : value);
    else fail(`Field ${key}`, "empty");
  }

  async function writeRoundTrip(name, patchFn, path, pick) {
    if (!KEY) {
      fail(`${name} write round-trip`, "no ADMIN_KEY");
      return;
    }
    const beforeRes = await api("/site?cms=1", { admin: true });
    const before = siteFrom(beforeRes);
    const marker = `QA-RT-${Date.now()}`;
    const putRes = await api("/site", {
      method: "PUT",
      admin: true,
      body: patchFn(before, marker, false),
    });
    if (putRes.status >= 400) {
      fail(`${name} write`, `HTTP ${putRes.status}`);
      return;
    }
    await new Promise((r) => setTimeout(r, 1200));
    const afterSite = siteFrom(await api("/site?locale=en"));
    const apiVal = loc(pick(afterSite));
    if (apiVal.includes(marker)) pass(`${name} API read`, marker);
    else fail(`${name} API read`, apiVal.slice(0, 40));
    try {
      const page = await fetchHtml(path);
      if (page.status === 200 && page.html.includes(marker)) pass(`${name} live HTML`, path);
      else fail(`${name} live HTML`, `HTTP ${page.status}`);
    } catch (err) {
      fail(`${name} live HTML`, err.message);
    }
    await api("/site", {
      method: "PUT",
      admin: true,
      body: patchFn(before, marker, true),
    });
    pass(`${name} reverted`);
  }

  const locEn = (value, marker) =>
    value && typeof value === "object"
      ? { ...value, en: marker }
      : { en: marker, th: "", pl: "" };

  await writeRoundTrip(
    "footer contactHeading",
    (before, marker, revert) => {
      const nav = before.footerNavigation || {};
      if (revert) return { footerNavigation: nav };
      return {
        footerNavigation: { ...nav, contactHeading: locEn(nav.contactHeading, marker) },
      };
    },
    "/en",
    (s) => s.footerNavigation?.contactHeading,
  );

  await writeRoundTrip(
    "contact locationTitle",
    (before, marker, revert) => {
      const cp = before.contactPage || {};
      if (revert) return { contactPage: cp };
      return { contactPage: { ...cp, locationTitle: locEn(cp.locationTitle, marker) } };
    },
    "/en/contact",
    (s) => s.contactPage?.locationTitle,
  );

  await writeRoundTrip(
    "inquiry name label",
    (before, marker, revert) => {
      const form = before.inquiryForm || {};
      if (revert) return { inquiryForm: form };
      const fields = Array.isArray(form.fields) ? form.fields.map((row) => ({ ...row })) : [];
      if (fields[0]) fields[0] = { ...fields[0], label: locEn(fields[0].label, marker) };
      return { inquiryForm: { ...form, fields } };
    },
    "/en/contact",
    (s) => s.inquiryForm?.fields?.[0]?.label,
  );

  const failed = results.filter((r) => !r.ok);
  const passed = results.filter((r) => r.ok);

  console.log(`\n${passed.length} passed · ${failed.length} failed · ${results.length} checks`);
  process.exit(failed.length ? 1 : 0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
