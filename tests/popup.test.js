const assert = require("node:assert/strict");
const { test } = require("node:test");
const path = require("node:path");

function createCheckbox() {
  return {
    checked: false,
    _handlers: {},
    addEventListener(type, fn) {
      this._handlers[type] = fn;
    }
  };
}

function loadPopupModule({ storageData, tabs }) {
  const elements = {};
  const domReady = { handler: null };
  const sentMessages = [];
  const lastQuery = { value: null };

  const defaults = {
    enabled: true,
    removeStories: true,
    removeReels: true,
    removeSuggested: true,
    removeWall: false
  };

  const browser = {
    storage: {
      local: {
        async get() {
          return { ...defaults, ...storageData };
        },
        async set(patch) {
          Object.assign(storageData, patch);
        }
      }
    },
    tabs: {
      async query(query) {
        lastQuery.value = query;
        return tabs;
      },
      async sendMessage(tabId, msg) {
        sentMessages.push({ tabId, msg });
      }
    }
  };

  const documentMock = {
    getElementById(id) {
      return elements[id];
    },
    addEventListener(evt, cb) {
      if (evt === "DOMContentLoaded") domReady.handler = cb;
    }
  };

  Object.keys(defaults).forEach(k => {
    elements[k] = createCheckbox();
  });

  const modulePath = path.resolve(__dirname, "../src/popup/popup.js");
  delete require.cache[modulePath];
  global.browser = browser;
  global.document = documentMock;

  const mod = require(modulePath);

  return {
    mod,
    elements,
    domReady,
    storageData,
    sentMessages,
    lastQuery
  };
}

test("popup load populates checkbox states from storage", async () => {
  const ctx = loadPopupModule({
    storageData: { removeWall: true, removeReels: false },
    tabs: []
  });

  await ctx.domReady.handler();

  assert.equal(ctx.elements.removeWall.checked, true);
  assert.equal(ctx.elements.removeReels.checked, false);
  assert.equal(ctx.elements.removeSuggested.checked, true);
});

test("popup save writes storage and notifies facebook tabs", async () => {
  const ctx = loadPopupModule({
    storageData: { removeWall: true },
    tabs: [{ id: 1 }, { id: 2 }]
  });

  await ctx.mod.save("removeWall", false);

  assert.equal(ctx.storageData.removeWall, false);
  assert.deepEqual(ctx.lastQuery.value, { url: "*://*.facebook.com/*" });
  assert.deepEqual(ctx.sentMessages, [
    { tabId: 1, msg: { type: "CF_SETTINGS_UPDATED" } },
    { tabId: 2, msg: { type: "CF_SETTINGS_UPDATED" } }
  ]);
});
