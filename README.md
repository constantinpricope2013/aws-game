# aws-game


## Structure 
/AwsGame
├── /src
│   ├── /core
│   │   ├── Game.js           # Main game orchestrator
│   │   ├── GameState.js      # Game state management
│   │   └── GameLoop.js       # Game loop and timing logic
│   │
│   ├── /entities
│   │   ├── Potato.js         # Player character
│   │   ├── Obstacle.js       # Obstacle class
│   │   └── Entity.js         # Base class for game objects
│   │
│   ├── /managers
│   │   ├── CollisionManager.js    # Handles collision detection
│   │   ├── ScoreManager.js        # Manages scoring and high scores
│   │   ├── LevelManager.js        # Handles level progression
│   │   └── InputManager.js        # Handles user input
│   │
│   ├── /rendering
│   │   ├── Renderer.js       # Main rendering system
│   │   ├── UIRenderer.js     # UI-specific rendering
│   │   └── Animation.js      # Animation handling
│   │
│   ├── /ui
│   │   ├── Modal.js          # Modal dialogs
│   │   ├── Button.js         # Button component
│   │   └── Menu.js           # Menu screens
│   │
│   ├── /utils
│   │   ├── Constants.js      # Game constants and configuration
│   │   ├── Storage.js        # Local storage handling
│   │   └── Math.js          # Math utility functions
│   │
│   └── /audio
│       ├── AudioManager.js   # Audio system
│       └── SoundEffects.js   # Sound effect handling
│
├── /assets
│   ├── /images
│   ├── /sounds
│   └── /styles
│
├── /public
│   ├── index.html
│   └── styles.css
│
└── main.js                   # Entry point
