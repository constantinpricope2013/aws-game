const CONFIG = {
    canvas: {
        width: window.innerWidth,
        height: window.innerHeight
    },
    buttons: {
        start: {
            x: window.innerWidth / 2 - 100,
            y: window.innerHeight / 2,
            width: 200,
            height: 50
        },
        changeUsername: {
            x: 10,
            y: 10,
            width: 150,
            height: 30
        }
    },
    levels: {
        1: { obstacleCount: 3, speed: 5, gap: 300 },
        2: { obstacleCount: 4, speed: 6, gap: 250 },
        3: { obstacleCount: 5, speed: 7, gap: 200 }
    },
    styles: {
        buttonColor: '#4CAF50',
        textColor: 'black',
        gameOverOverlay: 'rgba(0, 0, 0, 0.5)'
    }
};
