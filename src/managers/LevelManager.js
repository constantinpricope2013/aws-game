// src/managers/LevelManager.js
export class LevelManager {
    #levels = {
        1: { obstacleCount: 3, speed: 5, gap: 300 },
        2: { obstacleCount: 4, speed: 6, gap: 250 },
        3: { obstacleCount: 5, speed: 7, gap: 200 }
    };

    constructor() {
        this.currentLevel = 1;
    }

    getCurrentLevel() {
        return {
            level: this.currentLevel,
            ...this.#levels[this.currentLevel]
        };
    }

    progressToNextLevel() {
        const nextLevel = this.currentLevel + 1;
        if (this.#levels[nextLevel]) {
            this.currentLevel = nextLevel;
            return true;
        }
        return false;
    }

    loadInitialLevel() {
        this.currentLevel = 1;
    }
}
