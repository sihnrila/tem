const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const variants = JSON.parse(fs.readFileSync(path.join(root, 'variants/variant-config.json'), 'utf8'));

const ensureDir = (dir) => fs.mkdirSync(dir, { recursive: true });

const templatePath = path.join(__dirname, 'templates/thumbnail.html');
const template = fs.readFileSync(templatePath, 'utf8');

const buildHtml = (variant) => {
  return template
    .replace('{{BACKGROUND_IMAGE}}', variant.marketing.backgroundImage || '')
    .replace('{{TITLE}}', variant.marketing.conceptTitle)
    .replace('{{SUBTITLE}}', variant.marketing.subtitle)
    .replace('{{KEYWORDS}}', variant.marketing.keywords.join(' · '))
    .replace('{{SKIN_ID}}', variant.id);
};

const brandIds = ['brand-archive-studio', 'brand-silent-form', 'brand-mono-house'];
const signatureIds = ['signature-motion-01', 'signature-typo-01'];

// Scroll through the page to trigger IntersectionObserver reveals
const triggerReveals = async (page) => {
  await page.evaluate(async () => {
    const totalHeight = document.body.scrollHeight;
    const step = 300;
    for (let y = 0; y < totalHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
    await new Promise(r => setTimeout(r, 200));
  });
};

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  /* ===== Marketing thumbnails ===== */
  for (const variant of variants) {
    const marketingDir = path.join(distDir, variant.id, 'marketing');
    ensureDir(marketingDir);

    const html = buildHtml(variant);
    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    await page.setViewportSize({ width: 1200, height: 1500 });
    await page.screenshot({ path: path.join(marketingDir, 'thumbnail.png') });

    await page.setViewportSize({ width: 1600, height: 900 });
    await page.screenshot({ path: path.join(marketingDir, 'thumbnail_wide.png') });

    await page.setViewportSize({ width: 1200, height: 1200 });
    await page.screenshot({ path: path.join(marketingDir, 'thumbnail_square.png') });
  }

  /* ===== Brand demo page screenshots ===== */
  for (const brandId of brandIds) {
    const mainPage = path.join(distDir, brandId, 'cafe24', 'pages', 'main.html');
    const detailPage = path.join(distDir, brandId, 'cafe24', 'pages', 'product_detail.html');
    const marketingDir = path.join(distDir, brandId, 'marketing');
    ensureDir(marketingDir);

    if (fs.existsSync(mainPage)) {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('file://' + mainPage, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(1200);
      await triggerReveals(page);
      await page.screenshot({ path: path.join(marketingDir, 'demo_home.png'), fullPage: true });

      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto('file://' + mainPage, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(1200);
      await triggerReveals(page);
      await page.screenshot({ path: path.join(marketingDir, 'demo_home_mobile.png'), fullPage: true });
    }

    if (fs.existsSync(detailPage)) {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('file://' + detailPage, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(1200);
      await triggerReveals(page);
      await page.screenshot({ path: path.join(marketingDir, 'demo_pdp.png'), fullPage: true });

      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto('file://' + detailPage, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(1200);
      await triggerReveals(page);
      await page.screenshot({ path: path.join(marketingDir, 'demo_pdp_mobile.png'), fullPage: true });
    }
  }

  /* ===== Signature demo page screenshots ===== */
  for (const sigId of signatureIds) {
    const mainPage = path.join(distDir, sigId, 'cafe24', 'pages', 'main.html');
    const detailPage = path.join(distDir, sigId, 'cafe24', 'pages', 'product_detail.html');
    const marketingDir = path.join(distDir, sigId, 'marketing');
    ensureDir(marketingDir);

    if (fs.existsSync(mainPage)) {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('file://' + mainPage, { waitUntil: 'networkidle', timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(1500);
      await triggerReveals(page);
      await page.screenshot({ path: path.join(marketingDir, 'demo_home.png'), fullPage: true });

      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto('file://' + mainPage, { waitUntil: 'networkidle', timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(1500);
      await triggerReveals(page);
      await page.screenshot({ path: path.join(marketingDir, 'demo_home_mobile.png'), fullPage: true });
    }

    if (fs.existsSync(detailPage)) {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('file://' + detailPage, { waitUntil: 'networkidle', timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(1500);
      await triggerReveals(page);
      await page.screenshot({ path: path.join(marketingDir, 'demo_pdp.png'), fullPage: true });

      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto('file://' + detailPage, { waitUntil: 'networkidle', timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(1500);
      await triggerReveals(page);
      await page.screenshot({ path: path.join(marketingDir, 'demo_pdp_mobile.png'), fullPage: true });
    }
  }

  await browser.close();
  console.log('Thumbnails + brand demo + signature demo screenshots generated.');
})();
