/* S135 — Fixed CTA & Conversion UX: cart drawer, quick-add, fixed CTA bar */
(function () {
  /* ---- Create cart drawer ---- */
  var overlay = document.createElement('div');
  overlay.className = 'cart-drawer-overlay';
  document.body.appendChild(overlay);

  var drawer = document.createElement('div');
  drawer.className = 'cart-drawer';
  drawer.innerHTML =
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">' +
      '<div style="font-size:14px;letter-spacing:0.2em;text-transform:uppercase;font-weight:600;">Cart</div>' +
      '<button id="drawerClose" style="border:0;background:none;font-size:22px;cursor:pointer;padding:4px;">×</button>' +
    '</div>' +
    '<div class="ship-progress">' +
      '<span>무료배송까지 12,000원 남았어요</span>' +
      '<div class="ship-progress-bar"><div class="ship-progress-fill"></div></div>' +
    '</div>' +
    '<div id="drawerItems" style="margin-top:16px;font-size:13px;color:#666;flex:1;">장바구니가 비어있습니다.</div>' +
    '<div id="drawerTotal" style="border-top:1px solid #e5e5e5;padding-top:12px;margin-top:16px;display:none;">' +
      '<div style="display:flex;justify-content:space-between;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;">' +
        '<span>Total</span><strong id="drawerTotalPrice">₩0</strong>' +
      '</div>' +
      '<button style="width:100%;margin-top:12px;background:#111;color:#fff;border:0;padding:12px;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;cursor:pointer;font-family:inherit;">결제하기</button>' +
    '</div>';
  document.body.appendChild(drawer);

  var count = 0;
  var total = 0;
  var closeBtn = drawer.querySelector('#drawerClose');
  var itemsEl = drawer.querySelector('#drawerItems');
  var totalEl = drawer.querySelector('#drawerTotal');
  var totalPriceEl = drawer.querySelector('#drawerTotalPrice');
  var progressFill = drawer.querySelector('.ship-progress-fill');
  var progressText = drawer.querySelector('.ship-progress span');

  function formatWon(v) { return '₩' + v.toLocaleString('ko-KR'); }

  function updateProgress() {
    var free = 50000;
    var pct = Math.min(100, (total / free) * 100);
    if (progressFill) progressFill.style.width = pct + '%';
    var remain = Math.max(0, free - total);
    if (progressText) {
      if (remain > 0) {
        progressText.textContent = '무료배송까지 ' + formatWon(remain) + ' 남았어요';
      } else {
        progressText.textContent = '🎉 무료배송 적용!';
      }
    }
  }

  function openDrawer() {
    drawer.classList.add('is-open');
    overlay.classList.add('is-open');
  }
  function closeDrawer() {
    drawer.classList.remove('is-open');
    overlay.classList.remove('is-open');
  }

  closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  function addItem(title, price) {
    count += 1;
    total += price;
    itemsEl.innerHTML = '';
    var itemEl = document.createElement('div');
    itemEl.style.cssText = 'display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13px;';
    itemEl.innerHTML = '<span>' + title + ' × ' + count + '</span><span>' + formatWon(total) + '</span>';
    itemsEl.appendChild(itemEl);
    totalEl.style.display = 'block';
    totalPriceEl.textContent = formatWon(total);
    updateProgress();
    openDrawer();
  }

  /* ---- Quick-add buttons on product cards ---- */
  document.querySelectorAll('.card .image-box').forEach(function (box) {
    var btn = document.createElement('button');
    btn.className = 'quick-add';
    btn.type = 'button';
    btn.textContent = 'Quick Add';
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      e.preventDefault();
      var card = box.closest('.card');
      var titleEl = card ? card.querySelector('h3') : null;
      var priceEl = card ? card.querySelector('.price-line.sale') : null;
      var title = titleEl ? titleEl.textContent : 'Item';
      var priceText = priceEl ? priceEl.textContent : '43,000원';
      var price = parseInt(priceText.replace(/[^0-9]/g, ''), 10) || 43000;
      addItem(title, price);
    });
    box.style.position = 'relative';
    box.appendChild(btn);
  });

  /* ---- Fixed CTA bar for detail page ---- */
  if (document.querySelector('.detail-info')) {
    var cta = document.createElement('div');
    cta.className = 'fixed-cta';

    var freeShipDiv = document.createElement('div');
    freeShipDiv.className = 'free-ship';
    freeShipDiv.textContent = '무료배송까지 12,000원 남았어요';

    var actionsDiv = document.createElement('div');
    actionsDiv.className = 'cta-actions';

    var addBtn = document.createElement('button');
    addBtn.className = 'cta-btn';
    addBtn.type = 'button';
    addBtn.textContent = 'Add to Cart';

    var buyBtn = document.createElement('button');
    buyBtn.className = 'cta-btn';
    buyBtn.type = 'button';
    buyBtn.textContent = 'Buy Now';
    buyBtn.style.background = 'transparent';
    buyBtn.style.color = '#111';
    buyBtn.style.border = '1px solid #111';

    actionsDiv.appendChild(addBtn);
    actionsDiv.appendChild(buyBtn);
    cta.appendChild(freeShipDiv);
    cta.appendChild(actionsDiv);
    document.body.appendChild(cta);

    addBtn.addEventListener('click', function () {
      var titleEl = document.querySelector('.detail-info h1');
      var title = titleEl ? titleEl.textContent : 'Item';
      addItem(title, 43000);
    });
    buyBtn.addEventListener('click', function () {
      openDrawer();
    });

    /* Show/hide CTA bar based on scroll past detail actions */
    var detailActions = document.querySelector('.detail-info .actions');
    if (detailActions && 'IntersectionObserver' in window) {
      cta.style.transform = 'translateY(100%)';
      cta.style.transition = 'transform 0.3s ease';
      var ctaObs = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          cta.style.transform = 'translateY(100%)';
        } else {
          cta.style.transform = 'translateY(0)';
        }
      }, { threshold: 0 });
      ctaObs.observe(detailActions);
    }
  }

  /* ---- Trust badges for detail page ---- */
  var summaryEl = document.querySelector('.detail-info .summary');
  if (summaryEl) {
    var trust = document.createElement('div');
    trust.className = 'trust-badges';
    trust.innerHTML = '<span>정품보장</span><span>무료교환</span><span>안전결제</span>';
    summaryEl.parentNode.insertBefore(trust, summaryEl.nextSibling);
  }
})();
