const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const variants = JSON.parse(fs.readFileSync(path.join(root, 'variants/variant-config.json'), 'utf8'));

const ensureDir = (dir) => fs.mkdirSync(dir, { recursive: true });

const renderSalesMd = (variant) => {
  return `# ${variant.name} (${variant.id})

## One-line pitch
${variant.marketing.conceptTitle} — ${variant.marketing.subtitle}

## Included pages
- main.html
- product_list.html
- product_detail.html
- member_login.html
- lookbook.html

## Conversion UX features
- Sticky PDP purchase area (desktop)
- Mobile fixed bottom CTA
- Cart drawer with safe fallback

## Customization guide
- tokens.css에서 폰트/컬러/라운드/그리드 변경
- variant-config.json의 layout 옵션 변경

## Update policy
- 6개월 무료 업데이트

## Support scope
- 버그 수정 및 Cafe24 모듈 호환성 확인

## Changelog
- v1.0.0 초기 출시

## Demo links
- MAIN: /cafe24/pages/main.html
- LIST: /cafe24/pages/product_list.html
- DETAIL: /cafe24/pages/product_detail.html
`;
};

const renderSalesHtml = (md) => {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Sales</title></head><body><pre>${md.replace(
    /</g,
    '&lt;'
  )}</pre></body></html>`;
};

let bundle = '# ALL SALES PAGES\\n\\n';

variants.forEach((variant, idx) => {
  const marketDir = path.join(distDir, variant.id, 'market');
  ensureDir(marketDir);

  const md = renderSalesMd(variant);
  fs.writeFileSync(path.join(marketDir, 'SALES_PAGE_KO.md'), md, 'utf8');
  fs.writeFileSync(path.join(marketDir, 'SALES_PAGE_KO.html'), renderSalesHtml(md), 'utf8');
  fs.writeFileSync(
    path.join(marketDir, 'THUMBNAIL_TEXT.txt'),
    `${variant.marketing.conceptTitle}\\n${variant.marketing.subtitle}`,
    'utf8'
  );
  fs.writeFileSync(
    path.join(marketDir, 'FEATURES.json'),
    JSON.stringify(variant.features, null, 2),
    'utf8'
  );

  bundle += `## ${variant.name} (${variant.id})\\n\\n${md}\\n\\n`;
  if (idx === variants.length - 1) bundle += '\\n';
});

ensureDir(distDir);
fs.writeFileSync(path.join(distDir, 'ALL_SALES_PAGES_KO.md'), bundle, 'utf8');

console.log('Sales pages generated.');
