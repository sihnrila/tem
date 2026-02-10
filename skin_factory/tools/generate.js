const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const baseDir = path.join(root, 'base');
const distDir = path.join(root, 'dist');
const variants = JSON.parse(fs.readFileSync(path.join(root, 'variants/variant-config.json'), 'utf8'));

const replaceTokens = (content, map) => {
  let out = content;
  Object.entries(map).forEach(([key, value]) => {
    out = out.replaceAll(`{{${key}}}`, String(value));
  });
  return out;
};

const ensureDir = (dir) => fs.mkdirSync(dir, { recursive: true });

const copyAndReplace = (src, dest, tokenMap) => {
  const content = fs.readFileSync(src, 'utf8');
  const output = replaceTokens(content, tokenMap);
  ensureDir(path.dirname(dest));
  fs.writeFileSync(dest, output, 'utf8');
};

variants.forEach((variant) => {
  const skinDir = path.join(distDir, variant.id);
  ensureDir(skinDir);

  const tokenMap = {
    VARIANT_ID: variant.id,
    SKIN_NAME: variant.name,
    HEADER_MODE: variant.layout.headerMode,
    GRID_DENSITY: variant.layout.gridDensity,
    CARD_STYLE: variant.layout.cardStyle,
    DETAIL_GALLERY: variant.layout.detailGallery,
    LOOKBOOK_STYLE: variant.layout.lookbookStyle,
    FOOTER_STYLE: variant.layout.footerStyle,
    ...variant.tokens
  };

  // assets
  copyAndReplace(
    path.join(baseDir, 'assets/tokens.css'),
    path.join(skinDir, 'assets/tokens.css'),
    variant.tokens
  );

  ['theme.css', 'theme.js', 'option-enhance.js', 'cart-drawer.js'].forEach((file) => {
    const src = path.join(baseDir, 'assets', file);
    const dest = path.join(skinDir, 'assets', file);
    ensureDir(path.dirname(dest));
    fs.copyFileSync(src, dest);
  });

  // pages
  const pagesDir = path.join(baseDir, 'cafe24/pages');
  fs.readdirSync(pagesDir).forEach((file) => {
    const src = path.join(pagesDir, file);
    const dest = path.join(skinDir, 'cafe24/pages', file);
    copyAndReplace(src, dest, tokenMap);
  });

  // feature toggles
  const mainPage = path.join(skinDir, 'cafe24/pages/main.html');
  if (fs.existsSync(mainPage)) {
    let html = fs.readFileSync(mainPage, 'utf8');
    html = html.replace(
      'data-feature="freeShippingBar"',
      `data-feature="freeShippingBar" data-feature-freeShippingBar="${variant.features.freeShippingBar}"`
    );
    fs.writeFileSync(mainPage, html, 'utf8');
  }
});

console.log(`Generated ${variants.length} skins in dist/`);
