/* FreshBook - Suggested posts rule */
window.CF_applySuggestedRule = function CF_applySuggestedRule() {
  // Heuristic: hide posts that contain typical "follow/join" language.
  const KEYWORDS = [
    // English
    "follow",
    "join",
    // French
    "suivre",
    "rejoindre",
    // Dutch
    "volgen",
    "lid worden",
    // German
    "folgen",
    "beitreten",
    // Spanish
    "seguir",
    "unirte",
    // Italian
    "segui",
    "unisciti"
  ];

  const candidates = new Set();

  document.querySelectorAll("span").forEach(span => {
    const text = (span.textContent || "").toLowerCase().trim();
    if (!text) return;
    if (!KEYWORDS.some(kw => text.includes(kw))) return;

    const container = span.closest("[aria-labelledby]") || span.closest('[role="article"]');
    if (container) candidates.add(container);
  });

  candidates.forEach(container => {
    if (!container.dataset.cfSuggestedHidden) {
      container.dataset.cfSuggestedHidden = "1";
      container.dataset.cfSuggestedPrevDisplay = container.style.display || "";
    }
    container.style.display = "none";
  });
};

window.CF_restoreSuggestedRule = function CF_restoreSuggestedRule() {
  document.querySelectorAll('[data-cf-suggested-hidden="1"]').forEach(container => {
    container.style.display = container.dataset.cfSuggestedPrevDisplay || "";
    delete container.dataset.cfSuggestedHidden;
    delete container.dataset.cfSuggestedPrevDisplay;
  });
};
