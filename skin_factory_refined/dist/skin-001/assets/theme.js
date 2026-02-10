(() => {
  const body = document.body;
  if (!body) return;

  // layout toggles
  const headerMode = body.dataset.header;
  if (headerMode) body.classList.add(`header-${headerMode}`);
})();
