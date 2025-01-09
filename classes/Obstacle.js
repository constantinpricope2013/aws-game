// classes/Obstacle.js
export class Obstacle {
    constructor(x, height, speed, canvasHeight) {  // Add canvasHeight parameter
        this.x = x;
        this.height = height;
        this.width = 50;
        this.speed = speed;
        this.y = canvasHeight - this.height; // Use passed canvasHeight instead of canvas.height
    }

    draw(ctx) {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.x -= this.speed;
    }
}