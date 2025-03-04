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
        
        // Add parallax stars with improved layering
        this.stars1 = this.add.tileSprite(0, 0, width, height, 'stars-parallax-1');
        this.stars1.setOrigin(0);
        this.stars1.setAlpha(0.8);
        
        this.stars2 = this.add.tileSprite(0, 0, width, height, 'stars-parallax-2');
        this.stars2.setOrigin(0);
        this.stars2.setAlpha(0.6);
        
        // Create a container for title elements
        const titleContainer = this.add.container(width / 2, height / 2 - 170);
        
        // Add decorative ships on each side of the title
        const leftShip = this.add.image(-300, 30, 'ship');
        leftShip.setScale(1.5);
        leftShip.setFlipX(true);
        leftShip.setRotation(-0.2);
        
        const rightShip = this.add.image(300, 30, 'ship');
        rightShip.setScale(1.5);
        rightShip.setRotation(0.2);
        
        // Add ship upgraded variants further in the background
        const farLeftShip = this.add.image(-350, -50, 'ship-upgraded-1');
        farLeftShip.setScale(1.2);
        farLeftShip.setAlpha(0.7);
        farLeftShip.setRotation(-0.3);
        
        const farRightShip = this.add.image(350, -50, 'ship-upgraded-2');
        farRightShip.setScale(1.2);
        farRightShip.setAlpha(0.7);
        farRightShip.setRotation(0.3);
        
        // Create a glow effect behind the title
        const titleGlow = this.add.graphics();
        titleGlow.fillStyle(0x3498db, 0.3);
        titleGlow.fillCircle(0, 0, 250);
        
        // Add game title with improved styling
        const titleText = this.add.text(0, 0, 'COSMIC DRIFT', {
            fontFamily: 'Arial',
            fontSize: '76px',
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: '#3498db',
            strokeThickness: 6,
            shadow: {
                offsetX: 3,
                offsetY: 3,
                color: '#000',
                blur: 10,
                fill: true
            }
        });
        titleText.setOrigin(0.5);
        
        // Add subtitle with improved styling
        const subtitleText = this.add.text(0, 70, 'Space Salvage Adventure', {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#cccccc',
            stroke: '#000000',
            strokeThickness: 2
        });
        subtitleText.setOrigin(0.5);
        
        // Add elements to the title container
        titleContainer.add([titleGlow, farLeftShip, farRightShip, leftShip, rightShip, titleText, subtitleText]);
        
        // Animate the title container
        this.tweens.add({
            targets: titleContainer,
            y: height / 2 - 160,
            duration: 2000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
        
        // Create glowing effects for buttons
        const createButtonGlow = (x, y, scale = 2) => {
            const glow = this.add.graphics();
            glow.fillStyle(0x3498db, 0.3);
            glow.fillRoundedRect(x - 120 * scale / 2, y - 40 * scale / 2, 120 * scale, 40 * scale, 10);
            return glow;
        };
        
        // Create a group for the start button elements
        const startButtonGroup = this.add.container(width / 2, height / 2 + 40);
        const startButtonGlow = createButtonGlow(0, 0);
        
        // Create start game button with improved styling
        const startButton = this.add.image(0, 0, 'button');
        startButton.setScale(2);
        
        const startText = this.add.text(0, 0, 'START GAME', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 1
        });
        startText.setOrigin(0.5);
        
        startButtonGroup.add([startButtonGlow, startButton, startText]);
        
        // Create a group for the instructions button elements
        const instructionsButtonGroup = this.add.container(width / 2, height / 2 + 120);
        const instructionsButtonGlow = createButtonGlow(0, 0);
        
        // Create instructions button with improved styling
        const instructionsButton = this.add.image(0, 0, 'button');
        instructionsButton.setScale(2);
        
        const instructionsText = this.add.text(0, 0, 'INSTRUCTIONS', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 1
        });
        instructionsText.setOrigin(0.5);
        
        instructionsButtonGroup.add([instructionsButtonGlow, instructionsButton, instructionsText]);
        
        // Add floating animation to the buttons
        this.tweens.add({
            targets: [startButtonGroup, instructionsButtonGroup],
            y: '+=10',
            duration: 1500,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1,
            delay: function(i) { return i * 200; }
        });
        
        // Add decorative elements to the scene
        // Add some asteroids in the background
        const asteroid1 = this.add.image(width * 0.1, height * 0.8, 'asteroid-medium');
        asteroid1.setScale(1.5);
        asteroid1.setAlpha(0.5);
        this.tweens.add({
            targets: asteroid1,
            angle: 360,
            duration: 50000,
            repeat: -1
        });
        
        const asteroid2 = this.add.image(width * 0.9, height * 0.2, 'asteroid-small');
        asteroid2.setScale(1.2);
        asteroid2.setAlpha(0.5);
        this.tweens.add({
            targets: asteroid2,
            angle: -360,
            duration: 40000,
            repeat: -1
        });
        
        // Make the buttons interactive
        startButton.setInteractive();
        
        startButton.on('pointerover', () => {
            startButton.setTexture('button-hover');
            startButtonGlow.clear();
            startButtonGlow.fillStyle(0x3498db, 0.5);
            startButtonGlow.fillRoundedRect(-120, -40, 240, 80, 10);
            this.tweens.add({
                targets: startButtonGroup,
                scale: 1.05,
                duration: 100
            });
        });
        
        startButton.on('pointerout', () => {
            startButton.setTexture('button');
            startButtonGlow.clear();
            startButtonGlow.fillStyle(0x3498db, 0.3);
            startButtonGlow.fillRoundedRect(-120, -40, 240, 80, 10);
            this.tweens.add({
                targets: startButtonGroup,
                scale: 1,
                duration: 100
            });
        });
        
        startButton.on('pointerdown', () => {
            this.sound.play('button-click');
            this.cameras.main.fadeOut(500);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('GameScene');
            });
        });
        
        // Make the instructions button interactive
        instructionsButton.setInteractive();
        
        instructionsButton.on('pointerover', () => {
            instructionsButton.setTexture('button-hover');
            instructionsButtonGlow.clear();
            instructionsButtonGlow.fillStyle(0x3498db, 0.5);
            instructionsButtonGlow.fillRoundedRect(-120, -40, 240, 80, 10);
            this.tweens.add({
                targets: instructionsButtonGroup,
                scale: 1.05,
                duration: 100
            });
        });
        
        instructionsButton.on('pointerout', () => {
            instructionsButton.setTexture('button');
            instructionsButtonGlow.clear();
            instructionsButtonGlow.fillStyle(0x3498db, 0.3);
            instructionsButtonGlow.fillRoundedRect(-120, -40, 240, 80, 10);
            this.tweens.add({
                targets: instructionsButtonGroup,
                scale: 1,
                duration: 100
            });
        });
        
        instructionsButton.on('pointerdown', () => {
            this.sound.play('button-click');
            this.showInstructions();
        });
        
        // Add version info at the bottom
        this.add.text(width - 10, height - 10, 'v1.0', {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#555555'
        }).setOrigin(1, 1);
        
        // Start playing the theme music
        if (!this.sound.get('theme')) {
            this.sound.add('theme', { loop: true, volume: 0.5 });
        }
        if (!this.sound.isPlaying('theme')) {
            this.sound.play('theme');
        }
        
        // Add sound effect for buttons
        if (!this.sound.get('button-click')) {
            this.sound.add('button-click', { volume: 0.5 });
        }
        
        // Add fade-in effect
        this.cameras.main.fadeIn(1000);
    }
    
    update() {
        // Animate the stars for parallax effect with different speeds
        this.stars1.tilePositionX += 0.1;
        this.stars1.tilePositionY += 0.05;
        this.stars2.tilePositionX += 0.2;
    }
    
    showInstructions() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Create a semi-transparent background
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.8);
        overlay.setOrigin(0);
        
        // Add transition effect
        overlay.alpha = 0;
        this.tweens.add({
            targets: overlay,
            alpha: 0.8,
            duration: 300
        });
        
        // Create the instructions container
        const instructionsContainer = this.add.container(width / 2, height / 2);
        instructionsContainer.setAlpha(0);
        
        // Create the instructions panel
        const panel = this.add.image(0, 0, 'ui-panel');
        panel.setScale(4);
        
        // Add decorative ship at the top
        const shipIcon = this.add.image(0, -180, 'ship');
        shipIcon.setScale(1.2);
        
        // Add instructions title with improved styling
        const titleText = this.add.text(0, -120, 'INSTRUCTIONS', {
            fontFamily: 'Arial',
            fontSize: '36px',
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: '#3498db',
            strokeThickness: 4
        });
        titleText.setOrigin(0.5);
        
        // Add control instructions with improved styling
        const instructionsText = this.add.text(0, 0, 
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
                align: 'center',
                stroke: '#000000',
                strokeThickness: 1,
                lineSpacing: 10
            }
        );
        instructionsText.setOrigin(0.5);
        
        // Add back button with glow effect
        const backButtonGlow = this.add.graphics();
        backButtonGlow.fillStyle(0x3498db, 0.3);
        backButtonGlow.fillRoundedRect(-60, 120, 120, 40, 10);
        
        const backButton = this.add.image(0, 140, 'button');
        
        const backText = this.add.text(0, 140, 'BACK', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 1
        });
        backText.setOrigin(0.5);
        
        // Add elements to the instructions container
        instructionsContainer.add([panel, shipIcon, titleText, instructionsText, backButtonGlow, backButton, backText]);
        
        // Add animation for the instructions container
        this.tweens.add({
            targets: instructionsContainer,
            alpha: 1,
            y: height / 2,
            duration: 500,
            ease: 'Back.easeOut'
        });
        
        // Add floating animation to the ship icon
        this.tweens.add({
            targets: shipIcon,
            y: '-=10',
            duration: 2000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
        
        // Make the back button interactive
        backButton.setInteractive();
        
        backButton.on('pointerover', () => {
            backButton.setTexture('button-hover');
            backButtonGlow.clear();
            backButtonGlow.fillStyle(0x3498db, 0.5);
            backButtonGlow.fillRoundedRect(-60, 120, 120, 40, 10);
        });
        
        backButton.on('pointerout', () => {
            backButton.setTexture('button');
            backButtonGlow.clear();
            backButtonGlow.fillStyle(0x3498db, 0.3);
            backButtonGlow.fillRoundedRect(-60, 120, 120, 40, 10);
        });
        
        backButton.on('pointerdown', () => {
            this.sound.play('button-click');
            
            // Add fade-out animation
            this.tweens.add({
                targets: [overlay, instructionsContainer],
                alpha: 0,
                duration: 300,
                onComplete: () => {
                    // Remove all elements
                    overlay.destroy();
                    instructionsContainer.destroy();
                }
            });
        });
    }
} 