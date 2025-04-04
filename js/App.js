import { html, useState, useRef, useEffect } from "./preact/index.js";
import { createBall, moveBall, checkCollision } from "./components/Ball/utils.js";
import Ball from "./components/Ball/index.js";
import Table from "./components/Table.js";

export const App = () => {
    const [balls, setBalls] = useState([]);
    const [running, setRunning] = useState(false);
    const [updateFreq, setUpdateFreq] = useState(50); // Hız kontrolü için state
    const intervalRef = useRef(null);
    const gameAreaRef = useRef(null);

    useEffect(() => {
        handleCreateBallClick();
        toggleMotion();

        return () => {
            clearInterval(intervalRef.current);
        };
    }, []);

    const toggleMotion = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setRunning(false);
        } else {
            intervalRef.current = setInterval(updateBalls, updateFreq);
            setRunning(true);
        }
    };



    const handleSpeedChange = (e) => {
        const newSpeed = e.target.value;
        setUpdateFreq(newSpeed);

        // Eğer toplar hareket ediyorsa, intervali güncelle
        if (running) {
            clearInterval(intervalRef.current);
            intervalRef.current = setInterval(updateBalls, newSpeed);
        }
    };

    const handleCreateBallClick = () => {
        const { clientWidth, clientHeight } = gameAreaRef.current;
        setBalls((prev) => [...prev, createBall(prev.length + 1, clientWidth, clientHeight)]);
    };

    const updateBalls = () => {
        const { clientWidth, clientHeight } = gameAreaRef.current;
        setBalls((prevBalls) => {
            let updatedBalls = prevBalls.map((ball) => moveBall(ball, clientWidth, clientHeight));
            for (let i = 0; i < updatedBalls.length; i++) {
                for (let j = i + 1; j < updatedBalls.length; j++) {
                    [updatedBalls[i], updatedBalls[j]] = checkCollision(updatedBalls[i], updatedBalls[j]);
                }
            }
            return [...updatedBalls];
        });
    };

    return html`<div class="row justify-content-center">
        <h1>Bouncing Balls</h1>
        <div id="gameAreaWrapper" class="position-relative">
            <!-- X ve Y eksenlerini ekliyoruz -->
            <div class="x-axis">
                ${Array.from({ length: 11 }, (_, i) => {
        const { clientWidth } = gameAreaRef.current || { clientWidth: 400 }; // Varsayılan genişlik
        const step = clientWidth / 10;
        return html`<span class="x-label" style="left: ${i * 10}%; position: absolute;">${Math.round(i * step)}</span>`;
    })}
            </div>
            <div class="y-axis">
                ${Array.from({ length: 11 }, (_, i) => {
        const { clientHeight } = gameAreaRef.current || { clientHeight: 400 }; // Varsayılan yükseklik
        const step = clientHeight / 10;
        return html`<span class="y-label" style="top: ${(10 - i) * 10}%; position: absolute;">${Math.round(i * step)}</span>`;
    })}
            </div>
            <div id="gameArea" class="position-relative" ref=${gameAreaRef}>
                ${balls.map(({ id, x, y, diameter, color }) => html`<${Ball} id=${id} x=${x} y=${y} diameter=${diameter} color=${color} />`)}
            </div>
        </div>
        <div class="my-2">
            <button class="btn btn-primary me-1" onClick=${handleCreateBallClick}>Create a ball</button>
            <button class="btn btn-warning me-1" onClick=${toggleMotion} disabled=${balls.length === 0}>${running ? "Stop" : "Start"}</button>
            <button class="btn btn-danger" onClick=${() => { setBalls([]); if (running) toggleMotion(); }}>Destroy all balls</button>
            <div class="mt-2">
                <label for="speedRange" class="form-label">Update Frequency: ${updateFreq}ms</label>
                <input id="speedRange" type="range" min="5" max="100" step="5" value=${updateFreq} onInput=${handleSpeedChange} />
            </div>
        </div>
        <${Table} balls=${balls} onDelete=${(index) => {
            setBalls((prevBalls) => prevBalls.filter((_, i) => i !== index));
        }} />
    </div>`;
};
