
// Similar to the StartInterface, the GameOverInterface is a simple interface that displays a message to the player. It also has a button that allows the player to restart the game.

 class GameOverInterface {
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
        const buttonX = (this.canvas.width - buttonWidth) / 2;
        const buttonY = (this.canvas.height - buttonHeight) / 2;

        this.buttons = [{
            text: 'Restart',
            x: buttonX,
            y: buttonY,
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

        // Handle button clicks
        this.handleMouseDown = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            this.buttons.forEach(button => {
                if (x >= button.x && x <= button.x + button.width &&
                    y >= button.y && y <= button.y + button.height) {
                    button.action();
                }
            });
        };

        this.canvas.addEventListener('mousedown', this.handleMouseDown);
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw background
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw title
        this.ctx.fillStyle = '#fff';
        this.ctx.font = `40px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over', this.canvas.width / 2, this.canvas.height / 2 - 50 * this.scale);

        // Draw buttons
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.font = `20px Arial`;
        this.buttons.forEach(button => {
            this.ctx.strokeRect(button.x, button.y, button.width, button.height);
            this.ctx.fillText(button.text, button.x + button.width / 2, button.y + button.height / 2 + 8);
        });
    }


    
    backToMain() {
        this.cleanup();
        this.game.currentInterface = new StartInterface(this.game);
    }