// classes/Potato.js
export class Potato {
    constructor(x, y) {
        this.reset(x, y);  // Call reset in constructor
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.width = 60;   // Size of potato
        this.height = 50;
        this.velocity = 0;
        this.gravity = 0.5;
        this.jumpStrength = -12;
    }

    update(canvasHeight) {
        // Apply gravity
        this.velocity += this.gravity;
        this.y += this.velocity;

        // Ground collision
        if (this.y + this.height/2 > canvasHeight) {
            this.y = canvasHeight - this.height/2;
            this.velocity = 0;
        }

        // Ceiling collision
        if (this.y - this.height/2 < 0) {
            this.y = this.height/2;
            this.velocity = 0;
        }
    }

    jump() {
        this.velocity = this.jumpStrength;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Draw potato body
        ctx.fillStyle = '#C4A484';  // Brown color for potato
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width/2, this.height/2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw eyes
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.ellipse(-10, -5, 5, 5, 0, 0, Math.PI * 2);
        ctx.ellipse(10, -5, 5, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw smile
        ctx.beginPath();
        ctx.arc(0, 5, 10, 0, Math.PI);
        ctx.stroke();

        ctx.restore();
    }
}
