import Phaser from 'phaser';

export class UpgradeScene extends Phaser.Scene {
    constructor() {
        super('UpgradeScene');
    }

    init(data) {
        // Get the ship reference from the GameScene
        this.ship = data.ship;
    }

    create() {
        // Get center coordinates
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Create a semi-transparent background
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7);
        overlay.setOrigin(0);
        
        // Create upgrade menu panel
        const panel = this.add.image(width / 2, height / 2, 'ui-panel');
        panel.setScale(5);
        
        // Create title
        const titleText = this.add.text(width / 2, height / 2 - 200, 'SHIP UPGRADES', {
            fontFamily: 'Arial',
            fontSize: '36px',
            fontStyle: 'bold',
            color: '#ffffff'
        });
        titleText.setOrigin(0.5);
        
        // Show current resources
        const resourcesText = this.add.text(width / 2, height / 2 - 150, 
            `METAL: ${this.ship.resources.metal}   CRYSTAL: ${this.ship.resources.crystal}`, 
            {
                fontFamily: 'Arial',
                fontSize: '18px',
                color: '#ffffff'
            }
        );
        resourcesText.setOrigin(0.5);
        
        // Create upgrade options
        this.createUpgradeOptions(width, height);
        
        // Create close button
        const closeButton = this.add.image(width / 2, height / 2 + 220, 'button');
        closeButton.setScale(1.5);
        
        const closeText = this.add.text(width / 2, height / 2 + 220, 'CLOSE', {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#ffffff'
        });
        closeText.setOrigin(0.5);
        
        // Make close button interactive
        closeButton.setInteractive();
        
        closeButton.on('pointerover', () => {
            closeButton.setTexture('button-hover');
        });
        
        closeButton.on('pointerout', () => {
            closeButton.setTexture('button');
        });
        
        closeButton.on('pointerdown', () => {
            this.scene.resume('GameScene');
            this.scene.stop();
        });
        
        // Also close with ESC key
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.resume('GameScene');
            this.scene.stop();
        });
        
        // Add ship preview
        const shipPreview = this.add.image(width / 4, height / 2, this.getShipTexture());
        shipPreview.setScale(2);
        
        // Add rotation animation to the ship preview
        this.tweens.add({
            targets: shipPreview,
            angle: 360,
            duration: 20000,
            repeat: -1
        });
    }
    
    createUpgradeOptions(width, height) {
        const upgradeTypes = [
            {
                name: 'Cargo Capacity',
                key: 'cargoCapacity',
                description: 'Increases maximum cargo space',
                cost: { metal: 10, crystal: 5 },
                y: -50
            },
            {
                name: 'Fuel Efficiency',
                key: 'fuelEfficiency',
                description: 'Reduces fuel consumption during flight',
                cost: { metal: 5, crystal: 10 },
                y: 0
            },
            {
                name: 'Engine Power',
                key: 'enginePower',
                description: 'Increases thrust and maneuverability',
                cost: { metal: 15, crystal: 15 },
                y: 50
            },
            {
                name: 'Salvage Range',
                key: 'salvageRange',
                description: 'Extends resource collection range',
                cost: { metal: 10, crystal: 20 },
                y: 100
            }
        ];
        
        // Create upgrade buttons
        upgradeTypes.forEach(upgrade => {
            // Create upgrade button
            const button = this.add.image(width / 2, height / 2 + upgrade.y, 'button');
            button.setScale(2, 1);
            
            // Create upgrade text
            const text = this.add.text(width / 2 - 150, height / 2 + upgrade.y, upgrade.name, {
                fontFamily: 'Arial',
                fontSize: '16px',
                color: '#ffffff'
            });
            text.setOrigin(0, 0.5);
            
            // Create cost text
            const costText = this.add.text(width / 2 + 100, height / 2 + upgrade.y, 
                `Metal: ${upgrade.cost.metal}  Crystal: ${upgrade.cost.crystal}`, 
                {
                    fontFamily: 'Arial',
                    fontSize: '14px',
                    color: this.ship.canAffordUpgrade(upgrade.key) ? '#55ff55' : '#ff5555'
                }
            );
            costText.setOrigin(0.5);
            
            // Create level text
            const levelText = this.add.text(width / 2 + 200, height / 2 + upgrade.y, 
                `Level: ${Math.floor(this.ship.upgrades[upgrade.key] * 4)}`, 
                {
                    fontFamily: 'Arial',
                    fontSize: '14px',
                    color: '#ffffff'
                }
            );
            levelText.setOrigin(0.5);
            
            // Make button interactive
            button.setInteractive();
            
            button.on('pointerover', () => {
                button.setTexture('button-hover');
                
                // Show description
                if (!this.descriptionText) {
                    this.descriptionText = this.add.text(width / 2, height / 2 + 170, upgrade.description, {
                        fontFamily: 'Arial',
                        fontSize: '14px',
                        color: '#aaaaaa',
                        align: 'center'
                    });
                    this.descriptionText.setOrigin(0.5);
                } else {
                    this.descriptionText.setText(upgrade.description);
                }
            });
            
            button.on('pointerout', () => {
                button.setTexture('button');
                
                // Clear description
                if (this.descriptionText) {
                    this.descriptionText.setText('');
                }
            });
            
            button.on('pointerdown', () => {
                // Try to purchase the upgrade
                if (this.ship.purchaseUpgrade(upgrade.key)) {
                    // Update cost text color
                    costText.setColor(this.ship.canAffordUpgrade(upgrade.key) ? '#55ff55' : '#ff5555');
                    
                    // Update level text
                    levelText.setText(`Level: ${Math.floor(this.ship.upgrades[upgrade.key] * 4)}`);
                    
                    // Update resources text
                    this.updateResourcesText();
                }
            });
        });
    }
    
    updateResourcesText() {
        // Update the resources text at the top
        const resourcesText = this.children.list.find(child => 
            child.type === 'Text' && 
            child.text.includes('METAL:')
        );
        
        if (resourcesText) {
            resourcesText.setText(`METAL: ${this.ship.resources.metal}   CRYSTAL: ${this.ship.resources.crystal}`);
        }
    }
    
    getShipTexture() {
        // Return the appropriate ship texture based on upgrade level
        const upgradeTotal = this.ship.getUpgradeTotal();
        
        if (upgradeTotal >= 4) {
            return 'ship-upgraded-2';
        } else if (upgradeTotal >= 2) {
            return 'ship-upgraded-1';
        } else {
            return 'ship';
        }
    }
} 