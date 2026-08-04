/** Smoke-test listing HTML for legacy numeric interior links. Run while `next start` is up. */
const port = process.env.SMOKE_PORT || "3456";
const html = await fetch(`http://localhost:${port}/en/interior`).then((r) => r.text());
const numeric = [...html.matchAll(/\/interior\/(\d+)(?![0-9])/g)].map((m) => m[0]);
const unique = [...new Set(numeric)];
console.log("numeric /interior/<id> in listing:", unique.length ? unique : "none");
console.log("contains skyline-apartment:", html.includes("skyline-apartment"));
if (unique.length > 0) process.exit(1);
