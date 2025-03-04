import Phaser from 'phaser';

export class StoryIntroScene extends Phaser.Scene {
    constructor() {
        super('StoryIntroScene');
    }
    
    create() {
        // Get the center coordinates
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Create starry background
        const background = this.add.tileSprite(0, 0, width, height, 'background');
        background.setOrigin(0);
        
        // Add parallax stars
        this.stars1 = this.add.tileSprite(0, 0, width, height, 'stars-parallax-1');
        this.stars1.setOrigin(0);
        this.stars1.setAlpha(0.7);
        
        this.stars2 = this.add.tileSprite(0, 0, width, height, 'stars-parallax-2');
        this.stars2.setOrigin(0);
        this.stars2.setAlpha(0.5);
        
        // Add a semi-transparent overlay for better text visibility
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.5);
        overlay.setOrigin(0);
        
        // Add title
        const titleText = this.add.text(width / 2, 80, 'THE FRACTURE', {
            fontFamily: 'Arial',
            fontSize: '48px',
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: '#3498db',
            strokeThickness: 4,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000',
                blur: 5,
                fill: true
            }
        });
        titleText.setOrigin(0.5);
        
        // Add story text
        const storyText = this.add.text(width / 2, 200, 
            'In the year 2157, a catastrophic event known as "The Fracture" tore\n' +
            'through the Proxima Centauri star system, a once-thriving human colony.\n\n' +
            'You are Commander Elara Vega, a former rescue pilot for the Proxima Colonial Authority.\n' +
            'When The Fracture occurred, you were on a routine patrol in your salvage vessel,\n' +
            'the "Starfinder." The shockwave damaged your ship\'s systems, leaving you stranded\n' +
            'at the edge of the system with limited resources.\n\n' +
            'After three months of drifting and making emergency repairs, you\'re finally able\n' +
            'to navigate back toward the heart of the colony—only to find it unrecognizable.', 
            {
                fontFamily: 'Arial',
                fontSize: '20px',
                color: '#ffffff',
                align: 'center',
                lineSpacing: 10
            }
        );
        storyText.setOrigin(0.5);
        
        // Add level title
        const levelTitle = this.add.text(width / 2, height - 220, 'LEVEL 1: THE OUTER RIM', {
            fontFamily: 'Arial',
            fontSize: '32px',
            fontStyle: 'bold',
            color: '#3498db',
            stroke: '#000000',
            strokeThickness: 2
        });
        levelTitle.setOrigin(0.5);
        
        // Add level description
        const levelText = this.add.text(width / 2, height - 170, 
            'Your ship\'s systems are barely functioning. You need to repair essential components\n' +
            'by collecting resources from the debris surrounding you.\n\n' +
            'OBJECTIVE: Collect 10 metal and 5 fuel to repair your basic systems.',
            {
                fontFamily: 'Arial',
                fontSize: '20px',
                color: '#ffffff',
                align: 'center'
            }
        );
        levelText.setOrigin(0.5);
        
        // Create start level button
        const startButton = this.add.image(width / 2, height - 60, 'button');
        startButton.setScale(2);
        
        const startText = this.add.text(width / 2, height - 60, 'START MISSION', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff'
        });
        startText.setOrigin(0.5);
        
        // Add a glow effect to the button
        const buttonGlow = this.add.graphics();
        buttonGlow.fillStyle(0x3498db, 0.3);
        buttonGlow.fillRoundedRect(width / 2 - 120, height - 80, 240, 40, 10);
        
        // Make button interactive
        startButton.setInteractive();
        
        startButton.on('pointerover', () => {
            startButton.setTexture('button-hover');
            buttonGlow.clear();
            buttonGlow.fillStyle(0x3498db, 0.5);
            buttonGlow.fillRoundedRect(width / 2 - 120, height - 80, 240, 40, 10);
        });
        
        startButton.on('pointerout', () => {
            startButton.setTexture('button');
            buttonGlow.clear();
            buttonGlow.fillStyle(0x3498db, 0.3);
            buttonGlow.fillRoundedRect(width / 2 - 120, height - 80, 240, 40, 10);
        });
        
        startButton.on('pointerdown', () => {
            this.sound.play('button-click');
            this.cameras.main.fadeOut(500);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                // Start the game scene with level 1 parameters
                this.scene.start('GameScene', { level: 1 });
            });
        });
        
        // Add small ship images for visual interest
        const ship1 = this.add.image(width * 0.1, height * 0.3, 'ship');
        ship1.setAlpha(0.6);
        ship1.setRotation(0.2);
        ship1.setScale(0.8);
        
        const ship2 = this.add.image(width * 0.9, height * 0.7, 'ship');
        ship2.setAlpha(0.6);
        ship2.setRotation(-0.3);
        ship2.setFlipX(true);
        ship2.setScale(0.8);
        
        // Fade in the scene
        this.cameras.main.fadeIn(1000);
    }
    
    update() {
        // Animate stars for parallax effect
        this.stars1.tilePositionX += 0.1;
        this.stars2.tilePositionX += 0.2;
    }
} 