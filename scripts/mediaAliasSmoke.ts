import { resolveMediaUrl } from "../lib/mediaAssets";

let failed = 0;
function assert(name: string, condition: boolean, detail = "") {
  if (condition) {
    console.log(`ok  ${name}`);
    return;
  }
  failed += 1;
  console.error(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
}

assert(
  "Kitchen2.jpg → product-2.jpg",
  resolveMediaUrl("/products/Kitchen2.jpg") === "/home/product/product-2.jpg"
);
assert(
  "Kitchen2.png → product-2.jpg",
  resolveMediaUrl("/products/Kitchen2.png") === "/home/product/product-2.jpg"
);
assert(
  "admin-origin Kitchen2 unwraps",
  resolveMediaUrl("http://localhost:3001/products/Kitchen2.jpg") ===
    "/home/product/product-2.jpg"
);
assert(
  "featured-project aliases",
  resolveMediaUrl("/home/featured-project/feature-2.jpg") ===
    "/home/featured/feature-2.jpg"
);
assert(
  "uploads stay absolute-ish path",
  resolveMediaUrl("/uploads/images/foo.jpg") === "/uploads/images/foo.jpg"
);

if (failed) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log("\nmediaAliasSmoke: all checks passed");
