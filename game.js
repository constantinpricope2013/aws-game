// game.js

class Obstacle {
    constructor() {
        this.width = 30;
        this.height = 50;
        this.x = canvas.width;
        this.y = canvas.height - this.height;
        this.speed = 4;
    }

    draw() {
        ctx.fillStyle = 'brown';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.x -= this.speed;
    }
}

let obstacles = [];
let gameRunning = true;
let score = 0;
let spawnTimer = 0;
const spawnInterval = 100;
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

class Potato {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 50;
        this.speed = 5;
        this.jumpForce = 0;
        this.gravity = 0.5;
        this.isJumping = false;
        this.score = 0;
    }

    draw() {
        ctx.fillStyle = '#brown';
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.size, this.size * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
        // Add eyes and smile
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.x - 10, this.y - 10, 5, 0, Math.PI * 2);
        ctx.arc(this.x + 10, this.y - 10, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x, this.y + 5, 20, 0, Math.PI);
        ctx.stroke();
    }

    update() {
        // Basic physics
        if (this.isJumping) {
            this.y -= this.jumpForce;
            this.jumpForce -= this.gravity;
        }

        // Ground collision
        if (this.y > canvas.height - this.size) {
            this.y = canvas.height - this.size;
            this.isJumping = false;
        }
    }

    jump() {
        if (!this.isJumping) {
            this.jumpForce = 15;
            this.isJumping = true;
        }
    }
}

// Game state
const player = new Potato(canvas.width/2, canvas.height - 50);
let gameRunning = true;
let score = 0;

// Controls
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowLeft':
            player.x -= player.speed;
            break;
        case 'ArrowRight':
            player.x += player.speed;
            break;
        case ' ':
            player.jump();
            break;
    }
});

// Game loop
function checkCollision(player, obstacle) {
    return player.x < obstacle.x + obstacle.width &&
           player.x + player.size > obstacle.x &&
           player.y < obstacle.y + obstacle.height &&
           player.y + player.size > obstacle.y;
}

function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw player
    player.update();
    player.draw();
    
    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    if (gameRunning) {
        requestAnimationFrame(gameLoop);
    }
}

gameLoop();
