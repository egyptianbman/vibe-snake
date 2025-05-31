const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.width = `${window.innerWidth}px`;
canvas.style.height = `${window.innerHeight}px`;

const scale = 40;
let snake = [{ x: 8 * scale, y: 8 * scale }];
let dir = { x: 0, y: 0 };
let food = { x: Math.floor(Math.random() * canvas.width / scale) * scale, y: Math.floor(Math.random() * canvas.height / scale) * scale };

function update() {
    const head = { x: snake[0].x + dir.x * scale, y: snake[0].y + dir.y * scale };

    if (head.x === food.x && head.y === food.y) {
        food = {
            x: Math.floor(Math.random() * canvas.width / scale) * scale,
            y: Math.floor(Math.random() * canvas.height / scale) * scale
        };
    } else {
        snake.pop();
    }

    snake.unshift(head);

    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        resetGame();
    }
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#222';
    for (let x = 0; x < canvas.width; x += scale) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += scale) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    ctx.fillStyle = '#0f0';
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, scale, scale));

    ctx.fillStyle = '#f00';
    ctx.fillRect(food.x, food.y, scale, scale);
}

function resetGame() {
    snake = [{ x: 8 * scale, y: 8 * scale }];
    dir = { x: 0, y: 0 };
}

document.addEventListener('keydown', e => {
    switch (e.code) {
        case 'ArrowUp':
            if (dir.y === 0) dir = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (dir.y === 0) dir = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (dir.x === 0) dir = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (dir.x === 0) dir = { x: 1, y: 0 };
            break;
    }
});

function loop() {
    update();
    draw();
    setTimeout(loop, 100);
}

loop();