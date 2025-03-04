const fs = require('fs');
const path = require('path');

// Define directories
const imagesDir = path.join(__dirname, 'src', 'assets', 'images');
const audioDir = path.join(__dirname, 'src', 'assets', 'audio');

// Ensure directories exist
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}
if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
}

// Simple function to create a placeholder SVG
function createSvgPlaceholder(width, height, color, text) {
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${color}"/>
        <text x="50%" y="50%" font-family="Arial" font-size="16" fill="white" text-anchor="middle" dominant-baseline="middle">${text}</text>
    </svg>`;
}

// Function to create an empty audio file (silent MP3)
function createEmptyAudio() {
    // This is just a minimal valid MP3 file (essentially silence)
    return Buffer.from('SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAACAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1f///////////////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQxAADwAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=', 'base64');
}

// List of required image assets
const requiredImages = [
    { filename: 'logo.png', width: 400, height: 200, color: '#3498db', text: 'COSMIC DRIFT' },
    { filename: 'loading-bar.png', width: 300, height: 30, color: '#2ecc71', text: '' },
    { filename: 'loading-bar-bg.png', width: 300, height: 30, color: '#34495e', text: '' },
    { filename: 'ship.png', width: 64, height: 64, color: '#e74c3c', text: 'SHIP' },
    { filename: 'ship-upgraded-1.png', width: 64, height: 64, color: '#e67e22', text: 'SHIP+' },
    { filename: 'ship-upgraded-2.png', width: 64, height: 64, color: '#f1c40f', text: 'SHIP++' },
    { filename: 'space-background.png', width: 1024, height: 1024, color: '#000000', text: '' },
    { filename: 'stars-parallax-1.png', width: 1024, height: 1024, color: '#00000000', text: '✦ ✧ ✦' },
    { filename: 'stars-parallax-2.png', width: 1024, height: 1024, color: '#00000000', text: '★ ☆ ★' },
    { filename: 'asteroid-small.png', width: 32, height: 32, color: '#7f8c8d', text: 'AST' },
    { filename: 'asteroid-medium.png', width: 48, height: 48, color: '#7f8c8d', text: 'AST' },
    { filename: 'asteroid-large.png', width: 64, height: 64, color: '#7f8c8d', text: 'AST' },
    { filename: 'debris-1.png', width: 48, height: 48, color: '#95a5a6', text: 'DBR' },
    { filename: 'debris-2.png', width: 56, height: 56, color: '#95a5a6', text: 'DBR' },
    { filename: 'abandoned-ship.png', width: 96, height: 96, color: '#9b59b6', text: 'SHIP' },
    { filename: 'station.png', width: 128, height: 128, color: '#3498db', text: 'STATION' },
    { filename: 'metal.png', width: 24, height: 24, color: '#7f8c8d', text: 'M' },
    { filename: 'crystal.png', width: 24, height: 24, color: '#3498db', text: 'C' },
    { filename: 'fuel.png', width: 24, height: 24, color: '#f1c40f', text: 'F' },
    { filename: 'artifact.png', width: 24, height: 24, color: '#9b59b6', text: 'A' },
    { filename: 'ui-panel.png', width: 400, height: 300, color: '#2c3e50', text: '' },
    { filename: 'button.png', width: 200, height: 50, color: '#2980b9', text: '' },
    { filename: 'button-hover.png', width: 200, height: 50, color: '#3498db', text: '' },
    { filename: 'fuel-gauge.png', width: 200, height: 30, color: '#f39c12', text: '' },
    { filename: 'cargo-gauge.png', width: 200, height: 30, color: '#27ae60', text: '' }
];

// List of required audio assets
const requiredAudio = [
    'theme.mp3',
    'engine.mp3',
    'collect.mp3',
    'upgrade.mp3',
    'alert.mp3',
    'collision.mp3'
];

// Create image placeholders
console.log('Creating placeholder images...');
requiredImages.forEach(image => {
    const svgContent = createSvgPlaceholder(image.width, image.height, image.color, image.text);
    fs.writeFileSync(path.join(imagesDir, image.filename.replace('.png', '.svg')), svgContent);
    console.log(`Created: ${image.filename.replace('.png', '.svg')}`);
});

// Create audio placeholders
console.log('\nCreating placeholder audio files...');
requiredAudio.forEach(audioFile => {
    fs.writeFileSync(path.join(audioDir, audioFile), createEmptyAudio());
    console.log(`Created: ${audioFile}`);
});

console.log('\nAll placeholder assets created successfully!');
console.log('\nNOTE: These are SVG placeholders. For the game to load properly, update the PreloadScene.js to use .svg extension instead of .png for images.'); 