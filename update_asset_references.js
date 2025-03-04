const fs = require('fs');
const path = require('path');

// Files to update
const filesToUpdate = [
    'src/scenes/PreloadScene.js',
    'src/scenes/BootScene.js',
    'src/scenes/GameScene.js',
    'src/scenes/MainMenuScene.js',
    'src/scenes/UpgradeScene.js',
    'src/components/Ship.js',
    'src/components/Resource.js',
    'src/components/SectorGenerator.js',
    'src/components/UIManager.js'
];

// Assets that will be replaced with PNGs
const assetsToReplace = [
    'ship',
    'ship-upgraded-1',
    'ship-upgraded-2',
    'asteroid-small',
    'asteroid-medium',
    'asteroid-large',
    'debris-1',
    'debris-2',
    'abandoned-ship',
    'station',
    'metal',
    'crystal',
    'fuel',
    'artifact'
];

console.log('Updating asset references in game code...');

// Process each file
filesToUpdate.forEach(filePath => {
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Replace SVG references with PNG for each asset
    assetsToReplace.forEach(asset => {
        const svgPattern = new RegExp(`'${asset}'\\s*,\\s*'assets/images/${asset}\\.svg'`, 'g');
        if (svgPattern.test(content)) {
            content = content.replace(svgPattern, `'${asset}', 'assets/images/${asset}.png'`);
            modified = true;
        }
    });

    // Save the file if modified
    if (modified) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated asset references in ${filePath}`);
    } else {
        console.log(`No changes needed in ${filePath}`);
    }
});

console.log('Asset reference update completed.'); 