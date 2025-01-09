import { Potato } from './classes/Potato.js';
import { Obstacle } from './classes/Obstacle.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game state
let gameRunning = false;
let currentLevel = 1;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let obstacles = [];
let gameStarted = false;

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

// Create start button
const startButton = {
    x: canvas.width / 2 - 100,
    y: canvas.height / 2,
    width: 200,
    height: 50
};

// Reset game function
function resetGame() {
    score = 0;
    currentLevel = 1;
    gameRunning = true;
    // Reset potato position
    potato.reset(100, canvas.height / 2);
    // Initialize new obstacles
    initializeObstacles();
}

// Initialize obstacles for current level
function initializeObstacles() {
    obstacles = [];
    const level = levels[currentLevel];
    
    for (let i = 0; i < level.obstacleCount; i++) {
        const x = canvas.width + (i * level.gap);
        const height = Math.random() * (canvas.height / 2) + 100;
        obstacles.push(new Obstacle(x, height, level.speed, canvas.height));
    }
}

function checkCollisions() {
    const potatoBox = {
        left: potato.x - potato.width/2,
        right: potato.x + potato.width/2,
        top: potato.y - potato.height/2,
        bottom: potato.y + potato.height/2
    };

    return obstacles.some(obstacle => {
        const obstacleBox = {
            left: obstacle.x,
            right: obstacle.x + obstacle.width,
            top: obstacle.y,
            bottom: obstacle.y + obstacle.height
        };

        return !(potatoBox.right < obstacleBox.left || 
                potatoBox.left > obstacleBox.right || 
                potatoBox.bottom < obstacleBox.top || 
                potatoBox.top > obstacleBox.bottom);
    });
}

function updateGame() {
    potato.update(canvas.height);

    obstacles.forEach(obstacle => {
        obstacle.update();
        
        if (obstacle.x + obstacle.width < 0) {
            obstacle.x = canvas.width;
            obstacle.height = Math.random() * (canvas.height / 2) + 100;
            obstacle.y = canvas.height - obstacle.height;
            score++;
            
            if (score % 10 === 0 && currentLevel < Object.keys(levels).length) {
                levelUp();
            }
        }
    });

    if (checkCollisions()) {
        gameOver();
    }
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    potato.draw(ctx);
    obstacles.forEach(obstacle => obstacle.draw(ctx));
    
    // Draw score and level
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`Level: ${currentLevel}`, 10, 60);
}

function levelUp() {
    currentLevel++;
    initializeObstacles();
    showMessage(`Level ${currentLevel}!`);
}

function showMessage(text) {
    ctx.fillStyle = 'black';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(text, canvas.width/2, canvas.height/2);
}

// Draw start screen
function drawStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'black';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Potato Game', canvas.width / 2, canvas.height / 3);
    
    ctx.font = '24px Arial';
    ctx.fillText(`High Score: ${highScore}`, canvas.width / 2, canvas.height / 2 - 50);
    
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(startButton.x, startButton.y, startButton.width, startButton.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText('Start Game', canvas.width / 2, startButton.y + 35);
}

function handleClick(event) {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    
    if (!gameStarted &&
        clickX >= startButton.x &&
        clickX <= startButton.x + startButton.width &&
        clickY >= startButton.y &&
        clickY <= startButton.y + startButton.height) {
        startGame();
    }
}

function startGame() {
    gameStarted = true;
    gameRunning = true;
    resetGame();
    gameLoop();
}

function gameOver() {
    gameRunning = false;
    gameStarted = false;
    
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
    
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

// Event listeners
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
