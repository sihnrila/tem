(() => {
  const body = document.body;
  if (!body) return;

  const headerMode = body.dataset.header;
  if (headerMode) body.classList.add(`header-${headerMode}`);

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const header = document.querySelector('.xans-layout-header');
  const parallaxEls = Array.from(document.querySelectorAll('[data-parallax]'));

  let lastScrollY = 0;
  let ticking = false;

  const onScroll = () => {
    lastScrollY = window.scrollY || 0;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (header) {
          header.classList.toggle('is-solid', lastScrollY > 20);
          header.classList.toggle('is-shrink', lastScrollY > 80);
        }
        if (!prefersReduced && !isTouch && parallaxEls.length) {
          const offset = Math.min(lastScrollY * 0.1, 20);
          parallaxEls.forEach((el) => {
            el.style.transform = `translateY(${offset}px)`;
          });
        }
        ticking = false;
      });
      ticking = true;
    }
  };

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('[data-reveal]').forEach((el) => {
    el.classList.add('reveal');
    if (!prefersReduced) revealObserver.observe(el);
    else el.classList.add('is-visible');
  });

  const staggerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        staggerObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll('[data-animate="stagger"]').forEach((el) => {
    if (el.children.length) {
      Array.from(el.children).forEach((child, idx) => {
        child.classList.add('stagger-line');
        child.style.transitionDelay = `${idx * 120}ms`;
      });
    } else {
      const text = el.textContent.trim().split(/\s+/);
      el.innerHTML = text
        .map((word, idx) => `<span class="stagger-line" style="transition-delay:${idx * 120}ms">${word}</span>`)
        .join(' ');
    }
    if (!prefersReduced) staggerObserver.observe(el);
    else el.classList.add('is-visible');
  });

  if (!isTouch && !prefersReduced) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const moveCursor = (event) => {
      cursor.style.setProperty('--cursor-x', `${event.clientX}px`);
      cursor.style.setProperty('--cursor-y', `${event.clientY}px`);
    };

    const scaleCursor = (scale) => {
      cursor.style.setProperty('--cursor-scale', String(scale));
    };

    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', (event) => {
      if (event.target.closest('a, button')) scaleCursor(1.6);
    });
    document.addEventListener('mouseout', (event) => {
      if (event.target.closest('a, button')) scaleCursor(1);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
