const fs = require('fs');
const path = require('path');

const TARGET_DIR = path.join(__dirname, 'src/assets/images');

// Define better SVG assets with more detailed graphics
const betterSvgs = {
    'ship.svg': `<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="shipGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#4a6cd4;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#2a3b78;stop-opacity:1" />
            </linearGradient>
        </defs>
        <path d="M32,10 L42,50 L32,45 L22,50 Z" fill="url(#shipGradient)" stroke="#1a2b58" stroke-width="2"/>
        <circle cx="32" cy="25" r="5" fill="#3498db" stroke="#2980b9" stroke-width="1"/>
        <rect x="30" y="45" width="4" height="8" fill="#e74c3c" stroke="#c0392b" stroke-width="1"/>
    </svg>`,
    
    'ship-upgraded-1.svg': `<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="shipGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#e67e22;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#d35400;stop-opacity:1" />
            </linearGradient>
        </defs>
        <path d="M32,8 L45,50 L32,42 L19,50 Z" fill="url(#shipGradient1)" stroke="#a04000" stroke-width="2"/>
        <circle cx="32" cy="22" r="6" fill="#f39c12" stroke="#e67e22" stroke-width="1"/>
        <rect x="28" y="42" width="8" height="10" fill="#e74c3c" stroke="#c0392b" stroke-width="1"/>
        <path d="M20,30 L15,40 L20,38 Z" fill="#d35400" stroke="#a04000" stroke-width="1"/>
        <path d="M44,30 L49,40 L44,38 Z" fill="#d35400" stroke="#a04000" stroke-width="1"/>
    </svg>`,
    
    'ship-upgraded-2.svg': `<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="shipGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#2ecc71;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#27ae60;stop-opacity:1" />
            </linearGradient>
        </defs>
        <path d="M32,5 L48,50 L32,40 L16,50 Z" fill="url(#shipGradient2)" stroke="#1e8449" stroke-width="2"/>
        <circle cx="32" cy="20" r="7" fill="#2ecc71" stroke="#27ae60" stroke-width="1"/>
        <rect x="27" y="40" width="10" height="12" fill="#e74c3c" stroke="#c0392b" stroke-width="1"/>
        <path d="M18,25 L10,40 L18,36 Z" fill="#27ae60" stroke="#1e8449" stroke-width="1"/>
        <path d="M46,25 L54,40 L46,36 Z" fill="#27ae60" stroke="#1e8449" stroke-width="1"/>
        <circle cx="32" cy="20" r="3" fill="#ecf0f1" stroke="#bdc3c7" stroke-width="1"/>
    </svg>`,
    
    'asteroid-small.svg': `<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
        <path d="M25,15 L35,18 L40,25 L38,35 L30,40 L20,38 L15,30 L18,20 Z" fill="#8B4513" stroke="#5D2906" stroke-width="2"/>
        <circle cx="22" cy="22" r="2" fill="#A0522D" />
        <circle cx="30" cy="30" r="3" fill="#A0522D" />
        <circle cx="35" cy="25" r="1.5" fill="#A0522D" />
    </svg>`,
    
    'asteroid-medium.svg': `<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
        <path d="M20,10 L35,12 L45,20 L48,32 L42,45 L30,50 L15,45 L8,32 L10,18 Z" fill="#8B4513" stroke="#5D2906" stroke-width="2"/>
        <circle cx="20" cy="20" r="3" fill="#A0522D" />
        <circle cx="30" cy="35" r="4" fill="#A0522D" />
        <circle cx="40" cy="25" r="2.5" fill="#A0522D" />
        <circle cx="25" cy="45" r="3" fill="#A0522D" />
    </svg>`,
    
    'asteroid-large.svg': `<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
        <path d="M15,5 L35,8 L50,15 L55,30 L50,45 L35,55 L15,50 L5,35 L8,15 Z" fill="#8B4513" stroke="#5D2906" stroke-width="2"/>
        <circle cx="20" cy="15" r="4" fill="#A0522D" />
        <circle cx="35" cy="40" r="5" fill="#A0522D" />
        <circle cx="45" cy="20" r="3.5" fill="#A0522D" />
        <circle cx="15" cy="35" r="4" fill="#A0522D" />
        <circle cx="30" cy="25" r="3" fill="#A0522D" />
    </svg>`,
    
    'debris-1.svg': `<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
        <path d="M25,20 L35,22 L38,30 L32,38 L22,35 L20,25 Z" fill="#7F8C8D" stroke="#5D6D7E" stroke-width="2"/>
        <line x1="25" y1="25" x2="32" y2="32" stroke="#5D6D7E" stroke-width="1" />
        <line x1="30" y1="22" x2="28" y2="35" stroke="#5D6D7E" stroke-width="1" />
    </svg>`,
    
    'debris-2.svg': `<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
        <path d="M28,25 L36,28 L38,35 L32,40 L24,37 L22,30 Z" fill="#7F8C8D" stroke="#5D6D7E" stroke-width="2"/>
        <circle cx="30" cy="32" r="2" fill="#5D6D7E" />
    </svg>`,
    
    'abandoned-ship.svg': `<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
        <path d="M32,15 L42,25 L42,40 L32,50 L22,40 L22,25 Z" fill="#34495E" stroke="#2C3E50" stroke-width="2"/>
        <rect x="28" y="20" width="8" height="15" fill="#7F8C8D" stroke="#5D6D7E" stroke-width="1"/>
        <circle cx="32" cy="45" r="2" fill="#E74C3C" />
        <path d="M22,30 L15,35 L22,35 Z" fill="#34495E" stroke="#2C3E50" stroke-width="1"/>
        <path d="M42,30 L49,35 L42,35 Z" fill="#34495E" stroke="#2C3E50" stroke-width="1"/>
    </svg>`,
    
    'station.svg': `<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="10" width="24" height="44" fill="#34495E" stroke="#2C3E50" stroke-width="2" rx="2" ry="2"/>
        <rect x="10" y="20" width="44" height="24" fill="#34495E" stroke="#2C3E50" stroke-width="2" rx="2" ry="2"/>
        <circle cx="32" cy="32" r="8" fill="#3498DB" stroke="#2980B9" stroke-width="2"/>
        <circle cx="32" cy="32" r="4" fill="#ECF0F1" stroke="#BDC3C7" stroke-width="1"/>
        <rect x="15" y="15" width="6" height="6" fill="#E74C3C" stroke="#C0392B" stroke-width="1"/>
        <rect x="43" y="15" width="6" height="6" fill="#E74C3C" stroke="#C0392B" stroke-width="1"/>
        <rect x="15" y="43" width="6" height="6" fill="#E74C3C" stroke="#C0392B" stroke-width="1"/>
        <rect x="43" y="43" width="6" height="6" fill="#E74C3C" stroke="#C0392B" stroke-width="1"/>
    </svg>`,
    
    'metal.svg': `<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="15" fill="#7F8C8D" stroke="#5D6D7E" stroke-width="2"/>
        <path d="M25,25 L39,25 L39,39 L25,39 Z" fill="#BDC3C7" stroke="#95A5A6" stroke-width="1"/>
        <circle cx="32" cy="32" r="5" fill="#5D6D7E" stroke="#34495E" stroke-width="1"/>
    </svg>`,
    
    'crystal.svg': `<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
        <polygon points="32,15 40,25 40,40 32,50 24,40 24,25" fill="#9B59B6" stroke="#8E44AD" stroke-width="2"/>
        <polygon points="32,20 36,25 36,35 32,40 28,35 28,25" fill="#D2B4DE" stroke="#9B59B6" stroke-width="1"/>
    </svg>`,
    
    'fuel.svg': `<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="15" fill="#E74C3C" stroke="#C0392B" stroke-width="2"/>
        <path d="M25,25 L39,39 M25,39 L39,25" stroke="#FFFFFF" stroke-width="3"/>
        <circle cx="32" cy="32" r="5" fill="#C0392B" stroke="#922B21" stroke-width="1"/>
    </svg>`,
    
    'artifact.svg': `<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="15" fill="#F1C40F" stroke="#D4AC0D" stroke-width="2"/>
        <polygon points="32,20 35,28 44,28 37,34 40,42 32,38 24,42 27,34 20,28 29,28" fill="#FFFFFF" stroke="#ECF0F1" stroke-width="1"/>
    </svg>`,
    
    'space-background.svg': `<svg width="1024" height="768" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#0A0E21"/>
        <g fill="#FFFFFF">
            ${Array.from({length: 200}, () => {
                const x = Math.floor(Math.random() * 1024);
                const y = Math.floor(Math.random() * 768);
                const r = Math.random() * 1.5;
                return `<circle cx="${x}" cy="${y}" r="${r}" opacity="${Math.random() * 0.8 + 0.2}"/>`;
            }).join('')}
        </g>
    </svg>`,
    
    'stars-parallax-1.svg': `<svg width="1024" height="768" xmlns="http://www.w3.org/2000/svg">
        <g fill="#FFFFFF">
            ${Array.from({length: 100}, () => {
                const x = Math.floor(Math.random() * 1024);
                const y = Math.floor(Math.random() * 768);
                const r = Math.random() * 2 + 1;
                return `<circle cx="${x}" cy="${y}" r="${r}" opacity="${Math.random() * 0.6 + 0.4}"/>`;
            }).join('')}
        </g>
    </svg>`,
    
    'stars-parallax-2.svg': `<svg width="1024" height="768" xmlns="http://www.w3.org/2000/svg">
        <g fill="#FFFFFF">
            ${Array.from({length: 50}, () => {
                const x = Math.floor(Math.random() * 1024);
                const y = Math.floor(Math.random() * 768);
                const r = Math.random() * 3 + 2;
                return `<circle cx="${x}" cy="${y}" r="${r}" opacity="${Math.random() * 0.4 + 0.6}"/>`;
            }).join('')}
        </g>
    </svg>`,
    
    'button.svg': `<svg width="200" height="60" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="60" rx="10" ry="10" fill="#3498DB" stroke="#2980B9" stroke-width="2"/>
        <rect x="5" y="5" width="190" height="50" rx="8" ry="8" fill="#2980B9" stroke="none"/>
    </svg>`,
    
    'button-hover.svg': `<svg width="200" height="60" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="60" rx="10" ry="10" fill="#2ECC71" stroke="#27AE60" stroke-width="2"/>
        <rect x="5" y="5" width="190" height="50" rx="8" ry="8" fill="#27AE60" stroke="none"/>
    </svg>`,
    
    'ui-panel.svg': `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="200" rx="10" ry="10" fill="#34495E" stroke="#2C3E50" stroke-width="2" opacity="0.9"/>
        <rect x="10" y="10" width="280" height="180" rx="5" ry="5" fill="#2C3E50" stroke="none" opacity="0.7"/>
        <line x1="10" y1="40" x2="290" y2="40" stroke="#3498DB" stroke-width="2"/>
    </svg>`,
    
    'fuel-gauge.svg': `<svg width="150" height="30" xmlns="http://www.w3.org/2000/svg">
        <rect width="150" height="30" rx="5" ry="5" fill="#34495E" stroke="#2C3E50" stroke-width="2"/>
        <rect x="5" y="5" width="140" height="20" rx="3" ry="3" fill="#E74C3C" stroke="none"/>
    </svg>`,
    
    'cargo-gauge.svg': `<svg width="150" height="30" xmlns="http://www.w3.org/2000/svg">
        <rect width="150" height="30" rx="5" ry="5" fill="#34495E" stroke="#2C3E50" stroke-width="2"/>
        <rect x="5" y="5" width="140" height="20" rx="3" ry="3" fill="#3498DB" stroke="none"/>
    </svg>`,
    
    'loading-bar.svg': `<svg width="300" height="30" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="30" rx="5" ry="5" fill="#3498DB" stroke="#2980B9" stroke-width="2"/>
    </svg>`,
    
    'loading-bar-bg.svg': `<svg width="300" height="30" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="30" rx="5" ry="5" fill="#34495E" stroke="#2C3E50" stroke-width="2"/>
    </svg>`,
    
    'logo.svg': `<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#3498DB;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#9B59B6;stop-opacity:1" />
            </linearGradient>
        </defs>
        <rect width="400" height="200" rx="20" ry="20" fill="#2C3E50" stroke="#34495E" stroke-width="4"/>
        <text x="200" y="100" font-family="Arial" font-size="48" font-weight="bold" fill="url(#logoGradient)" text-anchor="middle" dominant-baseline="middle">COSMIC DRIFT</text>
        <text x="200" y="140" font-family="Arial" font-size="20" fill="#ECF0F1" text-anchor="middle" dominant-baseline="middle">Space Salvage Adventure</text>
    </svg>`
};

console.log('Creating better SVG assets...');

// Create each SVG file
Object.entries(betterSvgs).forEach(([filename, content]) => {
    const filePath = path.join(TARGET_DIR, filename);
    
    // Create a backup of the original SVG if it exists
    if (fs.existsSync(filePath)) {
        const backupPath = path.join(TARGET_DIR, `${filename}.bak`);
        fs.copyFileSync(filePath, backupPath);
        console.log(`Backed up ${filename} to ${filename}.bak`);
    }
    
    // Write the new SVG file
    fs.writeFileSync(filePath, content);
    console.log(`Created better SVG for ${filename}`);
});

console.log('All better SVG assets have been created successfully!');
console.log('No need to update code references since we kept the same filenames and formats.'); 