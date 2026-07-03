import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const out = path.resolve("evidence/local");
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
for (const [name, viewport, route] of [
  ["home-desktop", { width: 1440, height: 1200 }, "/"],
  ["home-mobile", { width: 390, height: 844 }, "/"],
  ["collection-desktop", { width: 1440, height: 1200 }, "/"],
  ["collection-mobile", { width: 390, height: 844 }, "/"],
  ["product-desktop", { width: 1440, height: 1200 }, "/"],
  ["product-mobile", { width: 390, height: 844 }, "/"],
  ["admin-desktop", { width: 1440, height: 1200 }, "/"],
  ["admin-mobile", { width: 390, height: 844 }, "/"],
]) {
  const page = await browser.newPage({ viewport });
  await page.goto(`http://127.0.0.1:5173${route}`, { waitUntil: "networkidle" });
  const mobile = viewport.width <= 860;
  if (name.startsWith("collection")) {
    await page.getByLabel("Open menu").click();
    await page.locator(".leftDrawer .menuRow").filter({ hasText: "Samsung" }).click();
  }
  if (name.startsWith("product")) await page.locator(".productCard").first().click();
  if (name.startsWith("admin")) {
    await page.getByLabel("Open menu").click();
    await page.locator(".drawerLink").filter({ hasText: "Admin" }).click();
  }
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(out, `${name}.png`), fullPage: true });
  await page.close();
}
await browser.close();
