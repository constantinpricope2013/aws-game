
import { Entity } from '../entities/Entity.js';


// src/entities/Obstacle.js
export class Obstacle extends Entity {
    constructor(x, y, width, height, speed) {
        super(x, y, width, height);
        this.velocity.x = -speed; // Move left
        this.active = true;
    }

    update(deltaTime) {
        super.update(deltaTime);

        // Remove obstacle when it goes off screen
        if (this.x + this.width < 0) {
            this.active = false;
        }
    }

    render(context) {
        context.fillStyle = '#FF4444';
        context.fillRect(this.x, this.y, this.width, this.height);
        
        // Optional: Add some visual details
        context.strokeStyle = '#AA0000';
        context.lineWidth = 2;
        context.strokeRect(this.x, this.y, this.width, this.height);
    }
}
