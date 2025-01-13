import { Entity } from './Entity.js';

export class MainCharacter extends Entity {
    constructor(x, y, customization, scale = 1) {
        super(x, y, 50 * scale, 50 * scale);
        this.gravity = 980;
        this.jumpForce = -400;
        this.isJumping = false;
        this.isDead = false;
        this.score = 0;
        this.scale = scale;

        
        // If customization is not provided, load from local storage
        if (!customization) {
            console.log('Loading customization from local storage');
            this.loadCustomization();
        }
        else {
            console.log('Using provided customization');
            this.customization = customization;
        }

        // If the loaded customization is null, use defaults
        if (!this.customization) {
        
            // Enhanced customization with defaults
            this.customization = {
                // Body
                bodyColor: '#B87333',
                bodySpots: true,
                bodySpotColor: '#8B4513',
                bodySpotCount: 5,
                
                // Eyes
                eyeColor: '#000000',
                eyeSize: 3,
                eyeStyle: 'normal', // normal, curious, angry, sleepy
                
                // Mouth
                mouthColor: '#000000',
                expression: 'happy', // happy, sad, neutral, surprised
                
                // Limbs
                hasArms: true,
                armColor: '#B87333',
                hasLegs: true,
                legColor: '#B87333',
                
                // Effects
                jumpEffect: 'spring', // spring, flip, bounce
                deathEffect: 'cross', // cross, spiral, fade
                
            };
        }
        
        // Store spot positions
        this.spots = [];
        this.generateSpots();

        this.animationFrame = 0;
        this.animationSpeed = 0.1;
    }

    
    generateSpots() {
        this.spots = [];
        const s = this.scale;
        
        for (let i = 0; i < this.customization.bodySpotCount; i++) {
            this.spots.push({
                x: -20 * s + Math.random() * 40 * s,
                y: -15 * s + Math.random() * 30 * s
            });
        }
    }

    render(context) {
        if (this.isDead) {
            this.drawDeadCharacter(context);
        } else {
            this.drawCharacter(context);
        }
    }

    drawCharacter(context) {
        const s = this.scale;
        const x = this.x + this.width/2;
        const y = this.y + this.height/2;

        // Draw shadow
        this.drawShadow(context, x, y);
        
        // Draw body
        this.drawBody(context, x, y);
        
        // Draw limbs
        if (this.customization.hasLegs) {
            this.drawLegs(context, x, y);
        }
        
        if (this.customization.hasArms) {
            this.drawArms(context, x, y);
        }
        
        // Draw face features
        this.drawEyes(context, x, y);
        this.drawMouth(context, x, y);
        
        // Draw jump effect if jumping
        if (this.isJumping) {
            this.drawJumpEffect(context, x, y);
        }
    }

    drawShadow(context, x, y) {
        const s = this.scale;
        context.fillStyle = 'rgba(0, 0, 0, 0.2)';
        context.beginPath();
        context.ellipse(x, y + 25 * s, this.width/2, this.height/8, 0, 0, Math.PI * 2);
        context.fill();
    }

    drawBody(context, x, y) {
        const s = this.scale;
        
        // Main body
        context.fillStyle = this.customization.bodyColor;
        context.beginPath();
        context.ellipse(x, y, this.width*this.scale/2, this.height*this.scale/2, 0, 0, Math.PI * 2);
        context.fill();

        // Body spots - use stored positions
        if (this.customization.bodySpots) {
            context.fillStyle = this.customization.bodySpotColor;
            this.spots.forEach(spot => {
                context.beginPath();
                context.arc(x + spot.x, y + spot.y, 5 * s, 0, Math.PI * 2);
                context.fill();
            });
        }
    }

    drawEyes(context, x, y) {
        const s = this.scale;
        context.fillStyle = this.customization.eyeColor;
        
        switch(this.customization.eyeStyle) {
            case 'curious':
                // Larger, rounder eyes
                this.drawEyePair(context, x, y, s * 4, true);
                break;
            case 'angry':
                // Angled eyes with eyebrows
                this.drawAngryEyes(context, x, y, s);
                break;
            case 'sleepy':
                // Half-closed eyes
                this.drawSleepyEyes(context, x, y, s);
                break;
            default:
                // Normal eyes
                this.drawEyePair(context, x, y, s * this.customization.eyeSize);
        }
    }

    drawEyePair(context, x, y, size, withHighlight = false) {
        const s = this.scale;
        // Left eye
        context.beginPath();
        context.arc(x - 10 * s, y - 5 * s, size, 0, Math.PI * 2);
        context.fill();
        
        // Right eye
        context.beginPath();
        context.arc(x + 10 * s, y - 5 * s, size, 0, Math.PI * 2);
        context.fill();

        if (withHighlight) {
            context.fillStyle = '#FFFFFF';
            context.beginPath();
            context.arc(x - 11 * s, y - 6 * s, size/3, 0, Math.PI * 2);
            context.arc(x + 9 * s, y - 6 * s, size/3, 0, Math.PI * 2);
            context.fill();
        }
    }

    drawAngryEyes(context, x, y, s) {
        // Left eye
        context.beginPath();
        context.moveTo(x - 10 * s, y - 10 * s);
        context.lineTo(x - 5 * s, y - 5 * s);
        context.stroke();

        // Right eye
        context.beginPath();
        context.moveTo(x + 10 * s, y - 10 * s);
        context.lineTo(x + 5 * s, y - 5 * s);
        context.stroke();
    }

    drawSleepyEyes(context, x, y, s) {
        // Left eye
        context.beginPath();
        context.moveTo(x - 10 * s, y - 5 * s);
        context.lineTo(x - 10 * s, y + 5 * s);
        context.stroke();

        // Right eye
        context.beginPath();
        context.moveTo(x + 10 * s, y - 5 * s);
        context.lineTo(x + 10 * s, y + 5 * s);
        context.stroke();
    }

    drawDeadCharacter(context) {
        const s = this.scale;
        const x = this.x + this.width/2;
        const y = this.y + this.height/2;

        // Draw shadow
        this.drawShadow(context, x, y);

        // Draw body
        this.drawBody(context, x, y);

        // Draw limbs
        if (this.customization.hasLegs) {
            this.drawLegs(context, x, y);
        }

        if (this.customization.hasArms) {
            this.drawArms(context, x, y);
        }

        // Draw face features
        this.drawEyes(context, x, y);
        this.drawMouth(context, x, y);

        // Draw death effect
        this.drawDeathEffect(context, x, y);
    }

    drawDeathEffect(context, x, y) {
        const s = this.scale;
        context.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        context.lineWidth = 2 * s;

        switch(this.customization.deathEffect) {
            case 'cross':
                context.beginPath();
                context.moveTo(x - 10 * s, y - 10 * s);
                context.lineTo(x + 10 * s, y + 10 * s);
                context.moveTo(x + 10 * s, y - 10 * s);
                context.lineTo(x - 10 * s, y + 10 * s);
                context.stroke();
                break;
            case 'spiral':
                context.beginPath();
                for (let i = 0; i < 36; i++) {
                    const angle = i * Math.PI / 18;
                    const radius = 10 * s * (1 - i / 36);
                    const startX = x + radius * Math.cos(angle);
                    const startY = y + radius * Math.sin(angle);
                    const endX = x + radius * Math.cos(angle + Math.PI / 18);
                    const endY = y + radius * Math.sin(angle + Math.PI / 18);
                    context.moveTo(startX, startY);
                    context.lineTo(endX, endY);
                }
                context.stroke();
                break;
            case 'fade':
                context.fillStyle = 'rgba(0, 0, 0, 0.5)';
                context.fillRect(x - 25 * s, y - 25 * s, 50 * s, 50 * s);
                break;
        }
    }


    drawMouth(context, x, y) {
        const s = this.scale;
        context.strokeStyle = this.customization.mouthColor;
        context.lineWidth = 2 * s;

        switch(this.customization.expression) {
            case 'happy':
                context.beginPath();
                context.arc(x, y + 5 * s, 8 * s, 0, Math.PI);
                context.stroke();
                break;
            case 'sad':
                context.beginPath();
                context.arc(x, y + 10 * s, 8 * s, Math.PI, 0);
                context.stroke();
                break;
            case 'surprised':
                context.beginPath();
                context.arc(x, y + 8 * s, 5 * s, 0, Math.PI * 2);
                context.stroke();
                break;
            case 'neutral':
                context.beginPath();
                context.moveTo(x - 8 * s, y + 8 * s);
                context.lineTo(x + 8 * s, y + 8 * s);
                context.stroke();
                break;
        }
    }

    drawLegs(context, x, y) {
        const s = this.scale;
        context.strokeStyle = this.customization.legColor;
        context.lineWidth = 3 * s;
        
        // Left leg
        context.beginPath();
        context.moveTo(x - 10 * s, y + 20 * s);
        context.lineTo(x - 15 * s, y + 35 * s);
        context.stroke();
        
        // Right leg
        context.beginPath();
        context.moveTo(x + 10 * s, y + 20 * s);
        context.lineTo(x + 15 * s, y + 35 * s);
        context.stroke();
    }

    drawArms(context, x, y) {
        const s = this.scale;
        context.strokeStyle = this.customization.armColor;
        context.lineWidth = 3 * s;
        
        // Left arm
        context.beginPath();
        context.moveTo(x - 20 * s, y);
        context.lineTo(x - 30 * s, y + 10 * s);
        context.stroke();
        
        // Right arm
        context.beginPath();
        context.moveTo(x + 20 * s, y);
        context.lineTo(x + 30 * s, y + 10 * s);
        context.stroke();
    }

    drawJumpEffect(context, x, y) {
        const s = this.scale;
        context.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        context.lineWidth = 2 * s;

        switch(this.customization.jumpEffect) {
            case 'spring':
                this.drawSpringEffect(context, x, y);
                break;
            case 'flip':
                this.drawFlipEffect(context, x, y);
                break;
            case 'bounce':
                this.drawBounceEffect(context, x, y);
                break;
        }
    }

    // Add static method to get all customization options
    static getCustomizationOptions() {
        return {
            colors: [
                '#B87333', // Copper
                '#CD7F32', // Bronze
                '#DAA520', // Golden Rod
                '#8B4513', // Saddle Brown
                '#654321', // Dark Brown
                '#D2691E'  // Chocolate
            ],
            eyeStyles: ['normal', 'curious', 'angry', 'sleepy'],
            expressions: ['happy', 'sad', 'neutral', 'surprised'],
            jumpEffects: ['spring', 'flip', 'bounce'],
            deathEffects: ['cross', 'spiral', 'fade']
        };
    }

    // Save to local storage
    saveCustomization() {
        localStorage.setItem('mainCharacterCustomization', JSON.stringify(this.customization));
    }

    // Load from local storage
    loadCustomization() {
        this.customization = JSON.parse(localStorage.getItem('mainCharacterCustomization'));
    }

    jump() {
        if (!this.isJumping) {
            this.velocityY = this.jumpForce;
            this.isJumping = true;
        }
    }

    isColliding(other) {
        return this.x < other.x + other.width &&
               this.x + this.width > other.x &&
               this.y < other.y + other.height &&
               this.y + this.height > other.y;
    }

    update (deltaTime) {
        super.update(deltaTime);

        // Update animation frame
        this.animationFrame += this.animationSpeed * deltaTime;
        if (this.animationFrame >= 1) {
            this.animationFrame = 0;
        }

        // Update score
        if (!this.isDead) {
            this.score += 1;
        }

        // Apply gravity
        this.velocityY += this.gravity * deltaTime;

        // Update position
        this.y += this.velocityY * deltaTime;

        // Check if character is on the ground
        if (this.y >= 400 * this.scale) {
            this.y = 400 * this.scale;
            this.isJumping = false;
        }

        // this.render();
    }
}
