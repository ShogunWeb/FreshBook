/* FreshBook - settings application */
(function () {
  function applySettings(s, api) {
    const ctx = api || window;
    if (!s || !ctx) return;

    if (!s.enabled) {
      if (typeof ctx.CF_restoreWallRule === "function") ctx.CF_restoreWallRule();
      if (typeof ctx.CF_restoreStoriesRule === "function") ctx.CF_restoreStoriesRule();
      if (typeof ctx.CF_restoreReelsRule === "function") ctx.CF_restoreReelsRule();
      if (typeof ctx.CF_restoreSuggestedRule === "function") ctx.CF_restoreSuggestedRule();
      return;
    }

    if (s.removeWall && typeof ctx.CF_applyWallRule === "function") {
      ctx.CF_applyWallRule();
    } else if (!s.removeWall && typeof ctx.CF_restoreWallRule === "function") {
      ctx.CF_restoreWallRule();
    }

    if (s.removeStories && typeof ctx.CF_applyStoriesRule === "function") {
      ctx.CF_applyStoriesRule();
    } else if (!s.removeStories && typeof ctx.CF_restoreStoriesRule === "function") {
      ctx.CF_restoreStoriesRule();
    }

    if (s.removeReels && typeof ctx.CF_applyReelsRule === "function") {
      ctx.CF_applyReelsRule();
    } else if (!s.removeReels && typeof ctx.CF_restoreReelsRule === "function") {
      ctx.CF_restoreReelsRule();
    }

    if (s.removeSuggested && typeof ctx.CF_applySuggestedRule === "function") {
      ctx.CF_applySuggestedRule();
    } else if (!s.removeSuggested && typeof ctx.CF_restoreSuggestedRule === "function") {
      ctx.CF_restoreSuggestedRule();
    }
  }

  window.CF_applySettings = applySettings;

  if (typeof module !== "undefined") {
    module.exports = { applySettings };
  }
})();
