import { MainCharacter } from '../entities/MainCharacter.js';
import { StartInterface } from './StartInterface.js';

export class MainCharacterCustomization {
    constructor(game) {
        this.game = game;
        this.canvas = this.game.renderer.canvas;
        this.ctx = this.game.renderer.ctx;

        // Panel control properties
        this.panel = {
            x: 20,
            y: 20,
            width: 300,
            height: this.canvas.height - 40,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: '#2196F3',
            borderWidth: 2,
            borderRadius: 10,
            isDragging: false,
            dragOffset: { x: 0, y: 0 }
        };

        // Scrolling properties for panel content
        this.scroll = {
            y: 0,
            maxScroll: 0,
            scrollBarWidth: 8,
            isScrolling: false
        };

        this.setupCustomization();
        this.setupPanelControls();
        this.addEventListeners();

        
        this.previewCharacter = this.game.state.mainCharacter;
        this.updatePreviewCharacter();
        

        this.render();
        
    }

    setupCustomization() {
        this.currentCustomization = this.game.state.mainCharacter.customization;

        this.controls = [];
        this.setupControlElements();
    }

    setupControlElements() {
        let yOffset = 20;
        const padding = 15;
        const controlHeight = 40;

        // Header
        this.addPanelHeader("Character Customization", yOffset);
        yOffset += 50;

        // Colors Section
        this.addPanelSection("Colors", yOffset);
        yOffset += 40;

        // Body Color
        this.addColorControl("Body Color", this.currentCustomization.bodyColor, yOffset, (color) => {
            this.currentCustomization.bodyColor = color;
            this.updatePreviewCharacter();
        });
        yOffset += controlHeight + padding;

        // Spot Color
        this.addColorControl("Spot Color", this.currentCustomization.bodySpotColor, yOffset, (color) => {
            this.currentCustomization.bodySpotColor = color;
            this.updatePreviewCharacter();
        });
        yOffset += controlHeight + padding;

        // Eye Color
        this.addColorControl("Eye Color", this.currentCustomization.eyeColor, yOffset, (color) => {
            this.currentCustomization.eyeColor = color;
            this.updatePreviewCharacter();
        });
        yOffset += controlHeight + padding * 2;

        // Features Section
        this.addPanelSection("Features", yOffset);
        yOffset += 40;

        // Expression Dropdown
        this.addDropdownControl("Expression", 
            ['happy', 'sad', 'neutral', 'surprised'], 
            this.currentCustomization.expression,
            yOffset,
            (value) => {
                this.currentCustomization.expression = value;
                this.updatePreviewCharacter();
            }
        );
        yOffset += controlHeight + padding;

        // Eye Style Dropdown
        this.addDropdownControl("Eye Style",
            ['normal', 'curious', 'angry', 'sleepy'],
            this.currentCustomization.eyeStyle,
            yOffset,
            (value) => {
                this.currentCustomization.eyeStyle = value;
                this.updatePreviewCharacter();
            }
        );
        yOffset += controlHeight + padding;

        // Toggles Section
        this.addPanelSection("Toggles", yOffset);
        yOffset += 40;

        // Body Spots Toggle
        // this.addToggleControl("Body Spots", 
        //     this.currentCustomization.bodySpots,
        //     yOffset,
        //     (enabled) => {
        //         this.currentCustomization.bodySpots = enabled;
        //         this.updatePreviewCharacter();
        //     }
        // );
        // yOffset += controlHeight + padding;

        // Arms Toggle
        this.addToggleControl("Arms",
            this.currentCustomization.hasArms,
            yOffset,
            (enabled) => {
                this.currentCustomization.hasArms = enabled;
                this.updatePreviewCharacter();
            }
        );
        yOffset += controlHeight + padding;

        // Legs Toggle
        this.addToggleControl("Legs",
            this.currentCustomization.hasLegs,
            yOffset,
            (enabled) => {
                this.currentCustomization.hasLegs = enabled;
                this.updatePreviewCharacter();
            }
        );
        yOffset += controlHeight + padding * 2;

        // Effects Section
        this.addPanelSection("Effects", yOffset);
        yOffset += 40;

        // Jump Effect Dropdown
        this.addDropdownControl("Jump Effect",
            ['spring', 'flip', 'bounce'],
            this.currentCustomization.jumpEffect,
            yOffset,
            (value) => {
                this.currentCustomization.jumpEffect = value;
                this.updatePreviewCharacter();
            }
        );
        yOffset += controlHeight + padding * 2;

        // Action Buttons
        this.addButton("Save", yOffset, () => this.saveCustomization());
        yOffset += controlHeight + padding;

        this.addButton("Back", yOffset, () => this.backToMain());
        yOffset += controlHeight + padding;

        // Update max scroll
        this.scroll.maxScroll = Math.max(0, yOffset - this.panel.height + 40);
    }

    saveCustomization() {
        this.game.state.mainCharacter.customization = this.currentCustomization;
        this.game.state.mainCharacter.saveCustomization();
        this.backToMain();
    }

    backToMain() {
        this.cleanup();
        this.game.currentInterface = new StartInterface(this.game);
    }

    addPanelHeader(text, y) {
        this.controls.push({
            type: 'header',
            text,
            y
        });
    }

    addPanelSection(text, y) {
        this.controls.push({
            type: 'section',
            text,
            y
        });
    }

    addColorControl(label, defaultColor, y, onChange) {
        this.controls.push({
            type: 'color',
            label,
            color: defaultColor,
            y,
            onChange
        });
    }

    addDropdownControl(label, options, defaultValue, y, onChange) {
        this.controls.push({
            type: 'dropdown',
            label,
            options,
            value: defaultValue,
            y,
            onChange
        });
    }

    addToggleControl(label, defaultValue, y, onChange) {
        this.controls.push({
            type: 'toggle',
            label,
            value: defaultValue,
            y,
            onChange
        });
    }

    addButton(text, y, onClick) {
        this.controls.push({
            type: 'button',
            text,
            y,
            onClick
        });
    }

    addEventListeners() {
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.handleMouseUp());
        this.canvas.addEventListener('wheel', (e) => this.handleWheel(e));
        window.addEventListener('resize', () => this.handleResize());

        // add touch support
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.canvas.addEventListener('touchend', () => this.handleTouchEnd());

    }

    handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        const x = (touch.clientX - rect.left) * scaleX;
        const y = (touch.clientY - rect.top) * scaleY;

        if (this.isInPanel(x, y)) {
            if (this.isInScrollbar(x, y)) {
                this.scroll.isScrolling = true;
            } else {
                this.handlePanelClick(x, y);
            }
        }

        // Handle panel dragging
        if (this.isInPanelHeader(x, y)) {
            this.panel.isDragging = true;
            this.panel.dragOffset.x = x - this.panel.x;
            this.panel.dragOffset.y = y - this.panel.y;
        }
    }

    handleTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        const x = (touch.clientX - rect.left) * scaleX;
        const y = (touch.clientY - rect.top) * scaleY;

        if (this.panel.isDragging) {
            this.panel.x = x - this.panel.dragOffset.x;
            this.panel.y = y - this.panel.dragOffset.y;

            // Keep panel within canvas bounds
            this.panel.x = Math.max(0, Math.min(this.panel.x, this.canvas.width - this.panel.width));
            this.panel.y = Math.max(0, Math.min(this.panel.y, this.canvas.height - this.panel.height));
        }

        if (this.scroll.isScrolling) {
            const scrollPercent = (y - this.panel.y) / this.panel.height;
            this.scroll.y = scrollPercent * this.scroll.maxScroll;
            this.scroll.y = Math.max(0, Math.min(this.scroll.y, this.scroll.maxScroll));
        }
    }

    handleTouchEnd() {
        this.panel.isDragging = false;
        this.scroll.isScrolling = false;
    }

    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (this.isInPanel(x, y)) {
            this.handlePanelClick(x, y);
        }
    }

    handleResize() {
        
        this.render();
    }

    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (this.isInPanel(x, y)) {
            if (this.isInScrollbar(x, y)) {
                this.scroll.isScrolling = true;
            } else {
                this.handlePanelClick(x, y);
            }
        }

        // Handle panel dragging
        if (this.isInPanelHeader(x, y)) {
            this.panel.isDragging = true;
            this.panel.dragOffset.x = x - this.panel.x;
            this.panel.dragOffset.y = y - this.panel.y;
        }
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (this.panel.isDragging) {
            this.panel.x = x - this.panel.dragOffset.x;
            this.panel.y = y - this.panel.dragOffset.y;
            
            // Keep panel within canvas bounds
            this.panel.x = Math.max(0, Math.min(this.panel.x, this.canvas.width - this.panel.width));
            this.panel.y = Math.max(0, Math.min(this.panel.y, this.canvas.height - this.panel.height));
        }

        if (this.scroll.isScrolling) {
            const scrollPercent = (y - this.panel.y) / this.panel.height;
            this.scroll.y = scrollPercent * this.scroll.maxScroll;
            this.scroll.y = Math.max(0, Math.min(this.scroll.y, this.scroll.maxScroll));
        }
    }

    handleMouseUp() {
        this.panel.isDragging = false;
        this.scroll.isScrolling = false;
    }

    handleWheel(e) {
        if (this.isInPanel(e.offsetX, e.offsetY)) {
            e.preventDefault();
            this.scroll.y += e.deltaY;
            this.scroll.y = Math.max(0, Math.min(this.scroll.y, this.scroll.maxScroll));
        }
    }

    render() {
        console.log('Rendering customization interface...');
        this.scroll.maxScroll = Math.max(0, this.controls[this.controls.length - 1].y - this.panel.height + 40);

        // Clear canvas
        this.ctx.fillStyle = '#f0f0f0';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Render preview character
        if (this.previewCharacter) {
            this.previewCharacter.render(this.ctx);
        }
        else {
            this.updatePreviewCharacter();
        }

        // Render panel
        this.renderPanel();
    }

    renderPanel() {
        // Panel background
        this.ctx.fillStyle = this.panel.backgroundColor;
        this.roundRect(
            this.panel.x,
            this.panel.y,
            this.panel.width,
            this.panel.height,
            this.panel.borderRadius
        );

        // Panel border
        this.ctx.strokeStyle = this.panel.borderColor;
        this.ctx.lineWidth = this.panel.borderWidth;
        this.ctx.stroke();

        // Set clip region for controls
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rect(
            this.panel.x,
            this.panel.y,
            this.panel.width - this.scroll.scrollBarWidth,
            this.panel.height
        );
        this.ctx.clip();

        // Render controls
        this.renderControls();

        this.ctx.restore();

        // Render scrollbar
        this.renderScrollbar();
    }

    renderControls() {
        this.controls.forEach(control => {
            const y = this.panel.y + control.y - this.scroll.y;
            
            // Only render if control is visible
            if (y + 40 < this.panel.y || y > this.panel.y + this.panel.height) {
                return;
            }

            switch (control.type) {
                case 'header':
                    this.renderHeader(control, y);
                    break;
                case 'section':
                    this.renderSection(control, y);
                    break;
                case 'color':
                    this.renderColorControl(control, y);
                    break;
                case 'dropdown':
                    this.renderDropdown(control, y);
                    break;
                case 'toggle':
                    this.renderToggle(control, y);
                    break;
                case 'button':
                    this.renderButton(control, y);
                    break;
            }
        });
    }

    renderHeader(control, y) {
        this.ctx.fillStyle = '#000000';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(control.text, this.panel.x + this.panel.width / 2, y + 30);
    }

    renderSection(control, y) {
        this.ctx.fillStyle = '#000000';
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(control.text, this.panel.x + 20, y + 30);
    }

    renderColorControl(control, y) {
        this.ctx.fillStyle = control.color;
        this.ctx.fillRect(this.panel.x + 20, y + 10, 20, 20);

        this.ctx.fillStyle = '#000000';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(control.label, this.panel.x + 50, y + 30);
    }

    renderDropdown(control, y) {
        this.ctx.fillStyle = '#000000';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(control.label, this.panel.x + 20, y + 30);

        this.ctx.fillStyle = '#000000';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(control.value, this.panel.x + this.panel.width - 20, y + 30);
    }

    renderToggle(control, y) {
        this.ctx.fillStyle = '#000000';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(control.label, this.panel.x + 20, y + 30);

        this.ctx.fillStyle = control.value ? '#4CAF50' : '#F44336';
        this.ctx.fillRect(this.panel.x + this.panel.width - 60, y + 10, 40, 20);
    }

    renderButton(control, y) {
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.fillRect(this.panel.x + 20, y + 10, this.panel.width - 40, 20);

        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(control.text, this.panel.x + this.panel.width / 2, y + 24);
    }

    renderScrollbar() {
        const scrollBarX = this.panel.x + this.panel.width - this.scroll.scrollBarWidth;
        const scrollBarHeight = this.panel.height * this.panel.height / (this.scroll.maxScroll + this.panel.height);

        // Scrollbar track
        this.ctx.fillStyle = '#E0E0E0';
        this.ctx.fillRect(scrollBarX, this.panel.y, this.scroll.scrollBarWidth, this.panel.height);

        // Scrollbar thumb
        this.ctx.fillStyle = '#9E9E9E';
        this.ctx.fillRect(scrollBarX, this.panel.y + this.scroll.y, this.scroll.scrollBarWidth, scrollBarHeight);
    }

    setupPanelControls() {
        this.panelControls = [
            {
                label: 'Body Color',
                value: '#B87333',
                y: 20
            },
            {
                label: 'Eye Style',
                value: 'normal',
                y: 80
            },
            {
                label: 'Expression',
                value: 'happy',
                y: 140
            },
            {
                label: 'Has Arms',
                value: 'true',
                y: 200
            },
            {
                label: 'Has Legs',
                value: 'true',
                y: 260
            },
            {
                label: 'Jump Effect',
                value: 'spring',
                y: 320
            }
        ];
    }



    updatePreviewCharacter() {
        // Update preview character based on the panel controls
        console.log('Updating preview character...');
        var x = this.canvas.width / 2 + this.panel.width / 2
        var y = this.canvas.height / 2

        this.previewCharacter.x = x;
        this.previewCharacter.y = y;
        this.previewCharacter.scale = 2;


        this.previewCharacter.customization = this.currentCustomization;
        this.previewCharacter.render(this.ctx);
    }

    roundRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
        this.ctx.fill();
    }

    isInPanel(x, y) {
        return x >= this.panel.x && 
                x <= this.panel.x + this.panel.width &&
                y >= this.panel.y && 
                y <= this.panel.y + this.panel.height;
    }

    isInPanelHeader(x, y) {
        return x >= this.panel.x &&
                x <= this.panel.x + this.panel.width &&
                y >= this.panel.y &&
                y <= this.panel.y + 40; // Header height is 40px
    }

    isInScrollbar(x, y) {
        return x >= this.panel.x + this.panel.width - this.scroll.scrollBarWidth &&
                x <= this.panel.x + this.panel.width &&
                y >= this.panel.y &&
                y <= this.panel.y + this.panel.height;
    }

    handlePanelClick(x, y) {
        const relativeY = y - this.panel.y + this.scroll.y;

        this.controls.forEach(control => {
            if (control.y <= relativeY && relativeY <= control.y + 40) {
                const relativeX = x - this.panel.x;
                
                switch (control.type) {
                    case 'color':
                        if (relativeX >= 120 && relativeX <= 270) {
                            this.openColorPicker(control);
                        }
                        break;
                    case 'dropdown':
                        if (relativeX >= 120 && relativeX <= 270) {
                            this.toggleDropdown(control);
                        }
                        break;
                    case 'toggle':
                        if (relativeX >= 120 && relativeX <= 270) {
                            control.value = !control.value;
                            control.onChange(control.value);
                        }
                        break;
                    case 'button':
                        if (relativeX >= 10 && relativeX <= 270) {
                            control.onClick();
                        }
                        break;
                }
            }
        });
    }

    renderScrollbar() {
        if (this.scroll.maxScroll <= 0) return;

        const scrollBarHeight = (this.panel.height / (this.panel.height + this.scroll.maxScroll)) * this.panel.height;
        const scrollBarY = this.panel.y + (this.scroll.y / this.scroll.maxScroll) * (this.panel.height - scrollBarHeight);

        // Scrollbar background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(
            this.panel.x + this.panel.width - this.scroll.scrollBarWidth,
            this.panel.y,
            this.scroll.scrollBarWidth,
            this.panel.height
        );

        // Scrollbar handle
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(
            this.panel.x + this.panel.width - this.scroll.scrollBarWidth,
            scrollBarY,
            this.scroll.scrollBarWidth,
            scrollBarHeight
        );
    }

    renderHeader(control, y) {
        this.ctx.fillStyle = '#333';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(control.text, this.panel.x + 20, y + 25);
    }

    renderSection(control, y) {
        this.ctx.fillStyle = '#666';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(control.text, this.panel.x + 20, y + 20);
    }

    renderColorControl(control, y) {
        // Label
        this.ctx.fillStyle = '#333';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(control.label, this.panel.x + 20, y + 25);

        // Color box
        this.ctx.fillStyle = control.color;
        this.ctx.fillRect(this.panel.x + 120, y + 5, 150, 30);
        this.ctx.strokeStyle = '#999';
        this.ctx.strokeRect(this.panel.x + 120, y + 5, 150, 30);
    }

    renderDropdown(control, y) {
        // Label
        this.ctx.fillStyle = '#333';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(control.label, this.panel.x + 20, y + 25);

        // Dropdown box
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(this.panel.x + 120, y + 5, 150, 30);
        this.ctx.strokeStyle = '#999';
        this.ctx.strokeRect(this.panel.x + 120, y + 5, 150, 30);

        // Selected value
        this.ctx.fillStyle = '#333';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(control.value, this.panel.x + 130, y + 25);
    }

    renderToggle(control, y) {
        // Label
        this.ctx.fillStyle = '#333';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(control.label, this.panel.x + 20, y + 25);

        // Toggle background
        this.ctx.fillStyle = control.value ? '#4CAF50' : '#ccc';
        this.roundRect(this.panel.x + 120, y + 5, 50, 30, 15);

        // Toggle handle
        this.ctx.fillStyle = '#fff';
        const handleX = control.value ? 
            this.panel.x + 145 : 
            this.panel.x + 125;
        this.ctx.beginPath();
        this.ctx.arc(handleX, y + 20, 10, 0, Math.PI * 2);
        this.ctx.fill();
    }

    renderButton(control, y) {
        // Button background
        this.ctx.fillStyle = '#2196F3';
        this.roundRect(this.panel.x + 10, y + 5, 260, 30, 5);

        // Button text
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(control.text, this.panel.x + 140, y + 25);
    }
    

    addEventListeners() {
        // Bind methods to preserve 'this' context
        this.handleCanvasClick = this.handleCanvasClick.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleWheel = this.handleWheel.bind(this);
        this.handleResize = this.handleResize.bind(this);
    
        // Add all event listeners
        this.canvas.addEventListener('click', this.handleCanvasClick);
        this.canvas.addEventListener('mousedown', this.handleMouseDown);
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.canvas.addEventListener('mouseup', this.handleMouseUp);
        this.canvas.addEventListener('wheel', this.handleWheel);
        window.addEventListener('resize', this.handleResize);
    }
    
    cleanup() {
        // Remove all event listeners
        this.canvas.removeEventListener('click', this.handleCanvasClick);
        this.canvas.removeEventListener('mousedown', this.handleMouseDown);
        this.canvas.removeEventListener('mousemove', this.handleMouseMove);
        this.canvas.removeEventListener('mouseup', this.handleMouseUp);
        this.canvas.removeEventListener('wheel', this.handleWheel);
        window.removeEventListener('resize', this.handleResize);
    }
    
    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
    
        if (this.isInPanel(x, y)) {
            this.handlePanelClick(x, y);
        }
    }
    
    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
    
        if (this.isInPanel(x, y)) {
            if (this.isInScrollbar(x, y)) {
                this.scroll.isScrolling = true;
            } else if (this.isInPanelHeader(x, y)) {
                this.panel.isDragging = true;
                this.panel.dragOffset.x = x - this.panel.x;
                this.panel.dragOffset.y = y - this.panel.y;
            }
        }
    }
    
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
    
        if (this.panel.isDragging) {
            this.panel.x = Math.max(0, Math.min(x - this.panel.dragOffset.x, 
                this.canvas.width - this.panel.width));
            this.panel.y = Math.max(0, Math.min(y - this.panel.dragOffset.y, 
                this.canvas.height - this.panel.height));
            this.render();
        }
    
        if (this.scroll.isScrolling) {
            const scrollableHeight = this.panel.height;
            const scrollPercent = (y - this.panel.y) / scrollableHeight;
            this.scroll.y = Math.max(0, Math.min(
                scrollPercent * this.scroll.maxScroll,
                this.scroll.maxScroll
            ));
            this.render();
        }
    }
    
    handleMouseUp() {
        this.panel.isDragging = false;
        this.scroll.isScrolling = false;
    }
    
    handleWheel(e) {
        if (this.isInPanel(e.offsetX, e.offsetY)) {
            e.preventDefault();
            const newScrollY = this.scroll.y + e.deltaY;
            this.scroll.y = Math.max(0, Math.min(newScrollY, this.scroll.maxScroll));
            this.render();
        }
    }
    
    handleResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Update panel position to ensure it stays within bounds
        this.panel.x = Math.min(this.panel.x, this.canvas.width - this.panel.width);
        this.panel.y = Math.min(this.panel.y, this.canvas.height - this.panel.height);
        
        // Update scroll if needed
        this.scroll.maxScroll = Math.max(0, this.controls[this.controls.length - 1].y - this.panel.height + 40);
        this.scroll.y = Math.min(this.scroll.y, this.scroll.maxScroll);
        
        // Reposition preview character
        if (this.previewCharacter) {
            // Put the charecter in the center of right half of the screen
            this.previewCharacter.x = this.canvas.width / 2 + this.panel.width / 2;
            this.previewCharacter.y = this.canvas.height / 2;
        }
        
        this.render();
    }
    
    openColorPicker(control) {
        const input = document.createElement('input');
        input.type = 'color';
        input.value = control.color;
        
        input.addEventListener('change', (e) => {
            control.color = e.target.value;
            control.onChange(e.target.value);
            this.render();
        });
        
        input.click();
    }
    
    toggleDropdown(control) {
        const currentIndex = control.options.indexOf(control.value);
        const nextIndex = (currentIndex + 1) % control.options.length;
        control.value = control.options[nextIndex];
        control.onChange(control.value);
        this.render();
    } 

}
