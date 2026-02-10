(() => {
  const drawer = document.createElement('div');
  drawer.id = 'cartDrawer';
  drawer.innerHTML = '<button id="cartDrawerClose" type="button">닫기</button><div id="cartDrawerBody"></div>';
  document.body.appendChild(drawer);

  const overlay = document.createElement('div');
  overlay.id = 'cartDrawerOverlay';
  document.body.appendChild(overlay);

  const openDrawer = async () => {
    try {
      const res = await fetch('/order/basket.html', { credentials: 'include' });
      if (!res.ok) throw new Error('fetch failed');
      const html = await res.text();
      const body = drawer.querySelector('#cartDrawerBody');
      if (body) body.innerHTML = html;
      drawer.classList.add('open');
      overlay.classList.add('open');
      document.body.classList.add('cart-open');
    } catch (e) {
      window.location.href = '/order/basket.html';
    }
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.classList.remove('cart-open');
  };

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-cart-drawer]');
    if (trigger) {
      e.preventDefault();
      openDrawer();
    }
    if (e.target.id === 'cartDrawerClose') closeDrawer();
    if (e.target.id === 'cartDrawerOverlay') closeDrawer();
  });
})();
