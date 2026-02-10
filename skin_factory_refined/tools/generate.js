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
    freeShippingBar: variant.features.freeShippingBar,
    reviewHighlight: variant.features.reviewHighlight,
    cartDrawer: variant.features.cartDrawer,
    trustBadges: variant.features.trustBadges,
    ...variant.tokens
  };

  // assets
  copyAndReplace(
    path.join(baseDir, 'assets/tokens.css'),
    path.join(skinDir, 'assets/tokens.css'),
    variant.tokens
  );

  ['theme.css', 'theme.js', 'option-enhance.js', 'cart-drawer.js', 'preview.js'].forEach((file) => {
    const src = path.join(baseDir, 'assets', file);
    const dest = path.join(skinDir, 'assets', file);
    ensureDir(path.dirname(dest));
    fs.copyFileSync(src, dest);
  });

  // pages — signature variants use dedicated templates
  const pagesDir = path.join(baseDir, 'cafe24/pages');

  // Map: signature-specific templates → standard filenames
  const templateMap = {};
  if (variant.id.startsWith('signature-motion')) {
    templateMap['signature_motion.html'] = 'main.html';
    templateMap['signature_motion_pdp.html'] = 'product_detail.html';
  } else if (variant.id.startsWith('signature-typo')) {
    templateMap['signature_typo.html'] = 'main.html';
    templateMap['signature_typo_pdp.html'] = 'product_detail.html';
  }

  const skipFiles = new Set(Object.keys(templateMap));
  const overrideTargets = new Set(Object.values(templateMap));

  fs.readdirSync(pagesDir).forEach((file) => {
    // If this file is a signature template, copy it with its mapped name
    if (templateMap[file]) {
      const src = path.join(pagesDir, file);
      const dest = path.join(skinDir, 'cafe24/pages', templateMap[file]);
      copyAndReplace(src, dest, tokenMap);
      return;
    }

    // Skip signature templates that don't belong to this variant
    if (file.startsWith('signature_')) return;

    // If a signature template overrides this file, skip the default
    if (overrideTargets.has(file) && Object.keys(templateMap).length > 0) return;

    const src = path.join(pagesDir, file);
    const dest = path.join(skinDir, 'cafe24/pages', file);
    copyAndReplace(src, dest, tokenMap);
  });

  // feature toggles already injected via templates
});

console.log(`Generated ${variants.length} skins in dist/`);
