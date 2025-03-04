import Phaser from 'phaser';
import { Ship } from '../components/Ship';
import { SectorGenerator } from '../components/SectorGenerator';
import { UIManager } from '../components/UIManager';

export class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.isGameOver = false;
        this.hasWon = false;
        this.currentLevel = 1; // Default to level 1
        this.objectives = {};
        this.showedMissionIntro = false;
    }

    init(data) {
        // Reset game state
        this.isGameOver = false;
        this.hasWon = false;
        this.showedMissionIntro = false;
        
        // Set level from data if provided
        if (data && data.level) {
            this.currentLevel = data.level;
        } else {
            // Set to 0 for free play mode
            this.currentLevel = 0; 
        }
        
        // Set objectives based on level
        this.setupLevelObjectives(this.currentLevel);
    }
    
    setupLevelObjectives(level) {
        switch(level) {
            case 1: // The Outer Rim
                this.objectives = {
                    metal: { required: 10, collected: 0 },
                    fuel: { required: 5, collected: 0 },
                    description: "Collect 10 metal and 5 fuel to repair your systems"
                };
                break;
            case 2: // The Mining Colonies
                this.objectives = {
                    metal: { required: 15, collected: 0 },
                    crystal: { required: 8, collected: 0 },
                    fuel: { required: 10, collected: 0 },
                    rescuePods: { required: 3, rescued: 0 },
                    description: "Rescue 3 survivor pods and collect resources for repairs"
                };
                break;
            // Add more levels as needed
            default:
                // For free play mode, just set a high victory threshold
                this.objectives = {
                    metal: { required: 20, collected: 0 },
                    crystal: { required: 15, collected: 0 },
                    artifact: { required: 5, collected: 0 },
                    description: "Collect resources and explore the sector"
                };
        }
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
        
        // Show mission intro after a short delay if in a story level
        if (this.currentLevel > 0) {
            this.time.delayedCall(1000, this.showMissionIntro, [], this);
        }
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
        
        // Update objectives if in a story level
        if (this.currentLevel > 0) {
            // Update objectives based on collected resource
            if (this.objectives[resourceType]) {
                this.objectives[resourceType].collected++;
                
                // Check if objective is complete
                this.checkLevelObjectives();
            }
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
        
        // Create a proper GameOverScene if not already added to the scene manager
        if (!this.scene.get('GameOverScene')) {
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
                        this.scene.stop('GameOverScene');
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
                        this.scene.stop('GameOverScene');
                        this.scene.start('MainMenuScene');
                    });
                }
            });
        }
        
        // Start the GameOverScene properly
        try {
            this.scene.launch('GameOverScene');
        } catch (error) {
            console.error("Error launching GameOverScene:", error);
        }
    }
    
    showMissionIntro() {
        const width = this.scale.width;
        const height = this.scale.height;
        
        // Create the modal container
        this.missionModal = this.add.container(width / 2, height / 2);
        this.missionModal.setDepth(1000); // Ensure it's on top of everything
        
        // Add semi-transparent background
        const modalBg = this.add.rectangle(0, 0, width * 0.7, height * 0.7, 0x000000, 0.8);
        modalBg.setStrokeStyle(2, 0x3498db);
        this.missionModal.add(modalBg);
        
        // Add title text
        const missionTitle = this.add.text(0, -height * 0.25, `LEVEL ${this.currentLevel}: THE OUTER RIM`, {
            fontFamily: 'Arial',
            fontSize: '28px',
            fontStyle: 'bold',
            color: '#3498db',
            align: 'center'
        });
        missionTitle.setOrigin(0.5);
        this.missionModal.add(missionTitle);
        
        // Add mission description
        let missionDesc = 'Your ship\'s systems are barely functioning. You need to collect specific resources to complete repairs.';
        const descText = this.add.text(0, -height * 0.15, missionDesc, {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: width * 0.6 }
        });
        descText.setOrigin(0.5);
        this.missionModal.add(descText);
        
        // Add objectives title
        const objectivesTitle = this.add.text(0, -height * 0.05, 'OBJECTIVES:', {
            fontFamily: 'Arial',
            fontSize: '22px',
            fontStyle: 'bold',
            color: '#ffffff',
            align: 'center'
        });
        objectivesTitle.setOrigin(0.5);
        this.missionModal.add(objectivesTitle);
        
        // Create objectives based on current level
        let objectives = this.getCurrentLevelObjectives();
        
        // Add each objective
        let yPos = height * 0.02;
        for (const objective of objectives) {
            const objectiveText = this.add.text(0, yPos, `• ${objective.text}: 0/${objective.target}`, {
                fontFamily: 'Arial',
                fontSize: '18px',
                color: '#ffffff',
                align: 'center'
            });
            objectiveText.setOrigin(0.5);
            this.missionModal.add(objectiveText);
            yPos += 30;
        }
        
        // Add continue button - ensure it's properly positioned and interactive
        const continueButton = this.add.image(0, height * 0.25, 'button');
        continueButton.setScale(2);
        continueButton.setInteractive({ useHandCursor: true });
        
        const continueText = this.add.text(0, height * 0.25, 'CONTINUE', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#ffffff'
        });
        continueText.setOrigin(0.5);
        
        // Add everything to the modal
        this.missionModal.add(continueButton);
        this.missionModal.add(continueText);
        
        // Add click handler to continue button
        continueButton.on('pointerup', () => {
            this.sound.play('button-click');
            // Remove the modal with animation
            this.tweens.add({
                targets: this.missionModal,
                alpha: 0,
                duration: 300,
                onComplete: () => {
                    this.missionModal.destroy();
                    // Resume the game
                    this.physics.resume();
                    this.uiManager.showGameUI();
                }
            });
        });
        
        // Add hover effects
        continueButton.on('pointerover', () => {
            continueButton.setTexture('button-hover');
        });
        
        continueButton.on('pointerout', () => {
            continueButton.setTexture('button');
        });
        
        // Pause the game while showing the mission intro
        this.physics.pause();
    }
    
    checkLevelObjectives() {
        // Check if all objectives for this level are complete
        let allComplete = true;
        
        if (this.objectives.metal && this.objectives.metal.collected < this.objectives.metal.required) {
            allComplete = false;
        }
        
        if (this.objectives.crystal && this.objectives.crystal.collected < this.objectives.crystal.required) {
            allComplete = false;
        }
        
        if (this.objectives.fuel && this.objectives.fuel.collected < this.objectives.fuel.required) {
            allComplete = false;
        }
        
        if (this.objectives.rescuePods && this.objectives.rescuePods.rescued < this.objectives.rescuePods.required) {
            allComplete = false;
        }
        
        if (allComplete) {
            this.levelComplete();
        }
    }
    
    levelComplete() {
        // If already completed, don't trigger again
        if (this.hasWon) return;
        this.hasWon = true;
        
        // Pause the game
        this.scene.pause();
        
        // Create level complete overlay
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Create overlay
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7);
        overlay.setOrigin(0);
        overlay.setScrollFactor(0);
        
        // Create level complete text
        const titleText = this.add.text(width / 2, height / 2 - 100, 'LEVEL COMPLETE!', {
            fontFamily: 'Arial',
            fontSize: '48px',
            fontStyle: 'bold',
            color: '#00ff00'
        });
        titleText.setOrigin(0.5);
        titleText.setScrollFactor(0);
        
        // Create message
        const messageText = this.add.text(width / 2, height / 2, 'You have successfully completed all objectives!', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff',
            align: 'center'
        });
        messageText.setOrigin(0.5);
        messageText.setScrollFactor(0);
        
        // Create next level button
        const nextButton = this.add.image(width / 2, height / 2 + 80, 'button');
        nextButton.setScale(1.5);
        nextButton.setScrollFactor(0);
        
        const nextText = this.add.text(width / 2, height / 2 + 80, 'NEXT LEVEL', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff'
        });
        nextText.setOrigin(0.5);
        nextText.setScrollFactor(0);
        
        // Create main menu button
        const menuButton = this.add.image(width / 2, height / 2 + 150, 'button');
        menuButton.setScale(1.5);
        menuButton.setScrollFactor(0);
        
        const menuText = this.add.text(width / 2, height / 2 + 150, 'MAIN MENU', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff'
        });
        menuText.setOrigin(0.5);
        menuText.setScrollFactor(0);
        
        // Make buttons interactive
        nextButton.setInteractive();
        
        nextButton.on('pointerover', () => {
            nextButton.setTexture('button-hover');
        });
        
        nextButton.on('pointerout', () => {
            nextButton.setTexture('button');
        });
        
        nextButton.on('pointerdown', () => {
            // Go to next level
            const nextLevel = this.currentLevel + 1;
            this.scene.start('StoryIntroScene', { level: nextLevel });
        });
        
        menuButton.setInteractive();
        
        menuButton.on('pointerover', () => {
            menuButton.setTexture('button-hover');
        });
        
        menuButton.on('pointerout', () => {
            menuButton.setTexture('button');
        });
        
        menuButton.on('pointerdown', () => {
            // Go to main menu
            this.scene.start('MainMenuScene');
        });
    }
} 