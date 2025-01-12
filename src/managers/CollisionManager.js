export class CollisionManager {
    constructor() {
        this.entities = [];
    }

    // Add entities to be checked for collisions
    addEntity(entity) {
        this.entities.push(entity);
    }

    // Remove entities from collision checking
    removeEntity(entity) {
        const index = this.entities.indexOf(entity);
        if (index !== -1) {
            this.entities.splice(index, 1);
        }
    }

    // Main collision check method
    checkCollisions(entities = this.entities) {
        for (let i = 0; i < entities.length; i++) {
            const entityA = entities[i];
            
            // Skip entities that don't have collision enabled
            if (!entityA.collidable) continue;

            // Check collision with other entities
            for (let j = i + 1; j < entities.length; j++) {
                const entityB = entities[j];
                
                if (!entityB.collidable) continue;

                if (this.isColliding(entityA, entityB)) {
                    this.resolveCollision(entityA, entityB);
                }
            }

            // Check collision with boundaries if they exist
            if (this.boundaries) {
                this.checkBoundaryCollision(entityA);
            }
        }
    }

    // AABB (Axis-Aligned Bounding Box) collision detection
    isColliding(entityA, entityB) {
        return (entityA.x < entityB.x + entityB.width &&
                entityA.x + entityA.width > entityB.x &&
                entityA.y < entityB.y + entityB.height &&
                entityA.y + entityA.height > entityB.y);
    }

    // Resolve collision between two entities
    resolveCollision(entityA, entityB) {
        // Notify both entities of the collision
        if (entityA.onCollision) {
            entityA.onCollision(entityB);
        }
        if (entityB.onCollision) {
            entityB.onCollision(entityA);
        }

        // Handle physical collision resolution if entities are solid
        if (entityA.solid && entityB.solid) {
            // Calculate overlap on both axes
            const overlapX = Math.min(
                entityA.x + entityA.width - entityB.x,
                entityB.x + entityB.width - entityA.x
            );
            const overlapY = Math.min(
                entityA.y + entityA.height - entityB.y,
                entityB.y + entityB.height - entityA.y
            );

            // Resolve along the axis with the smallest overlap
            if (overlapX < overlapY) {
                if (entityA.x < entityB.x) {
                    entityA.x -= overlapX;
                } else {
                    entityA.x += overlapX;
                }
            } else {
                if (entityA.y < entityB.y) {
                    entityA.y -= overlapY;
                } else {
                    entityA.y += overlapY;
                }
            }

            // Update velocities for bouncing effect (if entities have velocity)
            if (entityA.velocity && entityB.velocity) {
                this.resolveVelocities(entityA, entityB);
            }
        }
    }

    // Resolve velocities for bouncing entities
    resolveVelocities(entityA, entityB) {
        // Basic elastic collision
        const tempVelX = entityA.velocity.x;
        const tempVelY = entityA.velocity.y;

        entityA.velocity.x = entityB.velocity.x;
        entityA.velocity.y = entityB.velocity.y;

        entityB.velocity.x = tempVelX;
        entityB.velocity.y = tempVelY;

        // Apply bounce dampening if specified
        if (entityA.bounceFactor) {
            entityA.velocity.x *= entityA.bounceFactor;
            entityA.velocity.y *= entityA.bounceFactor;
        }
        if (entityB.bounceFactor) {
            entityB.velocity.x *= entityB.bounceFactor;
            entityB.velocity.y *= entityB.bounceFactor;
        }
    }

    // Check and resolve collision with game boundaries
    checkBoundaryCollision(entity) {
        if (!this.boundaries) return;

        // Left boundary
        if (entity.x < this.boundaries.left) {
            entity.x = this.boundaries.left;
            if (entity.velocity) entity.velocity.x *= -entity.bounceFactor || 0;
        }
        // Right boundary
        if (entity.x + entity.width > this.boundaries.right) {
            entity.x = this.boundaries.right - entity.width;
            if (entity.velocity) entity.velocity.x *= -entity.bounceFactor || 0;
        }
        // Top boundary
        if (entity.y < this.boundaries.top) {
            entity.y = this.boundaries.top;
            if (entity.velocity) entity.velocity.y *= -entity.bounceFactor || 0;
        }
        // Bottom boundary
        if (entity.y + entity.height > this.boundaries.bottom) {
            entity.y = this.boundaries.bottom - entity.height;
            if (entity.velocity) entity.velocity.y *= -entity.bounceFactor || 0;
        }
    }

    // Set game boundaries
    setBoundaries(boundaries) {
        this.boundaries = boundaries;
    }

    // Clear all entities
    clear() {
        this.entities = [];
    }

    cleanup() {
        this.clear();
    }
}
