export class Obstacle {
    constructor(x, height, speed) {
        this.x = x;
        this.height = height;
        this.width = 50;
        this.speed = speed;
        this.y = canvas.height - this.height; // Position from bottom
    }

    draw(ctx) {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.x -= this.speed;
    }
}