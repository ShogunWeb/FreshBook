/* FreshBook - Wall / News Feed rule */
window.CF_applyWallRule = function CF_applyWallRule() {
  // Best-effort: hide the main feed container
  const feed = document.querySelector('[role="main"]');
  if (feed) {
    if (!feed.dataset.cfWallHidden) {
      feed.dataset.cfWallHidden = "1";
      feed.dataset.cfWallPrevDisplay = feed.style.display || "";
    }
    feed.style.display = "none";
  }
};

window.CF_restoreWallRule = function CF_restoreWallRule() {
  const feed = document.querySelector('[role="main"]');
  if (feed && feed.dataset.cfWallHidden) {
    feed.style.display = feed.dataset.cfWallPrevDisplay || "";
    delete feed.dataset.cfWallHidden;
    delete feed.dataset.cfWallPrevDisplay;
  }
};
