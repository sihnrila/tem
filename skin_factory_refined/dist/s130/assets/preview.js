(() => {
  const isLocal =
    location.hostname === 'localhost' ||
    location.hostname === '127.0.0.1' ||
    location.hostname === '';

  if (!isLocal) return;

  const variantId = document.body.dataset.variantId || '';

  const fillIfEmpty = (selector, html) => {
    const el = document.querySelector(selector);
    if (!el) return;
    if (el.children.length > 0 || el.textContent.trim().length > 0) return;
    el.innerHTML = html;
  };

  const setImageIfEmpty = (selector, src, alt) => {
    const img = document.querySelector(selector);
    if (!img) return;
    if (!img.getAttribute('src')) {
      img.setAttribute('src', src);
      img.setAttribute('alt', alt || '');
    }
  };

  /* ===== Brand image sets ===== */
  const brandImages = {
    'brand-archive-studio': [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=70',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=70',
      'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=70',
      'https://images.unsplash.com/photo-1581044777550-4cfa60707998?auto=format&fit=crop&w=900&q=70',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=70',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=70',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=70',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=70'
    ],
    'brand-silent-form': [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=70',
      'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=900&q=70',
      'https://images.unsplash.com/photo-1504703395950-b89145a5425b?auto=format&fit=crop&w=900&q=70',
      'https://images.unsplash.com/photo-1502716119720-b23a1e3f1e46?auto=format&fit=crop&w=900&q=70',
      'https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=900&q=70',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=70',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=70',
      'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=900&q=70'
    ],
    'brand-mono-house': [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=70',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=70',
      'https://images.unsplash.com/photo-1516822003754-cca485356ecb?auto=format&fit=crop&w=900&q=70',
      'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=900&q=70',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=70',
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=900&q=70',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=70',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=70'
    ]
  };

  const defaultImages = [
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=70',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=70',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=70',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=70',
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=70',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=70',
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=70',
    'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=900&q=70'
  ];

  const images = brandImages[variantId] || defaultImages;

  /* ===== Brand content sets ===== */
  const brandContent = {
    'brand-archive-studio': {
      logo: 'ARCHIVE STUDIO',
      heroCopy: ['Archive Collection', 'Spring 2025'],
      statement: 'We design structure.<br>We refine emotion.<br>We build quiet commerce.',
      products: [
        { name: 'Archive Coat', price: 219000 },
        { name: 'Studio Trench', price: 199000 },
        { name: 'Form Knit', price: 149000 },
        { name: 'Light Tailored Shirt', price: 129000 },
        { name: 'Soft Structure Pants', price: 169000 },
        { name: 'Balance Slip Dress', price: 189000 },
        { name: 'Archive Collar Top', price: 149000 },
        { name: 'Studio Wide Pants', price: 169000 }
      ],
      pdpName: 'Archive Coat',
      pdpPrice: '₩219,000',
      pdpDesc: 'Clean tailoring and softened edges. Built to hold form without noise.',
      options: ['Ivory', 'Warm Beige', 'Stone']
    },
    'brand-silent-form': {
      logo: 'SILENT FORM',
      heroCopy: ['Designed in silence.', 'Built with intention.'],
      statement: 'Less noise.<br>More intention.<br>Only essential form.',
      products: [
        { name: 'Quiet Field Coat', price: 219000 },
        { name: 'Intent Shell Top', price: 169000 },
        { name: 'Low Tone Knit', price: 149000 },
        { name: 'Still Wide Trousers', price: 189000 },
        { name: 'Muted Collar Shirt', price: 129000 },
        { name: 'Form Layer Dress', price: 199000 },
        { name: 'Rest Pullover', price: 149000 },
        { name: 'Silent Wrap Coat', price: 219000 }
      ],
      pdpName: 'Quiet Field Coat',
      pdpPrice: '₩219,000',
      pdpDesc: 'Muted texture, deliberate volume. Essential form that stays.',
      options: ['Taupe', 'Ash Gray', 'Muted Brown']
    },
    'brand-mono-house': {
      logo: 'MONO HOUSE',
      heroCopy: ['MONO IS ENOUGH.', ''],
      statement: 'Contrast defines clarity.',
      products: [
        { name: 'Mono Grid Shirt', price: 129000 },
        { name: 'Axis Coat', price: 219000 },
        { name: 'Line Knit Top', price: 149000 },
        { name: 'Vector Trousers', price: 189000 },
        { name: 'Frame Blazer', price: 199000 },
        { name: 'Contrast Slip', price: 169000 },
        { name: 'Grid Layer Top', price: 149000 },
        { name: 'Edge Wide Pants', price: 189000 }
      ],
      pdpName: 'Axis Coat',
      pdpPrice: '₩219,000',
      pdpDesc: 'Sharp contrast, refined edge. Essential geometry for daily wear.',
      options: ['Black', 'White', 'Off White']
    }
  };

  const defaultContent = {
    logo: 'KOKOROCU',
    heroCopy: ['Archive Collection', 'Spring 2025'],
    statement: 'We design structure.<br>We refine emotion.<br>We build quiet commerce.',
    products: [
      { name: 'Archive Coat', price: 219000 },
      { name: 'Serene Shirt', price: 149000 },
      { name: 'Contour Knit', price: 169000 },
      { name: 'Quiet Trousers', price: 189000 },
      { name: 'Studio Dress', price: 199000 },
      { name: 'Balance Jacket', price: 198000 },
      { name: 'Soft Tailored Set', price: 248000 },
      { name: 'Minimal Blouse', price: 129000 }
    ],
    pdpName: 'Archive Coat',
    pdpPrice: '₩358,000',
    pdpDesc: '정제된 실루엣과 구조감 있는 소재로 완성한 에디토리얼 라인.',
    options: ['Ivory', 'Taupe', 'Charcoal']
  };

  const brand = brandContent[variantId] || defaultContent;

  /* ===== Card builder ===== */
  const productCard = (idx) => {
    const p = brand.products[idx % brand.products.length];
    return `
    <li>
      <div class="thumbnail">
        <img src="${images[idx % images.length]}" alt="${p.name}">
        <button class="quick-add" type="button">Quick add</button>
      </div>
      <div class="description">
        <p class="name">${p.name}</p>
        <p class="price">₩${p.price.toLocaleString()}</p>
      </div>
    </li>`;
  };

  const gridHtml = (count) =>
    `<ul class="prdList">${Array.from({ length: count }).map((_, i) => productCard(i)).join('')}</ul>`;

  /* ===== Header ===== */
  fillIfEmpty(
    '.xans-layout-header',
    `<div class="preview-header">
      <div class="logo">${brand.logo}</div>
      <nav class="preview-nav">
        <a href="#">Shop</a>
        <a href="#">Lookbook</a>
        <a href="#">Journal</a>
        <a href="#">Brand</a>
      </nav>
      <div class="preview-actions">KRW · Login · Cart</div>
    </div>`
  );

  /* ===== Home hero / editorial / statement ===== */
  setImageIfEmpty('.hero-image', images[0], 'Hero');
  setImageIfEmpty('.editorial-image', images[2], 'Editorial');

  const heroCaptionEl = document.querySelector('.hero-caption');
  if (heroCaptionEl && heroCaptionEl.querySelector('p')) {
    heroCaptionEl.querySelector('p').textContent = brand.heroCopy[0];
    const h1 = heroCaptionEl.querySelector('h1');
    if (h1 && brand.heroCopy[1]) h1.textContent = brand.heroCopy[1];
    else if (h1 && !brand.heroCopy[1]) h1.style.display = 'none';
  }

  const statementEl = document.querySelector('.brand-statement');
  if (statementEl && statementEl.textContent.includes('We design')) {
    statementEl.innerHTML = `<p>${brand.statement}</p>`;
  }

  /* ===== Product modules ===== */
  fillIfEmpty('.xans-product-listmain', gridHtml(8));
  fillIfEmpty('.xans-product-listnew', gridHtml(2));
  fillIfEmpty('.xans-product-listnormal', gridHtml(8));
  fillIfEmpty('.xans-product-listbest', gridHtml(4));

  /* ===== Category / sort ===== */
  fillIfEmpty(
    '.xans-product-menupackage',
    `<div class="preview-chip-group">
      <span class="chip active">All</span>
      <span class="chip">Outer</span>
      <span class="chip">Top</span>
      <span class="chip">Bottom</span>
      <span class="chip">Accessories</span>
    </div>`
  );

  fillIfEmpty(
    '.xans-product-normalmenu',
    `<div class="preview-sort">
      <span>신상품</span><span>인기순</span><span>낮은가격</span><span>높은가격</span>
    </div>`
  );

  /* ===== Reviews ===== */
  fillIfEmpty(
    '.xans-board-list-4',
    `<ul class="preview-review">
      <li><strong>고객 리뷰</strong> 텍스처와 톤이 고급스럽습니다.</li>
      <li><strong>고객 리뷰</strong> 이미지가 크게 보여 만족합니다.</li>
      <li><strong>고객 리뷰</strong> 구성과 가격 밸런스가 좋습니다.</li>
    </ul>`
  );

  /* ===== PDP ===== */
  fillIfEmpty('.xans-product-image', `<img src="${images[1]}" alt="${brand.pdpName}">`);

  fillIfEmpty(
    '.xans-product-addimage',
    `<div class="preview-thumbs">
      ${[2, 3, 4, 5].map((idx) => `<img src="${images[idx]}" alt="Thumb">`).join('')}
    </div>`
  );

  fillIfEmpty(
    '.xans-product-detail',
    `<div class="preview-detail">
      <h1>${brand.pdpName}</h1>
      <p class="price">${brand.pdpPrice}</p>
      <p class="desc">${brand.pdpDesc}</p>
    </div>`
  );

  fillIfEmpty(
    '.xans-product-option',
    `<div class="preview-options">
      <label>옵션</label>
      <select>
        <option value="">옵션 선택</option>
        ${brand.options.map((o) => `<option value="${o}">${o}</option>`).join('')}
      </select>
    </div>`
  );

  fillIfEmpty(
    '.xans-product-action',
    `<div class="preview-actions">
      <button type="button">장바구니 담기</button>
      <button type="button">바로구매</button>
    </div>`
  );

  fillIfEmpty(
    '.xans-product-relation',
    `<ul class="prdList">
      ${[4, 5, 6, 7].map((idx) => productCard(idx)).join('')}
    </ul>`
  );

  /* ===== Footer ===== */
  fillIfEmpty(
    '.xans-layout-footer',
    `<div class="preview-footer">
      <div>${brand.logo}</div>
      <div>© 2026 ${brand.logo}. All rights reserved.</div>
    </div>`
  );
})();
