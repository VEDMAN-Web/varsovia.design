/**
 * E2E checks for Journal hub + Journal articles unification.
 * Usage: node scripts/testJournalUnification.js
 */
const FE = process.env.FE_URL || "http://127.0.0.1:3000";
const API = process.env.API_URL || "http://127.0.0.1:5001/api";
const KEY = process.env.ADMIN_KEY;
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

async function getSite() {
  const res = await fetch(`${API}/site?locale=${LOCALE}`);
  const body = await res.json();
  if (!res.ok) throw new Error(`site GET ${res.status}`);
  return body.data || body;
}

async function getHtml(path) {
  const res = await fetch(`${FE}${path}`);
  const html = await res.text();
  return { status: res.status, html, url: res.url };
}

async function main() {
  console.log("\nJournal unification E2E\n");

  // 1. Stack up
  try {
    const siteRes = await fetch(`${API}/site?locale=${LOCALE}`);
    if (!siteRes.ok) throw new Error(`site ${siteRes.status}`);
    pass("Backend /api/site", String(siteRes.status));

    const journalPage = await getHtml(`/${LOCALE}/journal`);
    if (journalPage.status !== 200) throw new Error(`journal ${journalPage.status}`);
    pass("Frontend /en/journal", String(journalPage.status));
  } catch (e) {
    fail("Stack health", e.message);
    process.exit(1);
  }

  const site = await getSite();
  const journal = site.pages?.journal;
  if (!journal) {
    fail("CMS journal hub exists");
    process.exit(1);
  }
  pass("CMS journal hub", `hero="${journal.hero?.title || journal.hero?.title?.en || "?"}"`);

  const heroTitle =
    typeof journal.hero?.title === "string"
      ? journal.hero.title
      : journal.hero?.title?.en || "Journal";
  const heroImage = journal.hero?.image || "";

  // 2. CMS content on live page
  const { html } = await getHtml(`/${LOCALE}/journal`);

  if (html.includes(heroTitle)) pass("CMS hero title on /journal", heroTitle);
  else fail("CMS hero title on /journal", `expected "${heroTitle}"`);

  if (!heroImage || html.includes(heroImage)) {
    pass("CMS hero image on /journal", heroImage || "(none)");
  } else {
    fail("CMS hero image on /journal", `expected "${heroImage}"`);
  }

  if (html.includes("Our Blog")) fail("Legacy hardcoded hero removed", "still shows Our Blog");
  else pass("Legacy hardcoded hero removed");

  if (html.includes("All articles")) pass("Journal article grid label");
  else fail("Journal article grid label", 'expected "All articles"');

  // Single navbar: count mobile menu toggle (one per Navbar instance)
  const navToggles = (html.match(/toggleMenu/g) || []).length;
  if (navToggles <= 1) pass("Single navbar", `toggleMenu count=${navToggles}`);
  else fail("Single navbar", `toggleMenu count=${navToggles} (expected ≤1 in SSR)`);

  // Topic explore from IA hub
  const childSlug = journal.children?.[0]?.slug;
  if (childSlug && html.toLowerCase().includes(String(childSlug).toLowerCase())) {
    pass("Topic explore section", childSlug);
  } else {
    fail("Topic explore section", childSlug || "no children");
  }

  // 3. Legacy redirects
  for (const [path, expect] of [
    [`/${LOCALE}/blog`, `/${LOCALE}/journal`],
    [`/${LOCALE}/blog/test-id`, `/${LOCALE}/journal/p/test-id`],
  ]) {
    const res = await fetch(`${FE}${path}`, { redirect: "manual" });
    const loc = res.headers.get("location") || "";
    if (res.status >= 300 && res.status < 400 && loc.includes(expect)) {
      pass(`Redirect ${path}`, `${res.status} → ${loc}`);
    } else {
      fail(`Redirect ${path}`, `got ${res.status} location=${loc}`);
    }
  }

  // 4. Topic + article pages
  if (childSlug) {
    const topic = await getHtml(`/${LOCALE}/journal/topic/${childSlug}`);
    if (topic.status === 200) pass("Topic page", `/journal/topic/${childSlug}`);
    else fail("Topic page", String(topic.status));
  }

  const blogsRes = await fetch(`${API}/blogs?locale=${LOCALE}&limit=5`);
  const blogsBody = await blogsRes.json();
  const blogs = blogsBody.data || blogsBody;
  const first = Array.isArray(blogs) ? blogs[0] : null;
  if (first?._id) {
    const article = await getHtml(`/${LOCALE}/journal/p/${first._id}`);
    if (article.status === 200 && article.html.includes(first.title || "")) {
      pass("Article detail page", first._id);
    } else {
      fail("Article detail page", String(article.status));
    }
  } else {
    fail("Articles API", "no articles returned");
  }

  // 5. CMS round-trip (optional — needs ADMIN_KEY)
  if (!KEY) {
    console.log("\n  ⚠ Skipping CMS round-trip (ADMIN_KEY not set)");
  } else {
    const marker = `Journal QA ${Date.now()}`;
    const putRes = await fetch(`${API}/site`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-key": KEY },
      body: JSON.stringify({
        pages: {
          journal: {
            ...journal,
            hero: {
              ...journal.hero,
              title: { en: marker, th: journal.hero?.title?.th || "", pl: journal.hero?.title?.pl || "" },
            },
          },
        },
      }),
    });
    if (!putRes.ok) {
      fail("CMS round-trip write", String(putRes.status));
    } else {
      await new Promise((r) => setTimeout(r, 500));
      const after = await getHtml(`/${LOCALE}/journal`);
      if (after.html.includes(marker)) {
        pass("CMS round-trip read", marker);
      } else {
        fail("CMS round-trip read", `marker "${marker}" not in HTML`);
      }

      // Restore
      await fetch(`${API}/site`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-key": KEY },
        body: JSON.stringify({
          pages: {
            journal: {
              ...journal,
              hero: {
                ...journal.hero,
                title:
                  typeof journal.hero?.title === "object"
                    ? journal.hero.title
                    : { en: heroTitle, th: "", pl: "" },
              },
            },
          },
        }),
      });
      pass("CMS round-trip restore");
    }
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} passed\n`);
  process.exit(failed.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
