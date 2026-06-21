import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE = 'https://unified-college-interaction-system.vercel.app';
const OUT = path.join(__dirname, 'docs', 'screenshots');

const pages = [
  { name: '01_home', url: '/', wait: 3000 },
  { name: '02_login', url: '/login', wait: 2000 },
  { name: '03_clubs', url: '/clubs', wait: 3000 },
  { name: '04_events', url: '/events', wait: 3000 },
  { name: '05_forum', url: '/forum', wait: 3000 },
  { name: '06_faculty', url: '/faculty', wait: 3000 },
  { name: '07_announcements', url: '/announcements', wait: 3000 },
  { name: '08_resources', url: '/resources', wait: 3000 },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  // Create output directory
  const fs = await import('fs');
  fs.mkdirSync(OUT, { recursive: true });

  for (const pg of pages) {
    const page = await context.newPage();
    console.log(`📸 Capturing ${pg.name} → ${SITE}${pg.url}`);
    try {
      await page.goto(`${SITE}${pg.url}`, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(pg.wait);
      await page.screenshot({
        path: path.join(OUT, `${pg.name}.png`),
        fullPage: false,
      });
      console.log(`   ✅ Saved ${pg.name}.png`);
    } catch (err) {
      console.log(`   ❌ Failed: ${err.message}`);
    }
    await page.close();
  }

  // Also take a full-page screenshot of home
  const homePage = await context.newPage();
  await homePage.goto(SITE, { waitUntil: 'networkidle', timeout: 30000 });
  await homePage.waitForTimeout(3000);
  await homePage.screenshot({
    path: path.join(OUT, '00_home_full.png'),
    fullPage: true,
  });
  console.log('   ✅ Saved 00_home_full.png (full page)');
  await homePage.close();

  await browser.close();
  console.log('\n🎉 All screenshots saved to docs/screenshots/');
})();
