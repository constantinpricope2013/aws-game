
// src/core/Game.js
import { GameState } from './GameState.js';
import { GameLoop } from './GameLoop.js';
import { Renderer } from '../rendering/Renderer.js';
import { InputManager } from '../managers/InputManager.js';
import { CollisionManager } from '../managers/CollisionManager.js';
import { LevelManager } from '../managers/LevelManager.js';
import { Obstacle } from '../entities/Obstacle.js';
import { StartInterface } from '../ui/StartInterface.js';

export class Game {
    constructor() {

        // Create canvas first
        this.state = new GameState();
        this.loop = new GameLoop();
        this.renderer = new Renderer(this);
        this.inputManager = new InputManager();
        this.collisionManager = new CollisionManager();
        this.levelManager = new LevelManager();
        this.currentInterface = null;
        
        // Initialize game state
        this.isPlaying = false;
        this.obstacles = [];
        this.obstacleSpawnTimer = 0;
        this.obstacleSpawnInterval = 2; // seconds
        
        // Create main character only once
        this.mainCharacter = this.state.createMainCharacter();
        
        // Obstacle spawning configuration
        this.minSpawnInterval = 1.5;  // Minimum time between obstacles
        this.maxSpawnInterval = 3.0;  // Maximum time between obstacles
        this.lastSpawnTime = 0;
        this.nextSpawnInterval = this.getRandomSpawnInterval();
        this.gameSpeed = 1.0;  // Initial game speed
        this.speedIncreaseFactor = 1.1; // Speed increase over time
        this.speedIncreaseInterval = 10; // Seconds between speed increases
        this.timeSinceSpeedIncrease = 0;

        // Start with menu
        this.showMenuInterface();
    }

    

    getRandomSpawnInterval() {
        // Get random time between min and max spawn intervals
        return this.minSpawnInterval + 
               Math.random() * (this.maxSpawnInterval - this.minSpawnInterval);
    }


    showMenuInterface() {
        this.cleanup(); // Clean up any existing interface
        this.currentInterface = new StartInterface(this);
    }


    savePotatoCustomization(customization) {
        this.potatoCustomization = customization;
        localStorage.setItem('potatoCustomization', JSON.stringify(customization));
    }

    
    calculateScale() {
        const baseWidth = 800; // Your base game width
        const currentWidth = window.innerWidth;
        return Math.min(1, currentWidth / baseWidth);
    }

    start() {
        try {
            // Cleanup any existing interface
            this.cleanup();

            // Set game to playing state
            this.isPlaying = true;

            // Initialize game components
            console.log('Starting game...');
            this.renderer.init();
            this.inputManager.init();
            this.levelManager.loadInitialLevel();

            // Clear obstacles array
            this.obstacles = [];

            // Start the game loop
            this.loop.start((deltaTime) => {
                this.update(deltaTime);

            });

            // Add resize handler
            this.handleResize = () => {
                const newScale = this.calculateScale();
                this.potato.updateScale(newScale);
                // Update other game elements as needed
            };
            window.addEventListener('resize', this.handleResize);

            // Add keyboard controls
            document.addEventListener('keydown', (e) => {
                if (e.code === 'Space') {
                    this.mainCharacter.jump();
                }
            });

        } catch (error) {
            console.error('Failed to start game:', error);
            this.cleanup();
        }
    }

    cleanup() {
        if (this.currentInterface) {
            this.currentInterface.cleanup();
            this.currentInterface = null;
        }
        
        if (this.loop.isRunning()) {
            this.inputManager.cleanup();
            this.loop.stop();
            this.renderer.cleanup();
            this.state.cleanup();
            this.collisionManager.cleanup();
            window.removeEventListener('resize', this.handleResize);
        }

        this.isPlaying = false;
        this.obstacles = [];
        this.obstacleSpawnTimer = 0;
    }

    update(deltaTime) {
        // Clear the canvas
        this.renderer.clear();

        // Update main character
        console.log('Updating game state... obstacle count:', this.obstacles.length);

        if (!this.isPlaying) {
            return;
        }


        // Spawn new obstacles periodically
        if (this.renderer.shouldSpawnObstacle()) {
            this.renderer.spawnObstacle();
        }


        // Update obstacles
        this.obstacles = this.obstacles.filter(obstacle => obstacle.active);
        this.obstacles.forEach(obstacle => {
            obstacle.update(deltaTime);         
            
            // Check for collision
            if (this.collisionManager.checkCollisions(this.mainCharacter, obstacle)) {
                this.mainCharacter.isDead = true;
                // Handle game over
                this.gameOver();
            }
        });

        
        // Update game state
        this.inputManager.update();
        this.state.update(deltaTime);
        this.collisionManager.checkCollisions(this.state.getEntities());
    }

    gameOver() {
        // Stop the game loop
        this.loop.stop();

        // Show game over screen
        this.showGameOverScreen();
    }

    showGameOverScreen() {
        this.cleanup(); // Clean up game components
        this.currentInterface = new GameOverInterface(this);
    }


}
