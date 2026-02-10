(() => {
  const optionWraps = document.querySelectorAll('.xans-product-option');
  if (!optionWraps.length) return;

  optionWraps.forEach((wrap) => {
    const selects = wrap.querySelectorAll('select');
    selects.forEach((select) => {
      if (select.dataset.enhanced === 'true') return;
      select.dataset.enhanced = 'true';

      const buttonWrap = document.createElement('div');
      buttonWrap.className = 'option-buttons';
      select.parentNode.insertBefore(buttonWrap, select);
      buttonWrap.appendChild(select);

      Array.from(select.options).forEach((opt, idx) => {
        if (!opt.value && idx === 0) return;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'option-btn';
        btn.textContent = opt.textContent;
        btn.addEventListener('click', () => {
          select.value = opt.value || opt.textContent;
          select.dispatchEvent(new Event('change', { bubbles: true }));
          buttonWrap.querySelectorAll('.option-btn').forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
        });
        buttonWrap.appendChild(btn);
      });
    });
  });
})();
