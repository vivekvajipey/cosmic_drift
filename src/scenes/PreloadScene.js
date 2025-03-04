import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        // Create loading bar
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Add logo
        const logo = this.add.image(width / 2, height / 2 - 100, 'logo');
        logo.setScale(0.5);
        
        // Add progress bar
        const progressBarBg = this.add.image(width / 2, height / 2 + 50, 'loading-bar-bg');
        const progressBar = this.add.image(width / 2 - progressBarBg.width / 2, height / 2 + 50, 'loading-bar');
        progressBar.setOrigin(0, 0.5);
        
        // Create a loading text
        const loadingText = this.add.text(width / 2, height / 2 + 100, 'Loading...', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff'
        });
        loadingText.setOrigin(0.5);
        
        // Update the progress bar as assets are loaded
        this.load.on('progress', (value) => {
            progressBar.displayWidth = value * progressBarBg.width;
            loadingText.setText(`Loading... ${Math.floor(value * 100)}%`);
        });
        
        // Clean up when loading completes
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBarBg.destroy();
            loadingText.destroy();
        });
        
        // Load all game assets
        
        // Ship assets
        this.load.image('ship', 'assets/images/ship.svg');
        this.load.image('ship-upgraded-1', 'assets/images/ship-upgraded-1.svg');
        this.load.image('ship-upgraded-2', 'assets/images/ship-upgraded-2.svg');
        
        // Space environment
        this.load.image('background', 'assets/images/space-background.svg');
        this.load.image('stars-parallax-1', 'assets/images/stars-parallax-1.svg');
        this.load.image('stars-parallax-2', 'assets/images/stars-parallax-2.svg');
        
        // Resource assets
        this.load.image('asteroid-small', 'assets/images/asteroid-small.svg');
        this.load.image('asteroid-medium', 'assets/images/asteroid-medium.svg');
        this.load.image('asteroid-large', 'assets/images/asteroid-large.svg');
        this.load.image('debris-1', 'assets/images/debris-1.svg');
        this.load.image('debris-2', 'assets/images/debris-2.svg');
        this.load.image('abandoned-ship', 'assets/images/abandoned-ship.svg');
        this.load.image('station', 'assets/images/station.svg');
        
        // Resource pickups
        this.load.image('metal', 'assets/images/metal.svg');
        this.load.image('crystal', 'assets/images/crystal.svg');
        this.load.image('fuel', 'assets/images/fuel.svg');
        this.load.image('artifact', 'assets/images/artifact.svg');
        
        // UI elements
        this.load.image('ui-panel', 'assets/images/ui-panel.svg');
        this.load.image('button', 'assets/images/button.svg');
        this.load.image('button-hover', 'assets/images/button-hover.svg');
        this.load.image('fuel-gauge', 'assets/images/fuel-gauge.svg');
        this.load.image('cargo-gauge', 'assets/images/cargo-gauge.svg');
        
        // Audio
        this.load.audio('theme', 'assets/audio/theme.mp3');
        this.load.audio('engine', 'assets/audio/engine.mp3');
        this.load.audio('collect', 'assets/audio/collect.mp3');
        this.load.audio('upgrade', 'assets/audio/upgrade.mp3');
        this.load.audio('alert', 'assets/audio/alert.mp3');
        this.load.audio('collision', 'assets/audio/collision.mp3');
    }

    create() {
        // Transition to the main menu
        this.scene.start('MainMenuScene');
    }
} 