/* FreshBook - Reels rule */
window.CF_applyReelsRule = function CF_applyReelsRule() {
  // Reels can appear as a module labeled "Reels"
  // Heuristic: find text nodes "Reels" and remove their module container.
  const spans = document.querySelectorAll('span, a');
  spans.forEach(node => {
    const t = (node.textContent || "").trim();
    if (t.toLowerCase() === "reels") {
      const container = node.closest('[role="region"], section, div');
      if (container) container.remove();
    }
  });
};
