export function checkCollision(player, obstacle) {
    return player.x < obstacle.x + obstacle.width &&
           player.x + player.size > obstacle.x &&
           player.y < obstacle.y + obstacle.height &&
           player.y + player.size > obstacle.y;
