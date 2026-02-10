/* S133 — Subtle Motion Scroll: scroll reveal + soft parallax */
(function () {
  /* ---- Scroll Reveal ---- */
  var sections = document.querySelectorAll('.section, .section-divider, .recommend');
  sections.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    sections.forEach(function (el) { revealObs.observe(el); });
  } else {
    sections.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---- Reveal recommend cards once visible ---- */
  var recommendCards = document.querySelectorAll('.recommend-card');
  if (recommendCards.length && 'IntersectionObserver' in window) {
    var cardObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          cardObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    recommendCards.forEach(function (c) { cardObs.observe(c); });
  }

  /* ---- Soft parallax on hero media panels ---- */
  var heroLeft = document.querySelector('.hero-media-left');
  var heroRight = document.querySelector('.hero-media-right');
  if (heroLeft && heroRight) {
    window.addEventListener('scroll', function () {
      var y = window.scrollY * 0.04;
      heroLeft.style.transform = 'translateY(' + y + 'px)';
      heroRight.style.transform = 'translateY(' + (y * -1) + 'px)';
    }, { passive: true });
  }

  /* ---- Parallax drift for story image ---- */
  var storyImage = document.querySelector('.story .image-box');
  if (storyImage && 'IntersectionObserver' in window) {
    var storyInView = false;
    var storyObs = new IntersectionObserver(function (entries) {
      storyInView = entries[0].isIntersecting;
    }, { threshold: 0.1 });
    storyObs.observe(storyImage);

    window.addEventListener('scroll', function () {
      if (!storyInView) return;
      var rect = storyImage.getBoundingClientRect();
      var center = rect.top + rect.height / 2;
      var viewCenter = window.innerHeight / 2;
      var offset = (center - viewCenter) * 0.03;
      storyImage.style.transform = 'translateY(' + offset + 'px)';
    }, { passive: true });
  }

  /* ---- Parallax for lookbook cards ---- */
  var lookbookCards = document.querySelectorAll('.lookbook-card');
  if (lookbookCards.length) {
    window.addEventListener('scroll', function () {
      lookbookCards.forEach(function (card) {
        var rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          var offset = (rect.top - window.innerHeight / 2) * 0.02;
          card.style.transform = 'translateY(' + offset + 'px)';
        }
      });
    }, { passive: true });
  }
})();
