/* global browser */
const DEFAULTS = {
  enabled: true,
  removeStories: true,
  removeReels: true,
  removeSuggested: true,
  removeWall: false
};

const KEYS = Object.keys(DEFAULTS);
// Use local storage for deterministic behavior in Firefox.
const storageArea = browser.storage.local;

function $(id) { return document.getElementById(id); }

async function load() {
  const s = await storageArea.get(DEFAULTS);
  KEYS.forEach(k => { $(k).checked = !!s[k]; });
}

async function save(key, value) {
  await storageArea.set({ [key]: value });
  try {
    // Notify all facebook.com tabs so content scripts re-apply immediately.
    const tabs = await browser.tabs.query({ url: "*://*.facebook.com/*" });
    await Promise.all(
      tabs
        .filter(t => t.id)
        .map(t => browser.tabs.sendMessage(t.id, { type: "CF_SETTINGS_UPDATED" }))
    );
  } catch (e) {
    // Ignore messaging errors (e.g., no matching tabs).
  }
}

function wire() {
  KEYS.forEach(k => {
    $(k).addEventListener("change", (e) => save(k, e.target.checked));
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  wire();
  await load();
});

if (typeof module !== "undefined") {
  module.exports = {
    DEFAULTS,
    KEYS,
    load,
    save,
    wire,
    _test: { storageArea }
  };
}
