/* FreshBook - Stories rule */
window.CF_applyStoriesRule = function CF_applyStoriesRule() {
  // Try common labels/landmarks for stories
  const candidates = [
    '[aria-label*="Stories" i]',
    '[aria-label*="Story" i]'
  ];

  for (const sel of candidates) {
    document.querySelectorAll(sel).forEach(el => {
      const container = el.closest('[role="region"], section, div');
      if (container) {
        if (!container.dataset.cfStoriesHidden) {
          container.dataset.cfStoriesHidden = "1";
          container.dataset.cfStoriesPrevDisplay = container.style.display || "";
        }
        container.style.display = "none";
      }
    });
  }
};

window.CF_restoreStoriesRule = function CF_restoreStoriesRule() {
  document.querySelectorAll('[data-cf-stories-hidden="1"]').forEach(container => {
    container.style.display = container.dataset.cfStoriesPrevDisplay || "";
    delete container.dataset.cfStoriesHidden;
    delete container.dataset.cfStoriesPrevDisplay;
  });
};
