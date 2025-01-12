// src/core/GameState.js
import { MainCharacter } from '../entities/MainCharacter.js';
import { Obstacle } from '../entities/Obstacle.js';


export class GameState {
    constructor() {
        this.entities = [];
        this.score = 0;
        this.level = 1;
        this.mainCharacter = null;
        this.characterCustomization = {};
        this.createMainCharacter();
    }

    createMainCharacter(scale = 1) {
        this.mainCharacter = new MainCharacter(100, 100, null, 1);
        
        this.addEntity(this.mainCharacter);
        return this.mainCharacter;
    }

    getMainCharacter() {
        return this.mainCharacter;
    }

    update(deltaTime) {
        // Update all entities
        this.entities.forEach(entity => {
            if (entity.update) {
                entity.update(deltaTime);
            }
        });
    }

    addEntity(entity) {
        this.entities.push(entity);
    }

    removeEntity(entity) {
        const index = this.entities.indexOf(entity);
        if (index !== -1) {
            this.entities.splice(index, 1);
        }
    }

    getEntities() {
        return this.entities;
    }

    reset() {
        this.entities = [];
        this.score = 0;
        this.level = 1;
        this.mainCharacter = null;
    }

    cleanup() {
        this.reset();
    }
}
