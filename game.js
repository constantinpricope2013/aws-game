import { Potato } from './classes/Potato.js';
import { Obstacle } from './classes/Obstacle.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game state
let gameRunning = false;  // Changed to false initially
let currentLevel = 1;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0; // Get stored high score
let obstacles = [];
let gameStarted = false;  // New state to track if game has started

// Create potato instance
const potato = new Potato(100, canvas.height / 2);

// Create start button
const startButton = {
    x: canvas.width / 2 - 100,
    y: canvas.height / 2,
    width: 200,
    height: 50
};

// Draw start screen
function drawStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw title
    ctx.fillStyle = 'black';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Potato Game', canvas.width / 2, canvas.height / 3);
    
    // Draw high score
    ctx.font = '24px Arial';
    ctx.fillText(`High Score: ${highScore}`, canvas.width / 2, canvas.height / 2 - 50);
    
    // Draw start button
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(startButton.x, startButton.y, startButton.width, startButton.height);
    
    // Draw button text
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText('Start Game', canvas.width / 2, startButton.y + 35);
}

// Handle mouse click
function handleClick(event) {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    
    // Check if click is within start button bounds
    if (!gameStarted &&
        clickX >= startButton.x &&
        clickX <= startButton.x + startButton.width &&
        clickY >= startButton.y &&
        clickY <= startButton.y + startButton.height) {
        startGame();
    }
}

// Start game function
function startGame() {
    gameStarted = true;
    gameRunning = true;
    resetGame();
    gameLoop();
}

// Modify game over function
function gameOver() {
    gameRunning = false;
    gameStarted = false;
    
    // Update high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
    
    // Show game over screen
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width/2, canvas.height/2 - 60);
    ctx.fillText(`Score: ${score}`, canvas.width/2, canvas.height/2);
    ctx.fillText(`High Score: ${highScore}`, canvas.width/2, canvas.height/2 + 60);
    ctx.font = '24px Arial';
    ctx.fillText('Press Space to play again', canvas.width/2, canvas.height/2 + 120);
}

// Modify game loop
function gameLoop() {
    if (!gameStarted) {
        drawStartScreen();
        return;
    }
    
    if (gameRunning) {
        updateGame();
        drawGame();
        requestAnimationFrame(gameLoop);
    }
}

// Modify event listeners
canvas.addEventListener('click', handleClick);

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        if (!gameStarted) {
            startGame();
        } else if (gameRunning) {
            potato.jump();
        } else {
            startGame();
        }
    }
});

// Initial draw of start screen
drawStartScreen();
