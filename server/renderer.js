const appSlot = "<!-- app-slot -->";
const stateSlot = "<!-- initial-state-slot -->";

const initApp = (indexHtmlStr, serverBundle) =>
  indexHtmlStr.replace(appSlot, serverBundle);
const initState = (indexHtmlStr, initialState) =>
  indexHtmlStr.replace(stateSlot, JSON.stringify(initialState));

module.exports = {
  initApp,
  initState
};
