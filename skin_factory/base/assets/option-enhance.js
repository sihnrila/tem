(() => {
  const selects = document.querySelectorAll('select');
  if (!selects.length) return;

  selects.forEach((select) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'option-buttons';
    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(select);

    Array.from(select.options).forEach((opt, idx) => {
      if (!opt.value && idx === 0) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option-btn';
      btn.textContent = opt.textContent;
      btn.addEventListener('click', () => {
        select.value = opt.value || opt.textContent;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        wrapper.querySelectorAll('.option-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
      wrapper.appendChild(btn);
    });
  });
})();
