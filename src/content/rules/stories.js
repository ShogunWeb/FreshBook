/* FreshBook - Stories rule */
window.CF_applyStoriesRule = function CF_applyStoriesRule() {
  // Try common labels/landmarks for stories
  const candidates = [
    '[aria-label*="Stories" i]',
    '[aria-label*="Story" i]'
  ];

  for (const sel of candidates) {
    document.querySelectorAll(sel).forEach(el => {
      // Remove a reasonable container around it
      const container = el.closest('[role="region"], section, div');
      if (container) container.remove();
    });
  }
};
