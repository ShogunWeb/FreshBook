const assert = require("node:assert/strict");
const { test } = require("node:test");
const path = require("node:path");

function loadSettingsModule() {
  const modulePath = path.resolve(__dirname, "../src/content/settings.js");
  delete require.cache[modulePath];
  global.window = {};
  return require(modulePath);
}

test("applySettings restores everything when disabled", () => {
  const { applySettings } = loadSettingsModule();
  const calls = [];

  const ctx = {
    CF_restoreWallRule() { calls.push("restoreWall"); },
    CF_restoreStoriesRule() { calls.push("restoreStories"); },
    CF_restoreReelsRule() { calls.push("restoreReels"); },
    CF_restoreSuggestedRule() { calls.push("restoreSuggested"); }
  };

  applySettings({ enabled: false }, ctx);

  assert.deepEqual(calls, [
    "restoreWall",
    "restoreStories",
    "restoreReels",
    "restoreSuggested"
  ]);
});

test("applySettings applies and restores per-feature toggles", () => {
  const { applySettings } = loadSettingsModule();
  const calls = [];

  const ctx = {
    CF_applyWallRule() { calls.push("applyWall"); },
    CF_restoreWallRule() { calls.push("restoreWall"); },
    CF_applyStoriesRule() { calls.push("applyStories"); },
    CF_restoreStoriesRule() { calls.push("restoreStories"); },
    CF_applyReelsRule() { calls.push("applyReels"); },
    CF_restoreReelsRule() { calls.push("restoreReels"); },
    CF_applySuggestedRule() { calls.push("applySuggested"); },
    CF_restoreSuggestedRule() { calls.push("restoreSuggested"); }
  };

  applySettings(
    {
      enabled: true,
      removeWall: true,
      removeStories: false,
      removeReels: true,
      removeSuggested: false
    },
    ctx
  );

  assert.deepEqual(calls, [
    "applyWall",
    "restoreStories",
    "applyReels",
    "restoreSuggested"
  ]);
});
