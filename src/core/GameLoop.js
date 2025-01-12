export class GameLoop {
    constructor() {
        this.lastTime = 0;
        this.accumulator = 0;
        this.deltaTime = 1/60; // Target: 60 FPS
        this.frameTime = 0;
        this.frames = 0;
        this.running = false;
        this.fps = 0;
        
        // Bind the game loop to maintain correct context
        this.loop = this.loop.bind(this);
    }

    start(updateCallback) {
        if (this.running) return;

        console.log("GameLoop started");
        
        this.running = true;
        this.updateCallback = updateCallback;
        this.lastTime = performance.now();
        this.accumulator = 0;
        this.frames = 0;
        this.frameTime = 0;
        
        // Start the game loop
        requestAnimationFrame(this.loop);
    }

    loop(currentTime) {
        if (!this.running) return;

        // Calculate time elapsed
        const elapsed = (currentTime - this.lastTime) / 1000; // Convert to seconds
        this.lastTime = currentTime;
        
        // Accumulate time for fixed-step updates
        this.accumulator += elapsed;
        
        // Update game state at fixed time steps
        while (this.accumulator >= this.deltaTime) {
            this.updateCallback(this.deltaTime);
            this.accumulator -= this.deltaTime;
        }

        // Calculate FPS
        this.frameTime += elapsed;
        this.frames++;
        
        if (this.frameTime >= 1.0) { // Every second
            this.fps = this.frames;
            this.frames = 0;
            this.frameTime -= 1.0;
        }

        // Continue the loop
        requestAnimationFrame(this.loop);
    }

    pause() {
        this.running = false;
    }

    resume() {
        if (!this.running) {
            this.running = true;
            this.lastTime = performance.now();
            requestAnimationFrame(this.loop);
        }
    }

    stop() {
        this.running = false;
        this.accumulator = 0;
        this.frames = 0;
        this.frameTime = 0;
    }

    isRunning() {
        return this.running;
    }

    getFPS() {
        return this.fps;
    }
}
