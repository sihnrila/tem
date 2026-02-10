(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('[data-header]');
  const toast = document.querySelector('[data-toast]');
  const mobileCta = document.querySelector('[data-mobile-cta]');
  const parallax = document.querySelector('[data-parallax]');
  const pdpMain = document.getElementById('pdpMain');
  const pdpThumbs = document.getElementById('pdpThumbs');

  let lastScroll = 0;
  let ticking = false;

  const onScroll = () => {
    lastScroll = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (header) {
          header.classList.toggle('is-solid', lastScroll > 20);
          header.classList.toggle('is-shrink', lastScroll > 80);
        }
        if (mobileCta) {
          mobileCta.classList.toggle('is-visible', lastScroll > 420);
        }
        if (parallax && !prefersReduced) {
          const offset = Math.min(lastScroll * 0.15, 60);
          parallax.style.transform = `translateY(${offset}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  };

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  const lazyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        const src = img.getAttribute('data-src');
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
        }
        lazyObserver.unobserve(img);
      });
    },
    { rootMargin: '120px' }
  );

  document.querySelectorAll('img.lazy').forEach((img) => lazyObserver.observe(img));

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 1800);
  };

  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-toast]');
    if (!target) return;
    showToast(target.dataset.toast || '완료되었습니다');
  });

  if (pdpThumbs && pdpMain) {
    const setMain = (src, button) => {
      pdpMain.classList.add('is-transition');
      setTimeout(() => {
        pdpMain.src = src;
        pdpMain.classList.remove('is-transition');
      }, 140);
      pdpThumbs.querySelectorAll('.thumb').forEach((thumb) => thumb.classList.remove('active'));
      if (button) button.classList.add('active');
    };

    pdpThumbs.addEventListener('click', (event) => {
      const button = event.target.closest('.thumb');
      if (!button) return;
      setMain(button.dataset.src, button);
    });

    let startX = 0;
    let activeIndex = 0;
    const thumbs = Array.from(pdpThumbs.querySelectorAll('.thumb'));

    const handleSwipe = (endX) => {
      const diff = endX - startX;
      if (Math.abs(diff) < 40) return;
      activeIndex = diff < 0 ? Math.min(activeIndex + 1, thumbs.length - 1) : Math.max(activeIndex - 1, 0);
      const next = thumbs[activeIndex];
      if (next) setMain(next.dataset.src, next);
    };

    pdpMain.addEventListener('touchstart', (event) => {
      startX = event.touches[0].clientX;
    });

    pdpMain.addEventListener('touchend', (event) => {
      handleSwipe(event.changedTouches[0].clientX);
    });
  }

  document.querySelectorAll('[data-option-group]').forEach((group) => {
    group.addEventListener('click', (event) => {
      const btn = event.target.closest('.option-btn');
      if (!btn) return;
      group.querySelectorAll('.option-btn').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
    });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
