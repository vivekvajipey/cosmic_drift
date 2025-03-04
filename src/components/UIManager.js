import Phaser from 'phaser';

export class UIManager {
    constructor(scene, ship) {
        this.scene = scene;
        this.ship = ship;
        
        // Get screen dimensions
        this.width = scene.cameras.main.width;
        this.height = scene.cameras.main.height;
        
        this.createUI();
    }
    
    createUI() {
        // Create UI panel
        this.panel = this.scene.add.image(this.width / 2, this.height - 50, 'ui-panel');
        this.panel.setOrigin(0.5, 0.5);
        this.panel.setScale(2, 0.8);
        this.panel.setScrollFactor(0);
        
        // Create fuel gauge
        this.fuelBackground = this.scene.add.rectangle(130, this.height - 50, 150, 25, 0x555555);
        this.fuelBackground.setOrigin(0, 0.5);
        this.fuelBackground.setScrollFactor(0);
        
        this.fuelBar = this.scene.add.rectangle(130, this.height - 50, 150, 25, 0xffaa00);
        this.fuelBar.setOrigin(0, 0.5);
        this.fuelBar.setScrollFactor(0);
        
        this.fuelLabel = this.scene.add.text(80, this.height - 50, 'FUEL', {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#ffffff'
        });
        this.fuelLabel.setOrigin(0.5);
        this.fuelLabel.setScrollFactor(0);
        
        // Create cargo gauge
        this.cargoBackground = this.scene.add.rectangle(380, this.height - 50, 150, 25, 0x555555);
        this.cargoBackground.setOrigin(0, 0.5);
        this.cargoBackground.setScrollFactor(0);
        
        this.cargoBar = this.scene.add.rectangle(380, this.height - 50, 150, 25, 0x55ff55);
        this.cargoBar.setOrigin(0, 0.5);
        this.cargoBar.setScrollFactor(0);
        
        this.cargoLabel = this.scene.add.text(330, this.height - 50, 'CARGO', {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#ffffff'
        });
        this.cargoLabel.setOrigin(0.5);
        this.cargoLabel.setScrollFactor(0);
        
        // Create resource counters
        this.metalCounter = this.scene.add.text(600, this.height - 65, 'METAL: 0', {
            fontFamily: 'Arial',
            fontSize: '14px',
            color: '#aaaaaa'
        });
        this.metalCounter.setScrollFactor(0);
        
        this.crystalCounter = this.scene.add.text(600, this.height - 45, 'CRYSTAL: 0', {
            fontFamily: 'Arial',
            fontSize: '14px',
            color: '#55aaff'
        });
        this.crystalCounter.setScrollFactor(0);
        
        this.artifactCounter = this.scene.add.text(600, this.height - 25, 'ARTIFACTS: 0', {
            fontFamily: 'Arial',
            fontSize: '14px',
            color: '#aa00ff'
        });
        this.artifactCounter.setScrollFactor(0);
        
        // Create minimap
        this.minimapBackground = this.scene.add.rectangle(this.width - 100, 100, 180, 180, 0x000000);
        this.minimapBackground.setOrigin(0.5);
        this.minimapBackground.setScrollFactor(0);
        this.minimapBackground.setAlpha(0.7);
        this.minimapBackground.setStrokeStyle(2, 0xffffff);
        
        // Create player indicator on minimap
        this.playerIndicator = this.scene.add.circle(this.width - 100, 100, 3, 0xffffff);
        this.playerIndicator.setScrollFactor(0);
        
        // Create upgrade button
        this.upgradeButton = this.scene.add.image(this.width - 100, this.height - 50, 'button');
        this.upgradeButton.setScrollFactor(0);
        
        this.upgradeText = this.scene.add.text(this.width - 100, this.height - 50, 'UPGRADE', {
            fontFamily: 'Arial',
            fontSize: '14px',
            color: '#ffffff'
        });
        this.upgradeText.setOrigin(0.5);
        this.upgradeText.setScrollFactor(0);
        
        // Make upgrade button interactive
        this.upgradeButton.setInteractive();
        
        this.upgradeButton.on('pointerover', () => {
            this.upgradeButton.setTexture('button-hover');
        });
        
        this.upgradeButton.on('pointerout', () => {
            this.upgradeButton.setTexture('button');
        });
        
        this.upgradeButton.on('pointerdown', () => {
            // Open upgrade scene
            this.scene.scene.launch('UpgradeScene', { ship: this.ship });
            this.scene.scene.pause();
        });
        
        // Add hints for keyboard shortcuts
        this.upgradeHint = this.scene.add.text(this.width - 100, this.height - 20, '(E)', {
            fontFamily: 'Arial',
            fontSize: '12px',
            color: '#aaaaaa'
        });
        this.upgradeHint.setOrigin(0.5);
        this.upgradeHint.setScrollFactor(0);
        
        this.resourceHint = this.scene.add.text(750, this.height - 45, '(SPACE to collect)', {
            fontFamily: 'Arial',
            fontSize: '12px',
            color: '#aaaaaa'
        });
        this.resourceHint.setScrollFactor(0);
        
        // Create pause button
        this.pauseButton = this.scene.add.image(30, 30, 'button');
        this.pauseButton.setScale(0.7);
        this.pauseButton.setScrollFactor(0);
        
        this.pauseText = this.scene.add.text(30, 30, 'PAUSE', {
            fontFamily: 'Arial',
            fontSize: '12px',
            color: '#ffffff'
        });
        this.pauseText.setOrigin(0.5);
        this.pauseText.setScrollFactor(0);
        
        // Make pause button interactive
        this.pauseButton.setInteractive();
        
        this.pauseButton.on('pointerover', () => {
            this.pauseButton.setTexture('button-hover');
        });
        
        this.pauseButton.on('pointerout', () => {
            this.pauseButton.setTexture('button');
        });
        
        this.pauseButton.on('pointerdown', () => {
            this.showPauseMenu();
        });
        
        // Add hint for keyboard shortcut
        this.pauseHint = this.scene.add.text(30, 50, '(ESC)', {
            fontFamily: 'Arial',
            fontSize: '10px',
            color: '#aaaaaa'
        });
        this.pauseHint.setOrigin(0.5);
        this.pauseHint.setScrollFactor(0);
    }
    
    update(worldBounds, sectorGenerator) {
        // Update fuel bar
        const fuelPercent = this.ship.fuel / this.ship.maxFuel;
        this.fuelBar.width = 150 * fuelPercent;
        
        // Update fuel bar color based on level
        if (fuelPercent < 0.2) {
            this.fuelBar.setFillStyle(0xff0000);
        } else if (fuelPercent < 0.5) {
            this.fuelBar.setFillStyle(0xffff00);
        } else {
            this.fuelBar.setFillStyle(0xffaa00);
        }
        
        // Update cargo bar
        const cargoPercent = this.ship.cargo / (this.ship.maxCargo * this.ship.upgrades.cargoCapacity);
        this.cargoBar.width = 150 * cargoPercent;
        
        // Update cargo bar color based on level
        if (cargoPercent > 0.9) {
            this.cargoBar.setFillStyle(0xff0000);
        } else if (cargoPercent > 0.7) {
            this.cargoBar.setFillStyle(0xffff00);
        } else {
            this.cargoBar.setFillStyle(0x55ff55);
        }
        
        // Update resource counters
        this.metalCounter.setText(`METAL: ${this.ship.resources.metal}`);
        this.crystalCounter.setText(`CRYSTAL: ${this.ship.resources.crystal}`);
        this.artifactCounter.setText(`ARTIFACTS: ${this.ship.resources.artifacts}`);
        
        // Update minimap
        // Calculate positions on minimap based on world bounds
        const minimapScale = 180 / worldBounds.width;
        
        // Update player position on minimap
        this.playerIndicator.x = this.width - 100 - 90 + (this.ship.sprite.x * minimapScale);
        this.playerIndicator.y = 100 - 90 + (this.ship.sprite.y * minimapScale);
        
        // Only show nearby resources on minimap if they're active
        sectorGenerator.getResources().forEach(resource => {
            if (resource.sprite.active) {
                // Create a resource indicator if it doesn't exist
                if (!resource.minimapIndicator) {
                    const color = resource.type === 'metal' ? 0xaaaaaa :
                                 resource.type === 'crystal' ? 0x55aaff :
                                 resource.type === 'fuel' ? 0xffaa00 : 0xaa00ff;
                    
                    resource.minimapIndicator = this.scene.add.rectangle(
                        this.width - 100 - 90 + (resource.sprite.x * minimapScale),
                        100 - 90 + (resource.sprite.y * minimapScale),
                        2, 2, color
                    );
                    resource.minimapIndicator.setScrollFactor(0);
                }
                
                // Update position
                resource.minimapIndicator.x = this.width - 100 - 90 + (resource.sprite.x * minimapScale);
                resource.minimapIndicator.y = 100 - 90 + (resource.sprite.y * minimapScale);
                resource.minimapIndicator.setVisible(true);
            } else if (resource.minimapIndicator) {
                resource.minimapIndicator.setVisible(false);
            }
        });
    }
    
    showPauseMenu() {
        // Pause the game
        this.scene.scene.pause();
        
        // Create pause menu scene overlay
        const pauseMenu = this.scene.scene.add('PauseMenu', {
            create: function() {
                // Get center coordinates
                const width = this.cameras.main.width;
                const height = this.cameras.main.height;
                
                // Create a semi-transparent background
                const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7);
                overlay.setOrigin(0);
                
                // Create pause menu text
                const titleText = this.add.text(width / 2, height / 2 - 100, 'GAME PAUSED', {
                    fontFamily: 'Arial',
                    fontSize: '48px',
                    fontStyle: 'bold',
                    color: '#ffffff'
                });
                titleText.setOrigin(0.5);
                
                // Create resume button
                const resumeButton = this.add.image(width / 2, height / 2, 'button');
                resumeButton.setScale(2);
                
                const resumeText = this.add.text(width / 2, height / 2, 'RESUME', {
                    fontFamily: 'Arial',
                    fontSize: '24px',
                    color: '#ffffff'
                });
                resumeText.setOrigin(0.5);
                
                // Make resume button interactive
                resumeButton.setInteractive();
                
                resumeButton.on('pointerover', () => {
                    resumeButton.setTexture('button-hover');
                });
                
                resumeButton.on('pointerout', () => {
                    resumeButton.setTexture('button');
                });
                
                resumeButton.on('pointerdown', () => {
                    // Return to the game
                    this.scene.resume('GameScene');
                    this.scene.stop();
                });
                
                // Create main menu button
                const menuButton = this.add.image(width / 2, height / 2 + 80, 'button');
                menuButton.setScale(2);
                
                const menuText = this.add.text(width / 2, height / 2 + 80, 'MAIN MENU', {
                    fontFamily: 'Arial',
                    fontSize: '24px',
                    color: '#ffffff'
                });
                menuText.setOrigin(0.5);
                
                // Make menu button interactive
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
                
                // Handle ESC key to resume
                this.input.keyboard.on('keydown-ESC', () => {
                    this.scene.resume('GameScene');
                    this.scene.stop();
                });
            }
        });
        
        pauseMenu.scene.start();
    }
    
    showResourceCollectionHint(resources) {
        // Show hint when resources are nearby
        const nearbyResource = resources.find(resource => resource.isInRange(this.ship));
        
        if (nearbyResource) {
            if (!this.collectionHint) {
                this.collectionHint = this.scene.add.text(this.width / 2, this.height - 100, 'Press SPACE to collect resources', {
                    fontFamily: 'Arial',
                    fontSize: '18px',
                    color: '#ffffff',
                    backgroundColor: '#000000',
                    padding: { x: 10, y: 5 }
                });
                this.collectionHint.setOrigin(0.5);
                this.collectionHint.setScrollFactor(0);
                this.collectionHint.setAlpha(0);
                
                this.scene.tweens.add({
                    targets: this.collectionHint,
                    alpha: 1,
                    duration: 200
                });
            }
        } else if (this.collectionHint) {
            this.scene.tweens.add({
                targets: this.collectionHint,
                alpha: 0,
                duration: 200,
                onComplete: () => {
                    if (this.collectionHint) {
                        this.collectionHint.destroy();
                        this.collectionHint = null;
                    }
                }
            });
        }
    }
    
    destroy() {
        // Clean up all UI elements
        [
            this.panel, this.fuelBackground, this.fuelBar, this.fuelLabel,
            this.cargoBackground, this.cargoBar, this.cargoLabel,
            this.metalCounter, this.crystalCounter, this.artifactCounter,
            this.minimapBackground, this.playerIndicator,
            this.upgradeButton, this.upgradeText, this.upgradeHint,
            this.resourceHint, this.pauseButton, this.pauseText, this.pauseHint
        ].forEach(element => {
            if (element) element.destroy();
        });
        
        // Clean up resource indicators on minimap
        if (this.resources) {
            this.resources.forEach(resource => {
                if (resource.minimapIndicator) {
                    resource.minimapIndicator.destroy();
                }
            });
        }
        
        if (this.collectionHint) {
            this.collectionHint.destroy();
        }
    }
} 