// src/rendering/Renderer.js

import { Obstacle } from '../entities/Obstacle.js';

export class Renderer {
    constructor(game) {
        this.game = game;
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.minObstacleSpawnInterval = 2000;
        this.spawnIntervalVariance = 1000;
        const currentTime = performance.now();
        this.lastObstacleSpawnTime = currentTime;
        this.setupCanvas();
        this.addEventListeners();
    }

    init() {
        this.setupCanvas()
    }

    setupCanvas() {
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        // Set base dimensions
        this.baseWidth = 800;  // Base game width
        this.baseHeight = 600; // Base game height
        
        // Add canvas to document
        document.body.appendChild(this.canvas);
        
        // Add basic styles
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = '50%';
        this.canvas.style.top = '50%';
        this.canvas.style.transform = 'translate(-50%, -50%)';
        
        // Initial resize
        this.resizeCanvas();
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    render(entities) {
        this.clear();
        entities.forEach(entity => {
            if (entity.render) {
                entity.render(this.ctx);
            }
        });
    }

    resizeCanvas() {
        // Get window dimensions
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // Calculate game dimensions while maintaining aspect ratio
        const windowRatio = windowWidth / windowHeight;
        const gameRatio = this.baseWidth / this.baseHeight;
        
        let width, height;
        
        if (windowRatio > gameRatio) {
            // Window is wider than game ratio
            height = Math.min(windowHeight * 0.95, this.baseHeight);
            width = height * gameRatio;
        } else {
            // Window is taller than game ratio
            width = Math.min(windowWidth * 0.95, this.baseWidth);
            height = width / gameRatio;
        }

        // Set canvas size
        this.canvas.width = this.baseWidth;  // Internal resolution
        this.canvas.height = this.baseHeight;
        
        // Set display size
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;

        // Calculate scale factor for input handling
        this.scale = {
            x: this.canvas.width / width,
            y: this.canvas.height / height
        };

        // Add CSS to ensure crisp pixels
        this.canvas.style.imageRendering = 'pixelated';
        this.ctx.imageSmoothingEnabled = false;
    }

    handleResize() {
        this.resizeCanvas();
        
        // Update scale for current interface if exists
        if (this.currentInterface && this.currentInterface.handleResize) {
            this.currentInterface.handleResize();
        }
    }

    calculateScale() {
        const baseWidth = 800;
        const currentWidth = window.innerWidth;
        return Math.min(1, currentWidth / baseWidth);
    }

    addEventListeners() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            if (this.currentInterface) {
                this.currentInterface.render();
            }
        });

        // Handle input events with proper scaling
        this.canvas.addEventListener('click', (event) => {
            if (this.currentInterface && this.currentInterface.handleClick) {
                const rect = this.canvas.getBoundingClientRect();
                const x = (event.clientX - rect.left) * this.scale.x;
                const y = (event.clientY - rect.top) * this.scale.y;
                this.currentInterface.handleClick(x, y);
            }
        });

        // Add hover handling for buttons
        this.canvas.addEventListener('mousemove', (event) => {
            if (this.currentInterface && this.currentInterface.handleMouseMove) {
                const rect = this.canvas.getBoundingClientRect();
                const x = (event.clientX - rect.left) * this.scale.x;
                const y = (event.clientY - rect.top) * this.scale.y;
                this.currentInterface.handleMouseMove(x, y);
            }
        });
    }

    drawCharacterShadow(ctx, character) {
        const shadowOffset = 5;
        const shadowBlur = 10;
        
        ctx.beginPath();
        ctx.ellipse(
            0,
            shadowOffset,
            character.width * 0.4,
            character.height * 0.2,
            0,
            0,
            Math.PI * 2
        );
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fill();
    }

    drawCharacterBody(ctx, character) {
        // Main Character body shape using bezier curves for organic look
        ctx.beginPath();
        ctx.moveTo(-character.width/2, 0);
        
        // Top curve
        ctx.bezierCurveTo(
            -character.width/2, -character.height/3,
            -character.width/4, -character.height/2,
            0, -character.height/2
        );
        
        // Right curve
        ctx.bezierCurveTo(
            character.width/4, -character.height/2,
            character.width/2, -character.height/3,
            character.width/2, 0
        );
        
        // Bottom curve
        ctx.bezierCurveTo(
            character.width/2, character.height/3,
            character.width/4, character.height/2,
            0, character.height/2
        );
        
        // Left curve
        ctx.bezierCurveTo(
            -character.width/4, character.height/2,
            -character.width/2, character.height/3,
            -character.width/2, 0
        );

        // Fill with character color and add shading
        const gradient = ctx.createRadialGradient(
            -character.width/4, -character.height/4, 0,
            0, 0, character.width
        );
        gradient.addColorStop(0, character.color);
        gradient.addColorStop(1, this.adjustColor(character.color, -20));
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Add subtle stroke for definition
        ctx.strokeStyle = this.adjustColor(character.color, -40);
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    drawCharacterFeatures(ctx, character) {
        // Eyes
        const eyeOffset = character.width * 0.15;
        const eyeY = -character.height * 0.1;
        
        // Left eye
        this.drawEye(ctx, -eyeOffset, eyeY, character);
        // Right eye
        this.drawEye(ctx, eyeOffset, eyeY, character);
        
        // Expression (changes based on character state)
        this.drawExpression(ctx, character);
        
        // Draw accessories if character has them
        if (character.hasHat) {
            this.drawHat(ctx, character);
        }
        if (character.hasMustache) {
            this.drawMustache(ctx, character);
        }
    }

    drawEye(ctx, x, y, character) {
        // White of the eye
        ctx.beginPath();
        ctx.fillStyle = '#FFFFFF';
        ctx.arc(x, y, character.width * 0.1, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupil
        ctx.beginPath();
        ctx.fillStyle = '#000000';
        ctx.arc(
            x + character.width * 0.02,
            y,
            character.width * 0.05,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // Eye shine
        ctx.beginPath();
        ctx.fillStyle = '#FFFFFF';
        ctx.arc(
            x + character.width * 0.03,
            y - character.width * 0.02,
            character.width * 0.02,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }

    drawExpression(ctx, character) {
        // Change expression based on character state
        if (character.isJumping) {
            // Excited expression
            this.drawExcitedExpression(ctx, character);
        } else if (character.isMoving) {
            // Happy expression
            this.drawHappyExpression(ctx, character);
        } else {
            // Normal expression
            this.drawNormalExpression(ctx, character);
        }
    }

    drawNormalExpression(ctx, character) {
        // Simple smile
        ctx.beginPath();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.arc(
            0,
            character.height * 0.1,
            character.width * 0.2,
            0.1 * Math.PI,
            0.9 * Math.PI,
            false
        );
        ctx.stroke();
    }

    drawHappyExpression(ctx, character) {
        // Wider smile
        ctx.beginPath();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.arc(
            0,
            character.height * 0.1,
            character.width * 0.25,
            0,
            Math.PI,
            false
        );
        ctx.stroke();
    }

    drawExcitedExpression(ctx, character) {
        // Open mouth smile
        ctx.beginPath();
        ctx.fillStyle = '#FF9999';
        ctx.ellipse(
            0,
            character.height * 0.1,
            character.width * 0.15,
            character.height * 0.1,
            0,
            0,
            Math.PI * 2
        );
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    drawCharacterEffects(ctx, character) {
        if (character.isJumping) {
            this.drawJumpEffect(ctx, character);
        }
        if (character.isMoving) {
            this.drawMovementEffect(ctx, character);
        }
    }

    drawJumpEffect(ctx, character) {
        // Add motion lines or particles for jump effect
        const particleCount = 5;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI / particleCount) * i;
            const length = character.height * 0.3;
            
            ctx.beginPath();
            ctx.moveTo(
                Math.cos(angle) * character.width * 0.5,
                Math.sin(angle) * character.height * 0.5 + character.height * 0.3
            );
            ctx.lineTo(
                Math.cos(angle) * (character.width * 0.5 + length),
                Math.sin(angle) * (character.height * 0.5 + length) + character.height * 0.3
            );
            ctx.stroke();
        }
    }

    drawMovementEffect(ctx, character) {
        // Add motion blur or speed lines
        const lineCount = 3;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        
        for (let i = 0; i < lineCount; i++) {
            const offset = (i - 1) * character.width * 0.2;
            ctx.beginPath();
            ctx.moveTo(-character.width * 0.6 + offset, -character.height * 0.2);
            ctx.lineTo(-character.width * 0.8 + offset, character.height * 0.2);
            ctx.stroke();
        }
    }

    adjustColor(color, amount) {
        // Helper function to darken/lighten colors
        const hex = color.replace('#', '');
        const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
        const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
        const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    // shouldSpawnObstacle() {
    //     console.log('Checking if obstacle should be spawned...');
    //     const currentTime = performance.now();
    //     const timeSinceLastSpawn = currentTime - this.lastObstacleSpawnTime;
        
    //     // Get minimum spawn interval based on current level
    //     const baseInterval = Math.max(
    //         this.minObstacleSpawnInterval - (this.game.state.level * 200), // Decrease interval as level increases
    //         1000 // Minimum 1 second between spawns
    //     );

    //     // Add random variance to spawn timing
    //     const randomVariance = Math.random() * this.spawnIntervalVariance;
    //     const spawnInterval = baseInterval + randomVariance;

    //     // Check if enough time has passed
    //     if (timeSinceLastSpawn >= spawnInterval) {
    //         this.lastObstacleSpawnTime = currentTime;
    //         return true;
    //     }

    //     return false;
    // }

    shouldSpawnObstacle(deltaTime) {
        // Update spawn timer
        this.lastSpawnTime += deltaTime;

        // Check if it's time to spawn
        if (this.lastSpawnTime >= this.nextSpawnInterval) {
            this.lastSpawnTime = 0;
            this.nextSpawnInterval = this.getRandomSpawnInterval();
            return true;
        }

        return false;
    }

    spawnObstacle() {
        // Get the last obstacle's position
        const lastObstacle = this.game.obstacles[this.obstacles.length - 1];
        
        // Only spawn if there's enough space
        if (!lastObstacle || 
            lastObstacle.x < this.renderer.canvas.width - 300) {
            
            const obstacle = new Obstacle(
                this.renderer.canvas.width,
                this.renderer.canvas.height - 100,
                50,
                50,
                200 * this.gameSpeed // Initial speed affected by game speed
            );
            
            this.games.obstacles.push(obstacle);
            console.log('Obstacle spawned with speed:', obstacle.speed);
        }
    }


    getRandomSpawnInterval() {
        // Get random time between min and max spawn intervals
        return this.minSpawnInterval + 
               Math.random() * (this.maxSpawnInterval - this.minSpawnInterval);
    }


    // spawnObstacle() {
    //     console.log('Spawning obstacle...');
    //     const height = Math.random() * 150 + 100; // Random height between 100-250
    //     const obstacle = new Obstacle(
    //         800, // Start from right side of screen
    //         600 - height, // Position from bottom
    //         50, // width
    //         height,
    //         200 // speed
    //     );
    //     this.game.obstacles.push(obstacle);
    // }

    cleanup() {
        // Clear all obstacles
        // this.obstacles = [];
    }

}
