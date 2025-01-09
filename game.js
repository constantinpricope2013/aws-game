import { Potato } from './classes/Potato.js';
import { Obstacle } from './classes/Obstacle.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game state
let gameRunning = true;
let currentLevel = 1;
let score = 0;
let obstacles = [];

// Create potato instance
const potato = new Potato(100, canvas.height / 2);

// Level configurations
const levels = {
    1: {
        obstacleCount: 3,
        speed: 5,
        gap: 300
    },
    2: {
        obstacleCount: 4,
        speed: 6,
        gap: 250
    },
    3: {
        obstacleCount: 5,
        speed: 7,
        gap: 200
    }
};

// Initialize obstacles for current level
function initializeObstacles() {
    obstacles = [];
    const level = levels[currentLevel];
    
    for (let i = 0; i < level.obstacleCount; i++) {
        const x = canvas.width + (i * level.gap);
        const height = Math.random() * (canvas.height / 2) + 100;
        obstacles.push(new Obstacle(x, height, level.speed));
    }
}

// Check collisions
function checkCollisions() {
    return obstacles.some(obstacle => {
        return potato.x < obstacle.x + obstacle.width &&
               potato.x + potato.width > obstacle.x &&
               potato.y < obstacle.y + obstacle.height &&
               potato.y + potato.height > obstacle.y;
    });
}

// Update game state
function updateGame() {
    // Update potato
    potato.update(canvas.height);

    // Update obstacles
    obstacles.forEach(obstacle => {
        obstacle.update();
        
        // Reset obstacle when it goes off screen
        if (obstacle.x + obstacle.width < 0) {
            obstacle.x = canvas.width;
            obstacle.height = Math.random() * (canvas.height / 2) + 100;
            score++;
            
            // Check for level up
            if (score % 10 === 0 && currentLevel < Object.keys(levels).length) {
                levelUp();
            }
        }
    });

    // Check for collisions
    if (checkCollisions()) {
        gameOver();
    }
}

// Draw game state
function drawGame() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw potato
    potato.draw(ctx);
    
    // Draw obstacles
    obstacles.forEach(obstacle => obstacle.draw(ctx));
    
    // Draw score and level
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`Level: ${currentLevel}`, 10, 60);
}

function levelUp() {
    currentLevel++;
    initializeObstacles();
    // Optional: Show level up message
    showMessage(`Level ${currentLevel}!`);
}

function showMessage(text) {
    ctx.fillStyle = 'black';
    ctx.font = '40px Arial';
    ctx.fillText(text, canvas.width/2 - 100, canvas.height/2);
}

function gameOver() {
    gameRunning = false;
    showMessage('Game Over! Press Space to restart');
}

function resetGame() {
    score = 0;
    currentLevel = 1;
    gameRunning = true;
    potato.reset(100, canvas.height / 2);
    initializeObstacles();
}

// Game loop
function gameLoop() {
    if (gameRunning) {
        updateGame();
        drawGame();
        requestAnimationFrame(gameLoop);
    }
}

// Event listeners
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        if (gameRunning) {
            potato.jump();
        } else {
            resetGame();
            gameLoop();
        }
    }
});

// Start the game
initializeObstacles();
gameLoop();
