/**
 * modularize-templates.js
 *
 * Converts static HTML skin templates (s129–s137) into Cafe24 Smart Design
 * module-ready pages by:
 *   1. Extracting inline <style> → external skin.css
 *   2. Replacing static header HTML → xans-layout-header module
 *   3. Replacing static product grids → xans-product-* modules
 *   4. Replacing static footer HTML → xans-layout-footer module
 *   5. Injecting data attributes for feature toggles
 *   6. Adding preview.js + theme.js + option-enhance.js + cart-drawer.js refs
 *   7. Writing output to dist/skins/<id>/
 */

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const templatesDir = path.join(root, 'templates');
const distDir = path.join(root, 'dist');

const ensureDir = (dir) => fs.mkdirSync(dir, { recursive: true });

/* ===== Page-type to Cafe24 module mapping ===== */
const pageModuleMap = {
  'index': {
    hero: '<section class="hero-full" data-reveal>\n      <div class="hero-media" data-parallax>\n        <img class="hero-image" src="" alt="">\n      </div>\n      <div class="hero-caption" data-parallax>\n        <p>{{SKIN_NAME}}</p>\n        <h1>Collection</h1>\n      </div>\n    </section>',
    products: '<div class="xans-element- xans-product xans-product-listmain"></div>',
    newProducts: '<div class="xans-element- xans-product xans-product-listnew"></div>',
    banner: '<div class="xans-element- xans-layout xans-layout-banner"></div>',
  },
  'list': {
    categoryMenu: '<div class="xans-element- xans-product xans-product-menupackage"></div>\n      <div class="xans-element- xans-product xans-product-normalmenu"></div>',
    products: '<div class="xans-element- xans-product xans-product-listnormal"></div>\n      <div class="xans-element- xans-product xans-product-listmore"></div>',
  },
  'detail': {
    gallery: '<div class="pdp-gallery">\n        <div class="pdp-thumbs"><div class="xans-element- xans-product xans-product-addimage"></div></div>\n        <div class="pdp-main"><div class="xans-element- xans-product xans-product-image"></div></div>\n      </div>',
    info: '<div class="xans-element- xans-product xans-product-detail"></div>\n        <div class="xans-element- xans-product xans-product-option"></div>\n        <div class="xans-element- xans-product xans-product-action"></div>\n        <a class="pdp-cart-link" href="/order/basket.html" data-cart-drawer>장바구니 열기</a>',
    related: '<div class="xans-element- xans-product xans-product-relation"></div>',
  },
  'review': {
    board: '<div class="xans-element- xans-board xans-board-list-4"></div>',
  },
  'login': {
    form: '<div class="xans-element- xans-member xans-member-login"></div>',
  },
  'cart': {
    basket: '<div class="xans-element- xans-order xans-order-basket"></div>',
  },
  'mypage': {
    info: '<div class="xans-element- xans-myshop xans-myshop-main"></div>',
  },
};

const headerModule = `<header class="xans-element- xans-layout xans-layout-header"></header>`;
const footerModule = `<footer class="xans-element- xans-layout xans-layout-footer"></footer>`;

const featureDataAttrs = `
  data-header="sticky"
  data-grid="normal"
  data-card="classic"
  data-detail-gallery="leftThumb"
  data-lookbook="editorial"
  data-footer="minimal"
  data-feature-freeShippingBar="false"
  data-feature-reviewHighlight="true"
  data-feature-cartDrawer="true"
  data-feature-trustBadges="true"`;

/* ===== Helpers ===== */
function extractStyles(html) {
  const styles = [];
  const cleaned = html.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (_, css) => {
    styles.push(css.trim());
    return '';
  });
  return { html: cleaned, css: styles.join('\n\n') };
}

function extractExternalCssRef(html) {
  const refs = [];
  const cleaned = html.replace(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["'][^>]*\/?>/gi, (match, href) => {
    if (!href.startsWith('http')) refs.push(href);
    return '';
  });
  return { html: cleaned, cssRefs: refs };
}

function getPageType(filename) {
  const base = path.basename(filename, '.html');
  if (base === 'index' || base === 'new-arrivals' || base === 'sale') return 'index';
  if (base === 'list') return 'list';
  if (base === 'detail') return 'detail';
  if (base === 'review' || base === 'qna' || base === 'notice' || base === 'faq') return 'review';
  if (base === 'login') return 'login';
  if (base === 'cart') return 'cart';
  if (base === 'mypage') return 'mypage';
  return 'generic';
}

function buildModularPage(skinId, skinName, pageFile, originalCss, externalCssFiles) {
  const pageType = getPageType(pageFile);
  const pageName = path.basename(pageFile, '.html');
  const modules = pageModuleMap[pageType] || {};

  let mainContent = '';

  switch (pageType) {
    case 'index':
      mainContent = `
    ${modules.hero || ''}

    <main class="container">
      <section class="section featured-grid" data-reveal>
        <h2 class="section-title">Featured</h2>
        ${modules.products}
      </section>

      <section class="section brand-statement" data-reveal>
        <p>Designed with structure. Refined with intention.</p>
      </section>

      <section class="section new-arrivals" data-reveal>
        <h2 class="section-title">New Arrivals</h2>
        ${modules.newProducts}
      </section>
    </main>`;
      break;

    case 'list':
      mainContent = `
    <main class="container">
      <h1 class="section-title">Products</h1>
      ${modules.categoryMenu}
      <section class="section" data-reveal>
        ${modules.products}
      </section>
    </main>`;
      break;

    case 'detail':
      mainContent = `
    <main class="container pdp pdp-refined" data-reveal>
      ${modules.gallery}
      <aside class="pdp-purchase sticky">
        ${modules.info}
        <div class="trust-badges" data-feature="trustBadges">신뢰 배지 영역</div>
      </aside>
    </main>
    <div class="mobile-cta">
      <div class="xans-element- xans-product xans-product-action"></div>
    </div>
    <section class="section related-products container" data-reveal>
      <h2 class="section-title">Related Products</h2>
      ${modules.related}
    </section>`;
      break;

    case 'review':
      mainContent = `
    <main class="container">
      <h1 class="section-title">${pageName === 'review' ? 'Reviews' : pageName === 'qna' ? 'Q&A' : pageName === 'notice' ? 'Notice' : 'FAQ'}</h1>
      <section class="section" data-reveal>
        ${modules.board}
      </section>
    </main>`;
      break;

    case 'login':
      mainContent = `
    <main class="container">
      <h1 class="section-title">Login</h1>
      <section class="section" data-reveal>
        ${modules.form}
      </section>
    </main>`;
      break;

    case 'cart':
      mainContent = `
    <main class="container">
      <h1 class="section-title">Cart</h1>
      <section class="section" data-reveal>
        ${modules.basket}
      </section>
    </main>`;
      break;

    case 'mypage':
      mainContent = `
    <main class="container">
      <h1 class="section-title">My Page</h1>
      <section class="section" data-reveal>
        ${modules.info}
      </section>
    </main>`;
      break;

    default:
      mainContent = `
    <main class="container">
      <h1 class="section-title">${pageName.replace(/-/g, ' ')}</h1>
      <section class="section" data-reveal>
        <p>콘텐츠 영역</p>
      </section>
    </main>`;
      break;
  }

  const scripts = pageType === 'detail'
    ? `  <script src="../../assets/theme.js"></script>
  <script src="../../assets/preview.js"></script>
  <script src="../../assets/option-enhance.js"></script>
  <script src="../../assets/cart-drawer.js"></script>`
    : `  <script src="../../assets/theme.js"></script>
  <script src="../../assets/preview.js"></script>
  <script src="../../assets/cart-drawer.js"></script>`;

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${skinName} - ${pageName}</title>
  <link rel="stylesheet" href="../../assets/tokens.css">
  <link rel="stylesheet" href="../../assets/theme.css">
  <link rel="stylesheet" href="../../assets/skin.css">
</head>
<body
  data-variant-id="${skinId}"${featureDataAttrs}
  class="page-${pageName} layout-normal card-classic footer-minimal"
>
  ${headerModule}
${mainContent}

  ${footerModule}

${scripts}
</body>
</html>
`;
}

/* ===== Main ===== */
const skinDirs = fs.readdirSync(templatesDir).filter((name) => {
  const full = path.join(templatesDir, name);
  return fs.statSync(full).isDirectory() && name.startsWith('s');
});

console.log(`Found ${skinDirs.length} template skins: ${skinDirs.join(', ')}`);

skinDirs.forEach((skinDir) => {
  const skinId = skinDir;
  const srcDir = path.join(templatesDir, skinDir);
  const outDir = path.join(distDir, skinId);
  const pagesDir = path.join(outDir, 'cafe24', 'pages');
  const assetsDir = path.join(outDir, 'assets');
  ensureDir(pagesDir);
  ensureDir(assetsDir);

  /* Read first HTML to extract skin name from title */
  const indexFile = path.join(srcDir, 'index.html');
  let skinName = skinDir.toUpperCase();
  if (fs.existsSync(indexFile)) {
    const indexHtml = fs.readFileSync(indexFile, 'utf8');
    const titleMatch = indexHtml.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch) {
      skinName = titleMatch[1].replace(/정적 복제 템플릿/g, '').trim();
    }
  }

  /* Collect all CSS from index.html */
  let combinedCss = '';
  if (fs.existsSync(indexFile)) {
    const indexHtml = fs.readFileSync(indexFile, 'utf8');
    const { css } = extractStyles(indexHtml);
    combinedCss = css;
  }

  /* Also grab external theme.css if exists */
  const themeCssPath = path.join(srcDir, 'theme.css');
  if (fs.existsSync(themeCssPath)) {
    combinedCss += '\n\n/* === theme.css === */\n' + fs.readFileSync(themeCssPath, 'utf8');
  }

  /* Write skin.css */
  fs.writeFileSync(path.join(assetsDir, 'skin.css'), combinedCss, 'utf8');

  /* Copy shared assets from base */
  const baseAssets = path.join(root, 'base', 'assets');
  ['tokens.css', 'theme.css', 'theme.js', 'preview.js', 'option-enhance.js', 'cart-drawer.js'].forEach((file) => {
    const src = path.join(baseAssets, file);
    if (fs.existsSync(src)) fs.copyFileSync(src, path.join(assetsDir, file));
  });

  /* Convert each HTML page */
  const htmlFiles = fs.readdirSync(srcDir).filter((f) => f.endsWith('.html'));
  htmlFiles.forEach((file) => {
    const pageHtml = buildModularPage(skinId, skinName, file, combinedCss, []);
    fs.writeFileSync(path.join(pagesDir, file), pageHtml, 'utf8');
  });

  /* Copy JS files (review-sort.js, theme.js from template) */
  fs.readdirSync(srcDir).filter((f) => f.endsWith('.js')).forEach((jsFile) => {
    fs.copyFileSync(path.join(srcDir, jsFile), path.join(assetsDir, jsFile));
  });

  console.log(`  ${skinId}: ${htmlFiles.length} pages → ${pagesDir}`);
});

console.log(`\nModularization complete. ${skinDirs.length} skins converted.`);
