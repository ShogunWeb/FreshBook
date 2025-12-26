/* FreshBook - Suggested posts rule */
window.CF_applySuggestedRule = function CF_applySuggestedRule() {
  // Heuristic: remove posts that contain typical "suggested" language.
  // NOTE: This is English-only for MVP.
  const KEYWORDS = [
    "Suggested for you",
    "Suggested",
    "Follow"
  ];

  document.querySelectorAll('[role="article"]').forEach(article => {
    const text = (article.innerText || "").trim();
    if (!text) return;

    for (const kw of KEYWORDS) {
      if (text.includes(kw)) {
        article.remove();
        return;
      }
    }
  });
};
