
import { StartInterface } from './StartInterface.js';

// src/ui/HowToPlayInterface.js
export class HowToPlayInterface {
    constructor(game) {
        this.game = game;
        this.canvas = this.game.renderer.canvas; // Use game's canvas
        this.ctx = this.game.renderer.ctx;       // Use game's context
        this.setupCanvas();
        this.setupButtons();
        this.addEventListeners();
        this.render();
    }

    setupCanvas() {
        this.updateCanvasSize();
        document.body.appendChild(this.canvas);
        
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = '50%';
        this.canvas.style.top = '50%';
        this.canvas.style.transform = 'translate(-50%, -50%)';
        this.canvas.style.maxWidth = '100%';
        this.canvas.style.maxHeight = '100%';
    }

    updateCanvasSize() {
        const maxWidth = 800;
        const maxHeight = 600;
        const windowRatio = window.innerWidth / window.innerHeight;
        const gameRatio = maxWidth / maxHeight;

        if (windowRatio < gameRatio) {
            this.canvas.width = Math.min(window.innerWidth * 0.95, maxWidth);
            this.canvas.height = this.canvas.width / gameRatio;
        } else {
            this.canvas.height = Math.min(window.innerHeight * 0.95, maxHeight);
            this.canvas.width = this.canvas.height * gameRatio;
        }

        this.scale = this.canvas.width / maxWidth;
    }

    setupButtons() {
        const buttonWidth = 200 * this.scale;
        const buttonHeight = 50 * this.scale;
        const buttonX = this.canvas.width / 2 - buttonWidth / 2;

        this.buttons = [{
            text: 'Back',
            x: buttonX,
            y: this.canvas.height - (buttonHeight + 50 * this.scale),
            width: buttonWidth,
            height: buttonHeight,
            action: () => this.backToMain()
        }];
    }

    addEventListeners() {
        // Handle window resize
        this.handleResize = () => {
            this.updateCanvasSize();
            this.setupButtons();
            this.render();
        };
        window.addEventListener('resize', this.handleResize);

        // Handle clicks
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

    render() {
        console.log('Rendering HowToPlayInterface...');
        // Clear canvas
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw title
        this.ctx.fillStyle = '#000000';
        this.ctx.font = `bold ${36 * this.scale}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('How to Play', this.canvas.width / 2, 100 * this.scale);

        // Draw instructions
        this.ctx.font = `${24 * this.scale}px Arial`;
        const instructions = [
            'Press SPACE to jump',
            'Avoid obstacles',
            'Collect points',
            'Stay alive as long as possible!'
        ];

        instructions.forEach((text, index) => {
            this.ctx.fillText(
                text, 
                this.canvas.width / 2, 
                (200 + index * 40) * this.scale
            );
        });

        // Draw keyboard visual guide
        this.drawKeyboardGuide();

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

    drawKeyboardGuide() {
        const centerX = this.canvas.width / 2;
        const centerY = (400 * this.scale);
        const keyWidth = 80 * this.scale;
        const keyHeight = 40 * this.scale;

        // Draw space key
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 2 * this.scale;
        
        // Key background
        this.ctx.fillRect(centerX - keyWidth/2, centerY, keyWidth, keyHeight);
        this.ctx.strokeRect(centerX - keyWidth/2, centerY, keyWidth, keyHeight);
        
        // Key text
        this.ctx.fillStyle = '#000000';
        this.ctx.font = `${16 * this.scale}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('SPACE', centerX, centerY + keyHeight/2 + 6 * this.scale);
    }

    isPointInButton(x, y, button) {
        return x >= button.x && 
               x <= button.x + button.width && 
               y >= button.y && 
               y <= button.y + button.height;
    }
    
    backToMain() {
        this.cleanup();
        this.game.currentInterface = new StartInterface(this.game);
    }

    cleanup() {
        window.removeEventListener('resize', this.handleResize);
        this.canvas.removeEventListener('click', this.handleClick);
        this.canvas.removeEventListener('mousemove', this.handleMouseMove);
        this.canvas.removeEventListener('touchstart', this.handleTouchStart);
        
    }
}
