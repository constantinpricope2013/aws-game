
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
        this.renderer = new Renderer();
        this.inputManager = new InputManager();
        this.collisionManager = new CollisionManager();
        this.levelManager = new LevelManager();
        this.currentInterface = null;
        this.mainCharacter = this.state.createMainCharacter();
        this.showMenuInterface();
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

            // Initialize game components
            console.log('Starting game...');
            this.renderer.init();
            this.inputManager.init();
            this.levelManager.loadInitialLevel();

            // Create game objects with current customization
            this.obstacles = [];

            // Start the game loop
            this.loop.start((deltaTime) => {
                this.update(deltaTime);
                this.renderer.render(this.state.getEntities());
            });

            // Add resize handler
            this.handleResize = () => {
                const newScale = this.calculateScale();
                this.potato.updateScale(newScale);
                // Update other game elements as needed
            };
            window.addEventListener('resize', this.handleResize);

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
    }

    update(deltaTime) {
        // Update potato
        this.mainCharacter.update(deltaTime);

        // Update obstacles
        this.obstacles = this.obstacles.filter(obstacle => obstacle.active);
        this.obstacles.forEach(obstacle => {
            obstacle.update(deltaTime);
            
            // Check for collision
            if (this.checkCollision(this.potato, obstacle)) {
                this.potato.die();
                // Handle game over
            }
        });

        // Spawn new obstacles periodically
        if (this.renderer.shouldSpawnObstacle()) {
            this.renderer.spawnObstacle();
        }

        
        // Update game state
        this.inputManager.update();
        this.state.update(deltaTime);
        this.collisionManager.checkCollisions(this.state.getEntities());
    }

}
