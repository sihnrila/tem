const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const variants = JSON.parse(fs.readFileSync(path.join(root, 'variants/variant-config.json'), 'utf8'));

const ensureDir = (dir) => fs.mkdirSync(dir, { recursive: true });

const buildHtml = (variant) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body, html { margin:0; padding:0; width:100%; height:100%; font-family: Arial, sans-serif; }
    .wrap { position:relative; width:100%; height:100%; background:#111; color:#fff; }
    .bg { position:absolute; inset:0; background: linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.1)); }
    .content { position:absolute; inset:0; display:flex; flex-direction:column; justify-content:center; padding:60px; }
    .title { font-size:64px; font-weight:700; }
    .subtitle { margin-top:12px; font-size:24px; opacity:0.85; }
    .keywords { margin-top:18px; font-size:18px; display:flex; gap:12px; }
    .id { position:absolute; right:30px; bottom:30px; font-size:16px; opacity:0.7; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="bg"></div>
    <div class="content">
      <div class="title">${variant.marketing.conceptTitle}</div>
      <div class="subtitle">${variant.marketing.subtitle}</div>
      <div class="keywords">${variant.marketing.keywords.join(' · ')}</div>
    </div>
    <div class="id">${variant.id}</div>
  </div>
</body>
</html>
`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

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

  await browser.close();
  console.log('Thumbnails generated.');
})();
