import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = fs.readFileSync(path.join(__dirname, "../lib/companyData.ts"), "utf8");
const blockRe = /_id:\s*"(blog-\d+)"[\s\S]*?title:\s*"([^"]+)"[\s\S]*?excerpt:\s*\n\s*"([^"]+)"[\s\S]*?category:\s*"([^"]+)"/g;

const th = {};
const pl = {};
let m;
while ((m = blockRe.exec(src))) {
  const [, id, title, excerpt, category] = m;
  th[id] = {
    title: title.replace(/^10 /, "10 เทรนด์ ").includes("Interior") ? title : title,
    excerpt,
    category,
  };
  pl[id] = { title, excerpt, category };
}

// Thai translations (listing + cards)
const thTitles = {
  "blog-1": "10 เทรนด์ออกแบบภายในที่จะเปลี่ยนบ้านคุณในปี 2026",
  "blog-2": "เลือกครัวโมดูลาร์ที่ลงตัวกับบ้านอย่างไร",
  "blog-3": "ศิลปะแสงหลายชั้นในอินทีเรียสมัยใหม่",
  "blog-4": "พื้นที่เล็ก ผลลัพธ์ใหญ่: ไอเดียจัดเก็บอัจฉริยะ",
  "blog-5": "เรื่องวัสดุ: เลือกผิวงานที่สวยขึ้นตามกาลเวลา",
  "blog-6": "สร้างภาษาการออกแบบทั้งบ้านให้กลมกลืน",
};
const thExcerpts = {
  "blog-1": "จากมินิมอลอบอุ่นถึงโคมไฟ sculptural — เทรนด์ที่หล่อหลอมอินทีเรียที่สวยและอยู่สบายในปีนี้",
  "blog-2": "เลย์เอาต์ ที่เก็บของ ผิวงาน และการทำงาน — คู่มือเลือกตู้ครัวที่ใช้งานได้สวยทุกวัน",
  "blog-3": "แสง ambient, task และ accent ทำงานร่วมกันเพื่ออารมณ์ ฟังก์ชัน และมิติในทุกห้อง",
  "blog-4": "ตู้ built-in แนวตั้ง และเฟอร์นิเจอร์อเนกประสงค์ ช่วยให้บ้านขนาดเล็กดูโปร่งและเป็นระเบียบ",
  "blog-5": "ควอตซ์ แลมิเนต ไม้เนื้อแท้ และ veneer — เลือกผิวที่ดูดีขึ้นเมื่อเวลาผ่านไป",
  "blog-6": "สี วัสดุ และรายละเอียดที่สอดคล้องกันทั้งบ้าน สร้างความรู้สึกเป็นหนึ่งเดียว",
};
const thCategories = {
  Trends: "เทรนด์",
  Kitchen: "ครัว",
  Lighting: "แสงสว่าง",
  Storage: "จัดเก็บ",
  Materials: "วัสดุ",
  Design: "ดีไซน์",
};

for (const id of Object.keys(th)) {
  if (thTitles[id]) th[id].title = thTitles[id];
  if (thExcerpts[id]) th[id].excerpt = thExcerpts[id];
  th[id].category = thCategories[th[id].category] || th[id].category;
}

const plTitles = {
  "blog-1": "10 trendów wnętrzarskich, które odmienią Twój dom w 2026",
  "blog-2": "Jak wybrać idealną kuchnię modułową do domu",
  "blog-3": "Sztuka warstwowego oświetlenia we współczesnych wnętrzach",
  "blog-4": "Mała przestrzeń, wielki efekt: sprytne rozwiązania storage",
  "blog-5": "Materiały mają znaczenie: wykończenia, które pięknie się starzeją",
  "blog-6": "Spójny język designu w całym domu",
};
const plExcerpts = {
  "blog-1": "Od ciepłego minimalizmu po rzeźbiarskie oświetlenie — trendy kształtujące piękne, funkcjonalne wnętrza.",
  "blog-2": "Układ, storage, wykończenia i ergonomia — praktyczny przewodnik po zabudowie kuchennej.",
  "blog-3": "Oświetlenie ogólne, robocze i akcentowe wspólnie budują nastrój i funkcję każdego pokoju.",
  "blog-4": "Zabudowa na wymiar, storage pionowy i meble wielofunkcyjne powiększają małe wnętrza.",
  "blog-5": "Kwarc, laminaty, drewno i forniry — powierzchnie, które z czasem wyglądają lepiej.",
  "blog-6": "Spójne kolory, materiały i detale w całym domu tworzą jednolitą całość.",
};
const plCategories = {
  Trends: "Trendy",
  Kitchen: "Kuchnia",
  Lighting: "Oświetlenie",
  Storage: "Storage",
  Materials: "Materiały",
  Design: "Design",
};

for (const id of Object.keys(pl)) {
  if (plTitles[id]) pl[id].title = plTitles[id];
  if (plExcerpts[id]) pl[id].excerpt = plExcerpts[id];
  pl[id].category = plCategories[pl[id].category] || pl[id].category;
}

const outDir = path.join(__dirname, "../messages/locale");
fs.writeFileSync(path.join(outDir, "blog.content.th.json"), JSON.stringify(th, null, 2));
fs.writeFileSync(path.join(outDir, "blog.content.pl.json"), JSON.stringify(pl, null, 2));
console.log("Generated", Object.keys(th).length, "blog entries");
