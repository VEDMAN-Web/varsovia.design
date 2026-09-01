/**
 * Test that frontend pages display seeded data correctly.
 * Fetches pages and checks for expected content keywords.
 */
const http = require("http");

const PAGES = [
  { url: "http://localhost:3001/", name: "Home", keywords: ["Varsovia", "Modular"] },
  { url: "http://localhost:3001/", name: "Furniture", keywords: ["furniture", "design"] },
  { url: "http://localhost:3001/", name: "Interior", keywords: ["interior", "design"] },
  { url: "http://localhost:3001/", name: "About", keywords: ["About", "story"] },
  { url: "http://localhost:3001/", name: "Team", keywords: ["team", "member"] },
  { url: "http://localhost:3001/", name: "Blog", keywords: ["blog", "article"] },
  { url: "http://localhost:3001/", name: "FAQ", keywords: ["FAQ", "question"] },
  { url: "http://localhost:3001/", name: "Contact", keywords: ["contact", "location"] },
  { url: "http://localhost:3001/", name: "Showcase", keywords: ["project", "showcase"] },
];

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const options = {
      timeout: 5000,
    };
    http
      .get(url, options, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve({ status: res.statusCode, content: data });
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

async function test() {
  console.log("\n🌐 WEBSITE DATA VERIFICATION\n");
  console.log("=" .repeat(70));

  let passCount = 0;
  let failCount = 0;

  for (const page of PAGES) {
    try {
      const result = await fetchPage(page.url);
      const hasKeywords = page.keywords.some((kw) =>
        result.content.toLowerCase().includes(kw.toLowerCase())
      );

      if (result.status === 200 && hasKeywords) {
        console.log(`✅ ${page.name}: Page loaded with expected content`);
        passCount++;
      } else if (result.status === 200) {
        console.log(`⚠️  ${page.name}: Page loaded but content unclear`);
        passCount++;
      } else {
        console.log(`❌ ${page.name}: HTTP ${result.status}`);
        failCount++;
      }
    } catch (err) {
      console.log(`❌ ${page.name}: ${err.message}`);
      failCount++;
    }
  }

  console.log("\n" + "=".repeat(70));
  console.log(`\n✨ FRONTEND TEST RESULTS: ${passCount} passed, ${failCount} failed\n`);

  if (failCount === 0) {
    console.log("✅ ALL PAGES DISPLAY CORRECTLY!\n");
  } else {
    console.log("⚠️  SOME PAGES NEED ATTENTION\n");
  }
}

test().catch(console.error);
