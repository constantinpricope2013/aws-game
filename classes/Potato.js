export class Potato {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 50;
        this.speed = 5;
        this.jumpForce = 0;
        this.gravity = 0.5;
        this.isJumping = false;
        this.score = 0;
    }

    draw(ctx) {
        ctx.fillStyle = '#brown';
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.size, this.size * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
        // Add eyes and smile
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.x - 10, this.y - 10, 5, 0, Math.PI * 2);
        ctx.arc(this.x + 10, this.y - 10, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x, this.y + 5, 20, 0, Math.PI);
        ctx.stroke();
    }

    update(canvasHeight) {
        if (this.isJumping) {
            this.y -= this.jumpForce;
            this.jumpForce -= this.gravity;
        }

        if (this.y > canvasHeight - this.size) {
            this.y = canvasHeight - this.size;
            this.isJumping = false;
        }
    }

    jump() {
        if (!this.isJumping) {
            this.jumpForce = 15;
            this.isJumping = true;
        }
    }
}
