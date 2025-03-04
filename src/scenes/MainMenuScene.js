import Phaser from 'phaser';

export class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('MainMenuScene');
    }

    create() {
        // Get the center coordinates
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Create a starry background
        const background = this.add.tileSprite(0, 0, width, height, 'background');
        background.setOrigin(0);
        
        // Add parallax stars
        this.stars1 = this.add.tileSprite(0, 0, width, height, 'stars-parallax-1');
        this.stars1.setOrigin(0);
        this.stars1.setAlpha(0.7);
        
        this.stars2 = this.add.tileSprite(0, 0, width, height, 'stars-parallax-2');
        this.stars2.setOrigin(0);
        this.stars2.setAlpha(0.5);
        
        // Add game title
        const titleText = this.add.text(width / 2, height / 2 - 150, 'COSMIC DRIFT', {
            fontFamily: 'Arial',
            fontSize: '64px',
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        });
        titleText.setOrigin(0.5);
        
        // Add subtitle
        const subtitleText = this.add.text(width / 2, height / 2 - 80, 'Space Salvage Adventure', {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#cccccc'
        });
        subtitleText.setOrigin(0.5);

        // Create start game button
        const startButton = this.add.image(width / 2, height / 2 + 40, 'button');
        startButton.setScale(2);
        
        const startText = this.add.text(width / 2, height / 2 + 40, 'START GAME', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff'
        });
        startText.setOrigin(0.5);
        
        // Make the button interactive
        startButton.setInteractive();
        
        startButton.on('pointerover', () => {
            startButton.setTexture('button-hover');
        });
        
        startButton.on('pointerout', () => {
            startButton.setTexture('button');
        });
        
        startButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
        
        // Create instructions button
        const instructionsButton = this.add.image(width / 2, height / 2 + 120, 'button');
        instructionsButton.setScale(2);
        
        const instructionsText = this.add.text(width / 2, height / 2 + 120, 'INSTRUCTIONS', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff'
        });
        instructionsText.setOrigin(0.5);
        
        // Make the button interactive
        instructionsButton.setInteractive();
        
        instructionsButton.on('pointerover', () => {
            instructionsButton.setTexture('button-hover');
        });
        
        instructionsButton.on('pointerout', () => {
            instructionsButton.setTexture('button');
        });
        
        instructionsButton.on('pointerdown', () => {
            this.showInstructions();
        });
        
        // Start playing the theme music
        if (!this.sound.get('theme')) {
            this.sound.add('theme', { loop: true, volume: 0.5 });
        }
        if (!this.sound.isPlaying('theme')) {
            this.sound.play('theme');
        }
    }
    
    update() {
        // Animate the stars for parallax effect
        this.stars1.tilePositionX += 0.1;
        this.stars2.tilePositionX += 0.2;
    }
    
    showInstructions() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Create a semi-transparent background
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7);
        overlay.setOrigin(0);
        
        // Create the instructions panel
        const panel = this.add.image(width / 2, height / 2, 'ui-panel');
        panel.setScale(4);
        
        // Add instructions title
        const titleText = this.add.text(width / 2, height / 2 - 150, 'INSTRUCTIONS', {
            fontFamily: 'Arial',
            fontSize: '36px',
            fontStyle: 'bold',
            color: '#ffffff'
        });
        titleText.setOrigin(0.5);
        
        // Add control instructions
        const instructionsText = this.add.text(width / 2, height / 2 - 50, 
            'ARROW KEYS: Control ship movement\n' +
            'SPACE: Collect resources (when in range)\n' +
            'E: Open upgrade menu\n' +
            'ESC: Pause game\n\n' +
            'Collect resources and upgrade your ship to\n' +
            'explore further into the cosmic drift.',
            {
                fontFamily: 'Arial',
                fontSize: '22px',
                color: '#ffffff',
                align: 'center'
            }
        );
        instructionsText.setOrigin(0.5);
        
        // Add back button
        const backButton = this.add.image(width / 2, height / 2 + 150, 'button');
        
        const backText = this.add.text(width / 2, height / 2 + 150, 'BACK', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff'
        });
        backText.setOrigin(0.5);
        
        // Make the back button interactive
        backButton.setInteractive();
        
        backButton.on('pointerover', () => {
            backButton.setTexture('button-hover');
        });
        
        backButton.on('pointerout', () => {
            backButton.setTexture('button');
        });
        
        backButton.on('pointerdown', () => {
            // Remove all elements
            overlay.destroy();
            panel.destroy();
            titleText.destroy();
            instructionsText.destroy();
            backButton.destroy();
            backText.destroy();
        });
    }
} 