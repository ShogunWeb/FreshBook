/* FreshBook - Reels rule */
window.CF_applyReelsRule = function CF_applyReelsRule() {
  // Reels can appear as a module labeled "Reels"
  // Heuristic: find text nodes "Reels" and hide their module container.
  const spans = document.querySelectorAll('span, a');
  spans.forEach(node => {
    const t = (node.textContent || "").trim();
    if (t.toLowerCase() === "reels") {
      const container = node.closest("[aria-labelledby]");
      if (container) {
        if (!container.dataset.cfReelsHidden) {
          container.dataset.cfReelsHidden = "1";
          container.dataset.cfReelsPrevDisplay = container.style.display || "";
        }
        container.style.display = "none";
      }
    }
  });
};

window.CF_restoreReelsRule = function CF_restoreReelsRule() {
  document.querySelectorAll('[data-cf-reels-hidden="1"]').forEach(container => {
    container.style.display = container.dataset.cfReelsPrevDisplay || "";
    delete container.dataset.cfReelsHidden;
    delete container.dataset.cfReelsPrevDisplay;
  });
};
