import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Load minimal assets needed for the loading screen
        this.load.image('logo', 'assets/images/logo.svg');
        this.load.image('loading-bar', 'assets/images/loading-bar.svg');
        this.load.image('loading-bar-bg', 'assets/images/loading-bar-bg.svg');
    }

    create() {
        // Set some game settings
        this.scale.pageAlignHorizontally = true;
        
        // Transition to the Preload scene
        this.scene.start('PreloadScene');
    }
} 