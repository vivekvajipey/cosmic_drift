const fs = require('fs');
const path = require('path');
const https = require('https');
const extract = require('extract-zip');

// Updated URL to a more reliable source
const ASSETS_URL = 'https://github.com/kenney/kenney-assets/raw/master/Space%20Shooter%20Redux.zip';
const DOWNLOAD_PATH = path.join(__dirname, 'downloaded_assets.zip');
const EXTRACT_PATH = path.join(__dirname, 'extracted_assets');
const TARGET_IMAGES_DIR = path.join(__dirname, 'src/assets/images');

// Create directories if they don't exist
if (!fs.existsSync(EXTRACT_PATH)) {
    fs.mkdirSync(EXTRACT_PATH, { recursive: true });
}

console.log('Downloading Kenney Space Shooter Redux assets...');

// Download the assets
const file = fs.createWriteStream(DOWNLOAD_PATH);
https.get(ASSETS_URL, (response) => {
    // Handle redirects
    if (response.statusCode === 302 || response.statusCode === 301) {
        console.log(`Redirecting to ${response.headers.location}`);
        https.get(response.headers.location, (redirectResponse) => {
            redirectResponse.pipe(file);
            
            file.on('finish', () => {
                file.close();
                console.log('Download completed. Extracting...');
                
                // Extract the assets
                extract(DOWNLOAD_PATH, { dir: EXTRACT_PATH })
                    .then(() => {
                        console.log('Extraction completed.');
                        processAssets();
                    })
                    .catch(err => {
                        console.error('Extraction error:', err);
                    });
            });
        }).on('error', (err) => {
            fs.unlink(DOWNLOAD_PATH);
            console.error('Download error:', err);
        });
    } else {
        response.pipe(file);
        
        file.on('finish', () => {
            file.close();
            console.log('Download completed. Extracting...');
            
            // Extract the assets
            extract(DOWNLOAD_PATH, { dir: EXTRACT_PATH })
                .then(() => {
                    console.log('Extraction completed.');
                    processAssets();
                })
                .catch(err => {
                    console.error('Extraction error:', err);
                });
        });
    }
}).on('error', (err) => {
    fs.unlink(DOWNLOAD_PATH);
    console.error('Download error:', err);
});

// Process and move assets to the appropriate locations
function processAssets() {
    console.log('Processing assets...');
    
    // Asset mapping (old placeholder -> new asset from Kenney)
    const assetMapping = {
        'ship.svg': 'playerShip1_blue.png',
        'ship-upgraded-1.svg': 'playerShip2_orange.png',
        'ship-upgraded-2.svg': 'playerShip3_green.png',
        'asteroid-small.svg': 'meteorBrown_small1.png',
        'asteroid-medium.svg': 'meteorBrown_med1.png',
        'asteroid-large.svg': 'meteorBrown_big1.png',
        'debris-1.svg': 'meteorGrey_small1.png',
        'debris-2.svg': 'meteorGrey_tiny1.png',
        'abandoned-ship.svg': 'enemyBlack1.png',
        'station.svg': 'spaceStation_021.png',
        'metal.svg': 'powerupBlue_bolt.png',
        'crystal.svg': 'powerupYellow_star.png',
        'fuel.svg': 'powerupRed_shield.png',
        'artifact.svg': 'powerupGreen_star.png',
    };
    
    // Search for the PNG files in the extracted directory
    findPngFiles(EXTRACT_PATH, (pngFiles) => {
        console.log(`Found ${pngFiles.length} PNG files`);
        
        // Process each asset in the mapping
        Object.entries(assetMapping).forEach(([oldFile, newFile]) => {
            // Find the matching PNG file
            const matchingFile = pngFiles.find(file => path.basename(file) === newFile);
            
            if (matchingFile) {
                const targetPath = path.join(TARGET_IMAGES_DIR, oldFile.replace('.svg', '.png'));
                
                // Copy the file
                fs.copyFileSync(matchingFile, targetPath);
                console.log(`Copied ${newFile} to ${oldFile.replace('.svg', '.png')}`);
                
                // Create a backup of the original SVG if it exists
                const originalSvgPath = path.join(TARGET_IMAGES_DIR, oldFile);
                if (fs.existsSync(originalSvgPath)) {
                    const backupPath = path.join(TARGET_IMAGES_DIR, `${oldFile}.bak`);
                    fs.copyFileSync(originalSvgPath, backupPath);
                    console.log(`Backed up ${oldFile} to ${oldFile}.bak`);
                }
            } else {
                console.error(`Could not find matching file for ${newFile}`);
            }
        });
        
        console.log('Asset processing completed. You will need to update your code to use .png extensions instead of .svg for the replaced assets.');
    });
}

// Helper function to recursively find PNG files
function findPngFiles(dir, callback, results = []) {
    fs.readdir(dir, (err, files) => {
        if (err) {
            console.error(`Error reading directory ${dir}:`, err);
            callback(results);
            return;
        }
        
        let pending = files.length;
        if (!pending) {
            callback(results);
            return;
        }
        
        files.forEach(file => {
            const filePath = path.join(dir, file);
            
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error(`Error getting stats for ${filePath}:`, err);
                    if (!--pending) callback(results);
                    return;
                }
                
                if (stats.isDirectory()) {
                    findPngFiles(filePath, (res) => {
                        results = results.concat(res);
                        if (!--pending) callback(results);
                    }, results);
                } else {
                    if (path.extname(file).toLowerCase() === '.png') {
                        results.push(filePath);
                    }
                    if (!--pending) callback(results);
                }
            });
        });
    });
} 