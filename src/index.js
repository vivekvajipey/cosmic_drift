import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { MainMenuScene } from './scenes/MainMenuScene';
import { GameScene } from './scenes/GameScene';
import { UpgradeScene } from './scenes/UpgradeScene';
import { StoryIntroScene } from './scenes/StoryIntroScene';

// Game configuration
const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    },
    scene: [
        BootScene,
        PreloadScene,
        MainMenuScene,
        StoryIntroScene,
        GameScene,
        UpgradeScene
    ],
    pixelArt: true,
    backgroundColor: '#000000'
};

// Create the game instance
const game = new Phaser.Game(config);

// Expose game for debugging purposes
window.game = game; 