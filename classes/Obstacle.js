export class Obstacle {
    constructor(canvasWidth, canvasHeight) {
        this.width = 30;
        this.height = 50;
        this.x = canvasWidth;
        this.y = canvasHeight - this.height;
        this.speed = 4;
    }

    draw(ctx) {
        ctx.fillStyle = 'brown';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.x -= this.speed;
    }
}