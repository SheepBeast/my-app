const { renderToString } = require("react-dom/server");

const appSlot = "<!-- app-slot -->";
const stateSlot = "<!-- initial-state-slot -->";

module.exports = options => {
  const { template, initialState, bundle } = options;

  const appContent = renderToString(bundle);

  let html = template.replace(appSlot, appContent);

  if (initialState) {
    const stateContent = `
    <script>
    window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
    </script>
    `;

    html = html.replace(stateSlot, stateContent);
  }

  return html;
};
