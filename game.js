import { Potato } from './classes/Potato.js';
import { Obstacle } from './classes/Obstacle.js';

// Initialize canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game state variables
let gameRunning = false;
let currentLevel = 1;
let score = 0;
let obstacles = [];
let gameStarted = false;

// User management
let username = localStorage.getItem('username');
const highScores = JSON.parse(localStorage.getItem('highScores')) || {};

// Create potato instance
const potato = new Potato(100, canvas.height / 2);

// Button configurations
const startButton = {
    x: canvas.width / 2 - 100,
    y: canvas.height / 2,
    width: 200,
    height: 50
};

const changeUsernameButton = {
    x: 10,
    y: 10,
    width: 150,
    height: 30
};

// Level configurations
const levels = {
    1: { obstacleCount: 3, speed: 5, gap: 300 },
    2: { obstacleCount: 4, speed: 6, gap: 250 },
    3: { obstacleCount: 5, speed: 7, gap: 200 }
};

// Core game functions
function initializeObstacles() {
    obstacles = [];
    const level = levels[currentLevel];
    
    for (let i = 0; i < level.obstacleCount; i++) {
        const x = canvas.width + (i * level.gap);
        const height = Math.random() * (canvas.height / 2) + 100;
        obstacles.push(new Obstacle(x, height, level.speed, canvas.height));
    }
}

function resetGame() {
    score = 0;
    currentLevel = 1;
    gameRunning = true;
    potato.x = 100;  // Instead of using reset, directly set properties
    potato.y = canvas.height / 2;
    potato.velocity = 0;
    initializeObstacles();
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
    
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Player: ${username}`, 10, 30);
    ctx.fillText(`Score: ${score}`, 10, 60);
    ctx.fillText(`Level: ${currentLevel}`, 10, 90);
}

// UI functions
function promptForUsername() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
        z-index: 1000;
        text-align: center;
    `;

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter your username';
    input.style.cssText = `
        display: block;
        margin: 10px auto;
        padding: 5px;
        width: 200px;
    `;

    const button = document.createElement('button');
    button.textContent = 'Start';
    button.style.cssText = `
        padding: 5px 20px;
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    `;

    modal.appendChild(document.createTextNode('Enter Your Username'));
    modal.appendChild(input);
    modal.appendChild(button);

    document.body.appendChild(modal);

    return new Promise((resolve) => {
        button.onclick = () => {
            if (input.value.trim()) {
                username = input.value.trim();
                localStorage.setItem('username', username);
                document.body.removeChild(modal);
                resolve(username);
            } else {
                alert('Please enter a username');
            }
        };
    });
}

function drawStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'black';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Potato Game', canvas.width / 2, canvas.height / 3);
    
    if (username) {
        ctx.font = '24px Arial';
        ctx.fillText(`Player: ${username}`, canvas.width / 2, canvas.height / 3 + 50);
    }
    
    // Draw high scores
    let yPos = canvas.height / 3 + 100;
    ctx.fillText('Top Scores:', canvas.width / 2, yPos);
    
    const sortedScores = Object.entries(highScores)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);
    
    sortedScores.forEach(([name, score], index) => {
        yPos += 30;
        ctx.fillText(`${name}: ${score}`, canvas.width / 2, yPos);
    });
    
    // Draw buttons
    drawStartButton();
    drawChangeUsernameButton();
}

function drawStartButton() {
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(startButton.x, startButton.y, startButton.width, startButton.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Start Game', canvas.width / 2, startButton.y + 35);
}

function drawChangeUsernameButton() {
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(changeUsernameButton.x, changeUsernameButton.y, 
                changeUsernameButton.width, changeUsernameButton.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Change Username', 
                changeUsernameButton.x + changeUsernameButton.width/2, 
                changeUsernameButton.y + 20);
}

async function startGame() {
    if (!username) {
        await promptForUsername();
    }
    gameStarted = true;
    gameRunning = true;
    resetGame();
    gameLoop();
}

function gameOver() {
    gameRunning = false;
    gameStarted = false;
    
    if (!highScores[username] || score > highScores[username]) {
        highScores[username] = score;
        localStorage.setItem('highScores', JSON.stringify(highScores));
    }
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width/2, canvas.height/2 - 90);
    ctx.fillText(`Player: ${username}`, canvas.width/2, canvas.height/2 - 30);
    ctx.fillText(`Score: ${score}`, canvas.width/2, canvas.height/2 + 30);
    ctx.fillText(`Personal Best: ${highScores[username]}`, canvas.width/2, canvas.height/2 + 90);
    ctx.font = '24px Arial';
    ctx.fillText('Press Space to play again', canvas.width/2, canvas.height/2 + 150);
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

// Event handlers
function handleClick(event) {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    
    if (!gameStarted) {
        if (clickX >= startButton.x &&
            clickX <= startButton.x + startButton.width &&
            clickY >= startButton.y &&
            clickY <= startButton.y + startButton.height) {
            startGame();
        }
        
        if (clickX >= changeUsernameButton.x &&
            clickX <= changeUsernameButton.x + changeUsernameButton.width &&
            clickY >= changeUsernameButton.y &&
            clickY <= changeUsernameButton.y + changeUsernameButton.height) {
            localStorage.removeItem('username');
            username = null;
            startGame();
        }
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

// Initialize game
drawStartScreen();
