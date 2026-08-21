/**
 * CMS save must survive GET merge with live seed.
 *   node scripts/iaPagesSaveRoundtrip.js
 */
const assert = require("assert");
const { mergeIaPages, mergeSavedIaPages } = require("../src/data/iaPagesDefaults");

function loc(value) {
  if (typeof value === "string") return value.trim();
  if (value && typeof value === "object") return String(value.en || "").trim();
  return "";
}

const CUSTOM = "CMS SAVE ROUNDTRIP TITLE";
const CUSTOM_BODY = "CMS save roundtrip intro paragraph.";
const CUSTOM_HEADING = "CMS save roundtrip block heading";
const CUSTOM_CHILD = "CMS kitchens child heading";

const stored = mergeSavedIaPages(
  {},
  {
    furniture: {
      slug: "furniture",
      hero: { title: { en: CUSTOM, th: "", pl: "" } },
      body: { en: CUSTOM_BODY, th: "", pl: "" },
      sections: [
        { heading: { en: CUSTOM_HEADING, th: "", pl: "" }, text: { en: "Block copy", th: "", pl: "" } },
      ],
      children: [
        {
          slug: "kitchens",
          title: { en: CUSTOM_CHILD, th: "", pl: "" },
          hero: { title: { en: CUSTOM_CHILD, th: "", pl: "" } },
        },
      ],
    },
    interiorDesign: {
      hero: { title: { en: "Interior CMS", th: "", pl: "" } },
    },
    aboutBrand: {
      hero: { title: { en: "About CMS", th: "", pl: "" } },
      body: { en: "About intro CMS", th: "", pl: "" },
    },
    journal: {
      hero: { title: { en: "Journal CMS", th: "", pl: "" } },
      body: { en: "Journal intro CMS", th: "", pl: "" },
    },
  },
);

const publicPages = mergeIaPages(stored);

assert.strictEqual(loc(publicPages.furniture.hero.title), CUSTOM, "furniture hero title");
assert.strictEqual(loc(publicPages.furniture.body), CUSTOM_BODY, "furniture intro");
assert.strictEqual(loc(publicPages.furniture.sections[0].heading), CUSTOM_HEADING, "furniture block");
const kitchens = publicPages.furniture.children.find((c) => c.slug === "kitchens");
assert.ok(kitchens, "kitchens child exists");
assert.strictEqual(loc(kitchens.title), CUSTOM_CHILD, "kitchens title");
assert.strictEqual(loc(kitchens.hero.title), CUSTOM_CHILD, "kitchens hero");
assert.strictEqual(loc(publicPages.interiorDesign.hero.title), "Interior CMS", "interior");
assert.strictEqual(loc(publicPages.aboutBrand.hero.title), "About CMS", "about");
assert.strictEqual(loc(publicPages.journal.hero.title), "Journal CMS", "journal");
assert.strictEqual(loc(publicPages.journal.body), "Journal intro CMS", "journal intro");

const siblingKeep = mergeSavedIaPages(stored, {
  furniture: { children: stored.furniture.children },
});
assert.strictEqual(loc(siblingKeep.furniture.hero.title), CUSTOM, "children save keeps landing");
assert.strictEqual(loc(siblingKeep.interiorDesign.hero.title), "Interior CMS", "sibling hub kept");

console.log("iaPagesSaveRoundtrip: ok");
