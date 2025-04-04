import { render, html } from "./preact/index.js";
import { App } from "./App.js";

document.addEventListener("DOMContentLoaded", () => {
  render(html`<${App} />`, document.querySelector("#app"));
});