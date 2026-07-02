import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const out = path.resolve("evidence");
await mkdir(out, { recursive: true });

const browser = await chromium.launch({ headless: true });
const pages = [
  { name: "home", url: "https://reebelo.com/" },
  { name: "phones", url: "https://reebelo.com/collections/cell-phones" },
  { name: "laptops", url: "https://reebelo.com/collections/laptops" },
  { name: "tablets", url: "https://reebelo.com/collections/tablets" },
];

async function capture(viewport, suffix) {
  const page = await browser.newPage({ viewport });
  const records = [];
  for (const item of pages) {
    try {
      await page.goto(item.url, { waitUntil: "domcontentloaded", timeout: 45000 });
      await page.waitForTimeout(4000);
      await page.screenshot({ path: path.join(out, `${item.name}-${suffix}.png`), fullPage: true });
      const data = await page.evaluate(() => {
        const text = (selector) => [...document.querySelectorAll(selector)].slice(0, 24).map((el) => el.textContent.trim()).filter(Boolean);
        const imgs = [...document.images].slice(0, 24).map((img) => ({
          src: img.currentSrc || img.src,
          alt: img.alt,
          w: img.naturalWidth,
          h: img.naturalHeight,
        }));
        const styles = getComputedStyle(document.body);
        const links = [...document.querySelectorAll("a")].slice(0, 80).map((a) => ({
          text: a.textContent.trim(),
          href: a.href,
        })).filter((a) => a.text || a.href);
        return {
          title: document.title,
          url: location.href,
          bodyFont: styles.fontFamily,
          bodyColor: styles.color,
          bodyBg: styles.backgroundColor,
          headings: text("h1,h2,h3"),
          buttons: text("button,[role=button]"),
          links,
          imgs,
        };
      });
      records.push({ ...item, viewport, data });
    } catch (error) {
      records.push({ ...item, viewport, error: String(error) });
    }
  }
  await page.close();
  return records;
}

const desktop = await capture({ width: 1440, height: 1200 }, "desktop");
const mobile = await capture({ width: 390, height: 844 }, "mobile");
await writeFile(path.join(out, "source-summary.json"), JSON.stringify({ capturedAt: new Date().toISOString(), desktop, mobile }, null, 2));
await browser.close();
