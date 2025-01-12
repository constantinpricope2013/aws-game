// src/managers/InputManager.js
export class InputManager {
    constructor() {
        // Key states
        this.keys = {};
        this.previousKeys = {};
        
        // Mouse states
        this.mousePosition = { x: 0, y: 0 };
        this.mouseButtons = {};
        this.previousMouseButtons = {};
        
        // Touch states
        this.touches = {};
        this.previousTouches = {};

        // Bind event handlers
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
    }

    init() {
        // Keyboard events
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        
        // Mouse events
        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('mousedown', this.handleMouseDown);
        window.addEventListener('mouseup', this.handleMouseUp);
        
        // Touch events
        window.addEventListener('touchstart', this.handleTouchStart);
        window.addEventListener('touchend', this.handleTouchEnd);
        window.addEventListener('touchmove', this.handleTouchMove);
    }

    cleanup() {
        // Remove event listeners
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('mousedown', this.handleMouseDown);
        window.removeEventListener('mouseup', this.handleMouseUp);
        window.removeEventListener('touchstart', this.handleTouchStart);
        window.removeEventListener('touchend', this.handleTouchEnd);
        window.removeEventListener('touchmove', this.handleTouchMove);
    }

    update() {
        // Update previous states
        this.previousKeys = { ...this.keys };
        this.previousMouseButtons = { ...this.mouseButtons };
        this.previousTouches = { ...this.touches };
    }

    // Keyboard handling
    handleKeyDown(event) {
        this.keys[event.code] = true;
    }

    handleKeyUp(event) {
        this.keys[event.code] = false;
    }

    isKeyDown(keyCode) {
        return this.keys[keyCode] === true;
    }

    isKeyPressed(keyCode) {
        return this.keys[keyCode] && !this.previousKeys[keyCode];
    }

    isKeyReleased(keyCode) {
        return !this.keys[keyCode] && this.previousKeys[keyCode];
    }

    // Mouse handling
    handleMouseMove(event) {
        this.mousePosition.x = event.clientX;
        this.mousePosition.y = event.clientY;
    }

    handleMouseDown(event) {
        this.mouseButtons[event.button] = true;
    }

    handleMouseUp(event) {
        this.mouseButtons[event.button] = false;
    }

    isMouseButtonDown(button) {
        return this.mouseButtons[button] === true;
    }

    isMouseButtonPressed(button) {
        return this.mouseButtons[button] && !this.previousMouseButtons[button];
    }

    isMouseButtonReleased(button) {
        return !this.mouseButtons[button] && this.previousMouseButtons[button];
    }

    getMousePosition() {
        return { ...this.mousePosition };
    }

    // Touch handling
    handleTouchStart(event) {
        event.preventDefault();
        Array.from(event.touches).forEach(touch => {
            this.touches[touch.identifier] = {
                x: touch.clientX,
                y: touch.clientY
            };
        });
    }

    handleTouchEnd(event) {
        event.preventDefault();
        Array.from(event.changedTouches).forEach(touch => {
            delete this.touches[touch.identifier];
        });
    }

    handleTouchMove(event) {
        event.preventDefault();
        Array.from(event.touches).forEach(touch => {
            this.touches[touch.identifier] = {
                x: touch.clientX,
                y: touch.clientY
            };
        });
    }

    getTouches() {
        return { ...this.touches };
    }

    // Utility methods
    clearStates() {
        this.keys = {};
        this.previousKeys = {};
        this.mouseButtons = {};
        this.previousMouseButtons = {};
        this.touches = {};
        this.previousTouches = {};
    }
}
