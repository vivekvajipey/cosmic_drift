import Phaser from 'phaser';
import { Ship } from '../components/Ship';
import { SectorGenerator } from '../components/SectorGenerator';
import { UIManager } from '../components/UIManager';

export class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        // Create starfield background
        this.background = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'background');
        this.background.setOrigin(0);
        this.background.setScrollFactor(0);
        
        // Create parallax layers
        this.stars1 = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'stars-parallax-1');
        this.stars1.setOrigin(0);
        this.stars1.setScrollFactor(0);
        this.stars1.setAlpha(0.7);
        
        this.stars2 = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, 'stars-parallax-2');
        this.stars2.setOrigin(0);
        this.stars2.setScrollFactor(0);
        this.stars2.setAlpha(0.5);
        
        // Create the sector generator
        this.sectorGenerator = new SectorGenerator(this);
        
        // Initialize world with a 5x5 grid of sectors
        const worldSize = 5;
        this.sectorGenerator.initGame(worldSize);
        
        // Create player ship in the center of the world
        const worldBounds = this.sectorGenerator.getWorldBounds();
        this.ship = new Ship(
            this,
            worldBounds.width / 2,
            worldBounds.height / 2
        );
        
        // Set up camera to follow the ship
        this.cameras.main.startFollow(this.ship.sprite, true, 0.1, 0.1);
        this.cameras.main.setZoom(1);
        
        // Set up collisions with obstacles
        this.physics.add.collider(
            this.ship.sprite,
            this.sectorGenerator.getObstacles(),
            this.handleCollision,
            null,
            this
        );
        
        // Set up the UI manager
        this.uiManager = new UIManager(this, this.ship);
        
        // Create input handling
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Add space key for collecting resources
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        // Add E key for upgrade menu
        this.eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        
        // Add ESC key for pause menu
        this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        
        // Update active sectors based on player position
        this.sectorGenerator.updateActiveSectors(this.ship.sprite.x, this.ship.sprite.y);
        
        // Check victory condition - add this if you want a specific win condition
        this.checkVictoryTimer = this.time.addEvent({
            delay: 1000,
            callback: this.checkVictoryCondition,
            callbackScope: this,
            loop: true
        });
    }

    update() {
        // Update player ship
        this.ship.update(this.cursors);
        
        // Update sector generator (activating/deactivating sectors as needed)
        this.sectorGenerator.updateActiveSectors(this.ship.sprite.x, this.ship.sprite.y);
        this.sectorGenerator.update();
        
        // Update UI
        this.uiManager.update(this.sectorGenerator.getWorldBounds(), this.sectorGenerator);
        
        // Check for collectible resources in range
        this.uiManager.showResourceCollectionHint(this.sectorGenerator.getResources());
        
        // Handle resource collection with space key
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.collectResources();
        }
        
        // Open upgrade menu with E key
        if (Phaser.Input.Keyboard.JustDown(this.eKey)) {
            this.scene.launch('UpgradeScene', { ship: this.ship });
            this.scene.pause();
        }
        
        // Pause game with ESC key
        if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
            this.uiManager.showPauseMenu();
        }
        
        // Update parallax background
        this.updateParallaxBackground();
        
        // Game over check - if out of fuel and not moving
        if (this.ship.fuel <= 0 && this.ship.sprite.body.speed < 1) {
            this.gameOver();
        }
    }
    
    updateParallaxBackground() {
        // Calculate parallax effect based on camera position
        const camX = this.cameras.main.scrollX;
        const camY = this.cameras.main.scrollY;
        
        // Update background tilesprites with different speeds for parallax effect
        this.stars1.tilePositionX = camX * 0.1;
        this.stars1.tilePositionY = camY * 0.1;
        
        this.stars2.tilePositionX = camX * 0.2;
        this.stars2.tilePositionY = camY * 0.2;
    }
    
    collectResources() {
        // Get all resources in range
        const resources = this.sectorGenerator.getResources();
        const resourcesInRange = resources.filter(resource => resource.sprite.active && resource.isInRange(this.ship));
        
        // Try to collect each resource
        let collected = false;
        for (const resource of resourcesInRange) {
            if (resource.collect(this.ship)) {
                collected = true;
            }
        }
        
        // If nothing was collected, play a negative sound
        if (!collected && resourcesInRange.length > 0) {
            // Could play a "can't collect" sound here if cargo is full
        }
    }
    
    handleCollision(shipSprite, obstacle) {
        // Calculate impact velocity
        const velocity = shipSprite.body.velocity.length();
        
        // Only handle significant collisions
        if (velocity > 50) {
            // Play collision sound
            this.sound.play('collision', { volume: Math.min(1, velocity / 200) });
            
            // Add screen shake based on impact
            this.cameras.main.shake(100, Math.min(0.01, velocity / 5000));
            
            // Reduce fuel slightly on impact to encourage careful flying
            const fuelLost = Math.min(5, velocity / 40);
            this.ship.fuel = Math.max(0, this.ship.fuel - fuelLost);
        }
    }
    
    checkVictoryCondition() {
        // This is just an example - you could define your own victory conditions
        // For example, collect a certain number of artifacts
        if (this.ship.resources.artifacts >= 10) {
            this.victory();
        }
    }
    
    victory() {
        // Pause the game
        this.scene.pause();
        
        // Show victory screen
        this.scene.add('VictoryScene', {
            create: function() {
                // Get center coordinates
                const width = this.cameras.main.width;
                const height = this.cameras.main.height;
                
                // Create overlay
                const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7);
                overlay.setOrigin(0);
                
                // Create victory text
                const titleText = this.add.text(width / 2, height / 2 - 100, 'MISSION COMPLETE', {
                    fontFamily: 'Arial',
                    fontSize: '48px',
                    fontStyle: 'bold',
                    color: '#ffffff'
                });
                titleText.setOrigin(0.5);
                
                // Show collected resources
                const statsText = this.add.text(width / 2, height / 2, 
                    `Metal: ${this.scene.get('GameScene').ship.resources.metal}\n` +
                    `Crystal: ${this.scene.get('GameScene').ship.resources.crystal}\n` +
                    `Artifacts: ${this.scene.get('GameScene').ship.resources.artifacts}`, 
                    {
                        fontFamily: 'Arial',
                        fontSize: '24px',
                        color: '#ffffff',
                        align: 'center'
                    }
                );
                statsText.setOrigin(0.5);
                
                // Create main menu button
                const menuButton = this.add.image(width / 2, height / 2 + 150, 'button');
                menuButton.setScale(2);
                
                const menuText = this.add.text(width / 2, height / 2 + 150, 'MAIN MENU', {
                    fontFamily: 'Arial',
                    fontSize: '24px',
                    color: '#ffffff'
                });
                menuText.setOrigin(0.5);
                
                // Make button interactive
                menuButton.setInteractive();
                
                menuButton.on('pointerover', () => {
                    menuButton.setTexture('button-hover');
                });
                
                menuButton.on('pointerout', () => {
                    menuButton.setTexture('button');
                });
                
                menuButton.on('pointerdown', () => {
                    // Return to main menu
                    this.scene.start('MainMenuScene');
                    this.scene.stop('GameScene');
                });
            }
        });
        
        this.scene.get('VictoryScene').scene.start();
    }
    
    gameOver() {
        // If already in game over state, don't trigger again
        if (this.isGameOver) return;
        this.isGameOver = true;
        
        // Pause the game
        this.scene.pause();
        
        // Show game over screen
        this.scene.add('GameOverScene', {
            create: function() {
                // Get center coordinates
                const width = this.cameras.main.width;
                const height = this.cameras.main.height;
                
                // Create overlay
                const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7);
                overlay.setOrigin(0);
                
                // Create game over text
                const titleText = this.add.text(width / 2, height / 2 - 100, 'GAME OVER', {
                    fontFamily: 'Arial',
                    fontSize: '48px',
                    fontStyle: 'bold',
                    color: '#ff0000'
                });
                titleText.setOrigin(0.5);
                
                // Add message
                const messageText = this.add.text(width / 2, height / 2, 'Your ship has run out of fuel.', {
                    fontFamily: 'Arial',
                    fontSize: '24px',
                    color: '#ffffff'
                });
                messageText.setOrigin(0.5);
                
                // Create retry button
                const retryButton = this.add.image(width / 2, height / 2 + 80, 'button');
                retryButton.setScale(2);
                
                const retryText = this.add.text(width / 2, height / 2 + 80, 'TRY AGAIN', {
                    fontFamily: 'Arial',
                    fontSize: '24px',
                    color: '#ffffff'
                });
                retryText.setOrigin(0.5);
                
                // Make button interactive
                retryButton.setInteractive();
                
                retryButton.on('pointerover', () => {
                    retryButton.setTexture('button-hover');
                });
                
                retryButton.on('pointerout', () => {
                    retryButton.setTexture('button');
                });
                
                retryButton.on('pointerdown', () => {
                    // Restart the game
                    this.scene.start('GameScene');
                });
                
                // Create main menu button
                const menuButton = this.add.image(width / 2, height / 2 + 150, 'button');
                menuButton.setScale(2);
                
                const menuText = this.add.text(width / 2, height / 2 + 150, 'MAIN MENU', {
                    fontFamily: 'Arial',
                    fontSize: '24px',
                    color: '#ffffff'
                });
                menuText.setOrigin(0.5);
                
                // Make button interactive
                menuButton.setInteractive();
                
                menuButton.on('pointerover', () => {
                    menuButton.setTexture('button-hover');
                });
                
                menuButton.on('pointerout', () => {
                    menuButton.setTexture('button');
                });
                
                menuButton.on('pointerdown', () => {
                    // Return to main menu
                    this.scene.start('MainMenuScene');
                });
            }
        });
        
        this.scene.get('GameOverScene').scene.start();
    }
} 