(() => {
  const drawer = document.createElement('div');
  drawer.id = 'cartDrawer';
  drawer.style.cssText = 'position:fixed;right:0;top:0;width:360px;height:100%;background:#fff;border-left:1px solid #eee;transform:translateX(100%);transition:transform .3s;z-index:9999;overflow:auto;';
  document.body.appendChild(drawer);

  const openDrawer = async () => {
    try {
      const res = await fetch('/order/basket.html', { credentials: 'include' });
      if (!res.ok) throw new Error('fetch failed');
      drawer.innerHTML = await res.text();
      drawer.style.transform = 'translateX(0)';
    } catch (e) {
      window.location.href = '/order/basket.html';
    }
  };

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-cart-drawer]');
    if (trigger) {
      e.preventDefault();
      openDrawer();
    }
  });
})();
