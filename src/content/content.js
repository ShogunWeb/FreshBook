/* global browser */
/* FreshBook - content script controller */

(function () {
  const DEFAULTS = window.CF_DEFAULTS || {
    enabled: true,
    removeStories: true,
    removeReels: true,
    removeSuggested: true,
    removeWall: false
  };

  let lastRun = 0;
  let scheduled = false;

  const storageArea = browser.storage.local;

  async function getSettings() {
    const settings = await storageArea.get(DEFAULTS);
    return settings;
  }

  function debounceApply(fn, delayMs) {
    const now = Date.now();
    if (scheduled) return;
    const wait = Math.max(0, delayMs - (now - lastRun));
    scheduled = true;
    setTimeout(async () => {
      scheduled = false;
      lastRun = Date.now();
      await fn();
    }, wait);
  }

  let lastSettings = null;

  async function applyAll(settingsOverride) {
    const s = settingsOverride || await getSettings();
    if (!s.enabled) {
      if (typeof window.CF_restoreWallRule === "function") window.CF_restoreWallRule();
      return;
    }

    try {
      if (s.removeWall && typeof window.CF_applyWallRule === "function") {
        window.CF_applyWallRule();
      } else if (!s.removeWall && typeof window.CF_restoreWallRule === "function") {
        window.CF_restoreWallRule();
      }
      if (s.removeStories && typeof window.CF_applyStoriesRule === "function") window.CF_applyStoriesRule();
      if (s.removeReels && typeof window.CF_applyReelsRule === "function") window.CF_applyReelsRule();
      if (s.removeSuggested && typeof window.CF_applySuggestedRule === "function") {
        window.CF_applySuggestedRule();
      } else if (!s.removeSuggested && typeof window.CF_restoreSuggestedRule === "function") {
        window.CF_restoreSuggestedRule();
      }
    } catch (e) {
      console.debug("FreshBook rule error:", e);
    }
  }

  function settingsChanged(next) {
    if (!lastSettings) return true;
    return Object.keys(DEFAULTS).some(k => next[k] !== lastSettings[k]);
  }

  async function checkSettingsChange() {
    const s = await getSettings();
    if (settingsChanged(s)) {
      lastSettings = { ...s };
      await applyAll(s);
    }
  }

  // Initial pass
  debounceApply(applyAll, 0);

  // Poll for settings changes to cover cases where onChanged doesn't fire
  // setInterval(checkSettingsChange, 1000);

  // Re-apply when settings change
  browser.storage.onChanged.addListener(() => debounceApply(applyAll, 50));

  // Re-apply when popup notifies about a settings change
  browser.runtime.onMessage.addListener((msg) => {
    if (msg && msg.type === "CF_SETTINGS_UPDATED") {
      debounceApply(applyAll, 0);
    }
  });

  // Observe dynamic DOM updates
  const root = document.documentElement || document.body;
  const observer = new MutationObserver(() => debounceApply(applyAll, 300));
  observer.observe(root, { childList: true, subtree: true });
})();
