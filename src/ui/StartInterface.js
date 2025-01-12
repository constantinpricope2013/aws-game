// src/ui/StartInterface.js

import { MainCharacterCustomization } from './CustomizeMainCharacterInterface.js';
import { HowToPlayInterface } from './HowToPlayInterface.js';

export class StartInterface {
    constructor(game) {
        this.game = game;
        this.canvas = this.game.renderer.canvas; // Use game's canvas
        this.ctx = this.game.renderer.ctx;       // Use game's context
        this.previewMainCharecter = null;
        this.addEventListeners();
        
        this.updateCanvasSize();
        this.setupButtons();
        this.render();
    }

    setupButtons() {
        const buttonWidth = 200 * this.canvas.width / 800;
        const buttonHeight = 50 * this.canvas.height / 600;
        const buttonX = this.canvas.width / 2 - buttonWidth / 2;
        const buttonSpacing = 20 * this.scale; // Space between buttons

        this.buttons = [
            {
                text: 'Start Game',
                x: buttonX,
                y: this.canvas.height / 2 - buttonHeight * 1.5 - buttonSpacing,
                width: buttonWidth,
                height: buttonHeight,
                action: () => this.startGame()
            },
            {
                text: 'Customize Player',
                x: buttonX,
                y: this.canvas.height / 2 - buttonHeight / 2,
                width: buttonWidth,
                height: buttonHeight,
                action: () => this.showCustomizePlayer()
            },
            {
                text: 'How to Play',
                x: buttonX,
                y: this.canvas.height / 2 + buttonHeight / 2 + buttonSpacing,
                width: buttonWidth,
                height: buttonHeight,
                action: () => this.showHowToPlay()
            }
        ];
    }

    showCustomizePlayer() {
        this.cleanup();
        this.game.currentInterface = new MainCharacterCustomization(this.game);
    }

    showHowToPlay() {
        this.cleanup();
        this.game.currentInterface = new HowToPlayInterface(this.game);
    }

    startGame() {
        this.cleanup();
        this.game.start();
    }

    updateCanvasSize() {
        // Make canvas responsive to window size
        const maxWidth = 800;
        const maxHeight = 600;
        const windowRatio = window.innerWidth / window.innerHeight;
        const gameRatio = maxWidth / maxHeight;

        if (windowRatio < gameRatio) {
            // Window is taller than game ratio
            this.canvas.width = Math.min(window.innerWidth * 0.95, maxWidth);
            this.canvas.height = this.canvas.width / gameRatio;
        } else {
            // Window is wider than game ratio
            this.canvas.height = Math.min(window.innerHeight * 0.95, maxHeight);
            this.canvas.width = this.canvas.height * gameRatio;
        }

        // Update scale factor for responsive elements
        this.scale = this.canvas.width / maxWidth;
    }

    render() {
        // Clear canvas
        console.log('Rendering Start Interface...');
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw title
        this.ctx.fillStyle = '#000000';
        this.ctx.font = `bold ${48 * this.scale}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Jumping Potato', this.canvas.width / 2, 120 * this.scale);

        // Draw preview character
        this.game.mainCharacter.x = 150;
        this.game.mainCharacter.y = 150
        this.game.mainCharacter.scale = 1;
        this.game.mainCharacter.render(this.ctx);

        // Draw buttons
        this.buttons.forEach(button => {
            // Button background
            this.ctx.fillStyle = '#4CAF50';
            this.ctx.fillRect(button.x, button.y, button.width, button.height);
            
            // Button text
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = `${24 * this.scale}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(
                button.text, 
                button.x + button.width / 2, 
                button.y + button.height / 2 + 8 * this.scale
            );
        });
    }

    

    addEventListeners() {
        // Handle window resize
        window.addEventListener('resize', () => {
            console.log('Resizing...');
            this.updateCanvasSize();
            this.setupButtons();
            this.render();
        });

        // Handle button clicks
        this.canvas.addEventListener('click', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            
            const x = (event.clientX - rect.left) * scaleX;
            const y = (event.clientY - rect.top) * scaleY;
            
            this.buttons.forEach(button => {
                if (this.isPointInButton(x, y, button)) {
                    button.action();
                }
            });
        });

        // Handle hover effects
        this.canvas.addEventListener('mousemove', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            
            const x = (event.clientX - rect.left) * scaleX;
            const y = (event.clientY - rect.top) * scaleY;
            
            this.canvas.style.cursor = 'default';
            this.buttons.forEach(button => {
                if (this.isPointInButton(x, y, button)) {
                    this.canvas.style.cursor = 'pointer';
                }
            });
        });

        // Add touch support
        this.canvas.addEventListener('touchstart', (event) => {
            event.preventDefault();
            const touch = event.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            
            const x = (touch.clientX - rect.left) * scaleX;
            const y = (touch.clientY - rect.top) * scaleY;
            
            this.buttons.forEach(button => {
                if (this.isPointInButton(x, y, button)) {
                    button.action();
                }
            });
        });
    }

    isPointInButton(x, y, button) {
        return x >= button.x && 
               x <= button.x + button.width && 
               y >= button.y && 
               y <= button.y + button.height;
    }

    cleanup() {
        window.removeEventListener('resize', this.handleResize);
        this.canvas.removeEventListener('click', this.handleResize);
        this.canvas.removeEventListener('mousemove', this.handleResize);
        this.canvas.removeEventListener('touchstart', this.handleResize);
    }
}
