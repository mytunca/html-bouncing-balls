import { html } from "../../preact/index.js";


function Ball({ id, x, y, diameter, color }) {
    return html`<div
      class="ball rounded-circle position-absolute d-flex justify-content-center align-items-center"
      style=${{
            width: `${diameter}px`,
            height: `${diameter}px`,
            backgroundColor: color,
            transform: `translate(${x}px, ${y}px)`,
        }}
    >
        <div class="ball-count">${id}</div>
    </div>`;
}

export default Ball;