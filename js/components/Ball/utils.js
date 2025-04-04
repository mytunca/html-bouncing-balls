export const createBall = (id, areaWidth, areaHeight) => {
    const diameter = Math.random() * 80 + 23;
    return {
        id,
        diameter,
        x: Math.random() * (areaWidth - diameter),
        y: Math.random() * (areaHeight - diameter),
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 0.5) * 20,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`
    };
};

export const moveBall = (ball, areaWidth, areaHeight) => {
    let { x, y, vx, vy, diameter } = ball;
    x += vx;
    y += vy;

    if (x <= 0 || x + diameter >= areaWidth) {
        vx = -vx;
        x = x <= 0 ? 0 : areaWidth - diameter;
    }
    if (y <= 0 || y + diameter >= areaHeight) {
        vy = -vy;
        y = y <= 0 ? 0 : areaHeight - diameter;
    }
    return { ...ball, x, y, vx, vy };
};

export const checkCollision = (ball1, ball2) => {
    const ball1CenterX = ball1.x + ball1.diameter / 2;
    const ball1CenterY = ball1.y + ball1.diameter / 2;
    const ball2CenterX = ball2.x + ball2.diameter / 2;
    const ball2CenterY = ball2.y + ball2.diameter / 2;

    const dx = ball2CenterX - ball1CenterX;
    const dy = ball2CenterY - ball1CenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = (ball1.diameter / 2) + (ball2.diameter / 2);

    if (distance < minDistance) {
        const nx = dx / distance;
        const ny = dy / distance;

        const mass1 = ball1.diameter;
        const mass2 = ball2.diameter;

        const v1n = ball1.vx * nx + ball1.vy * ny;
        const v2n = ball2.vx * nx + ball2.vy * ny;

        const v1t_x = ball1.vx - v1n * nx;
        const v1t_y = ball1.vy - v1n * ny;
        const v2t_x = ball2.vx - v2n * nx;
        const v2t_y = ball2.vy - v2n * ny;

        const v1nAfter = (v1n * (mass1 - mass2) + 2 * mass2 * v2n) / (mass1 + mass2);
        const v2nAfter = (v2n * (mass2 - mass1) + 2 * mass1 * v1n) / (mass1 + mass2);

        ball1.vx = v1nAfter * nx + v1t_x;
        ball1.vy = v1nAfter * ny + v1t_y;
        ball2.vx = v2nAfter * nx + v2t_x;
        ball2.vy = v2nAfter * ny + v2t_y;

        const overlap = minDistance - distance;
        ball1.x -= (overlap / 2) * nx;
        ball1.y -= (overlap / 2) * ny;
        ball2.x += (overlap / 2) * nx;
        ball2.y += (overlap / 2) * ny;
    }

    return [ball1, ball2];
};