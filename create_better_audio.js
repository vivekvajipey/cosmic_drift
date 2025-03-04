const fs = require('fs');
const path = require('path');
const https = require('https');

const TARGET_DIR = path.join(__dirname, 'src/assets/audio');

// URLs to free sound effects
const audioSources = {
    'theme.mp3': 'https://freesound.org/data/previews/147/147854_2614803-lq.mp3', // Space ambient
    'engine.mp3': 'https://freesound.org/data/previews/268/268903_5121236-lq.mp3', // Spaceship engine
    'collect.mp3': 'https://freesound.org/data/previews/415/415762_5121236-lq.mp3', // Collect item
    'upgrade.mp3': 'https://freesound.org/data/previews/320/320181_5260872-lq.mp3', // Upgrade sound
    'alert.mp3': 'https://freesound.org/data/previews/135/135125_2337290-lq.mp3', // Alert sound
    'collision.mp3': 'https://freesound.org/data/previews/331/331912_5860492-lq.mp3' // Collision sound
};

console.log('Downloading better audio assets...');

// Download each audio file
Object.entries(audioSources).forEach(([filename, url]) => {
    const filePath = path.join(TARGET_DIR, filename);
    
    // Create a backup of the original audio if it exists
    if (fs.existsSync(filePath)) {
        const backupPath = path.join(TARGET_DIR, `${filename}.bak`);
        fs.copyFileSync(filePath, backupPath);
        console.log(`Backed up ${filename} to ${filename}.bak`);
    }
    
    // Download the new audio file
    const file = fs.createWriteStream(filePath);
    https.get(url, (response) => {
        if (response.statusCode === 200) {
            response.pipe(file);
            
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded better audio for ${filename}`);
            });
        } else {
            console.error(`Failed to download ${filename}: Status code ${response.statusCode}`);
            file.close();
            fs.unlinkSync(filePath);
        }
    }).on('error', (err) => {
        console.error(`Error downloading ${filename}:`, err);
        file.close();
        fs.unlinkSync(filePath);
    });
});

console.log('Audio download process initiated. This may take a moment to complete.');
console.log('No need to update code references since we kept the same filenames and formats.'); 