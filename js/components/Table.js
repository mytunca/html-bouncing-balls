import { html } from "../preact/index.js";

// Yön açısını hesaplamak için bir yardımcı fonksiyon
const getDirectionStyle = (vx, vy) => {
    const angle = Math.atan2(vy, vx) * (180 / Math.PI); // Radyan -> Derece
    return `rotate(${angle + 90}deg)`; // CSS dönüşüm açısı
};


function Table({ balls, onDelete }) {
    console.log(balls)
    return html`<table class="table">
        <thead>
        <tr>
            <th>Color</th>
            <th>Diameter</th>
            <th>X</th>
            <th>Y</th>
            <th>Direction</th>
            <th>Speed</th>
            <th>Delete</th>
        </tr>
        </thead>
        <tbody>
            ${balls.map((ball, index) => html`
                <tr key=${index}>
                    <td style="background-color: ${ball.color}; width: 50px; height: 20px;"></td>
                    <td>${ball.diameter.toFixed(2)}</td>
                    <td>${ball.x.toFixed(2)}</td>
                    <td>${ball.y.toFixed(2)}</td>
                    <td>
                        <span style="display: inline-block; transform: ${getDirectionStyle(ball.vx, ball.vy)};">↑</span>
                    </td>
                    <td>${Math.sqrt(ball.vx ** 2 + ball.vy ** 2).toFixed(2)}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onClick=${() => onDelete(index)}>Delete</button>
                    </td>
                </tr>
            `)}
        </tbody>
    </table>`;
}

export default Table;