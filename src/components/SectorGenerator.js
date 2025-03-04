import Phaser from 'phaser';
import { Resource } from './Resource';

export class SectorGenerator {
    constructor(scene) {
        this.scene = scene;
        this.sectors = [];
        this.activeSectors = new Set();
        this.sectorSize = 1000;
        this.visibleRange = 2; // Number of sectors visible in each direction
        this.resources = [];
        this.obstacles = [];
        
        // Set up random generator
        this.rng = new Phaser.Math.RandomDataGenerator([Date.now()]);
    }
    
    initGame(worldSize = 5) {
        // Calculate world bounds
        this.worldBounds = {
            width: worldSize * this.sectorSize,
            height: worldSize * this.sectorSize
        };
        
        // Set physics world bounds
        this.scene.physics.world.setBounds(0, 0, this.worldBounds.width, this.worldBounds.height);
        
        // Generate initial sectors
        this.generateInitialSectors(worldSize);
    }
    
    generateInitialSectors(worldSize) {
        // Generate all sectors
        for (let x = 0; x < worldSize; x++) {
            for (let y = 0; y < worldSize; y++) {
                const sectorX = x * this.sectorSize;
                const sectorY = y * this.sectorSize;
                const sectorType = this.getSectorType(x, y);
                
                this.sectors.push({
                    x: sectorX,
                    y: sectorY,
                    gridX: x,
                    gridY: y,
                    type: sectorType,
                    active: false,
                    generated: false
                });
            }
        }
    }
    
    getSectorType(x, y) {
        // Seed for deterministic generation
        const seed = x * 1000 + y;
        this.rng.sow([seed]);
        
        // Generate sector type with weighted probabilities
        const sectorType = this.rng.weightedPick([
            'empty',
            'asteroid_field',
            'debris_field',
            'abandoned_station'
        ], [10, 40, 40, 10]);
        
        return sectorType;
    }
    
    updateActiveSectors(playerX, playerY) {
        // Convert player position to sector coordinates
        const playerSectorX = Math.floor(playerX / this.sectorSize);
        const playerSectorY = Math.floor(playerY / this.sectorSize);
        
        // Track which sectors should be active
        const shouldBeActive = new Set();
        
        // Calculate which sectors should be active based on player position
        for (let x = playerSectorX - this.visibleRange; x <= playerSectorX + this.visibleRange; x++) {
            for (let y = playerSectorY - this.visibleRange; y <= playerSectorY + this.visibleRange; y++) {
                // Skip if out of bounds
                if (x < 0 || y < 0 || x >= this.worldBounds.width / this.sectorSize || y >= this.worldBounds.height / this.sectorSize) {
                    continue;
                }
                
                const sectorKey = `${x},${y}`;
                shouldBeActive.add(sectorKey);
                
                // Find the sector in our list
                const sector = this.sectors.find(s => s.gridX === x && s.gridY === y);
                
                if (sector && !sector.generated) {
                    // Generate content for this sector if not already done
                    this.generateSectorContent(sector);
                    sector.generated = true;
                }
                
                if (sector && !sector.active) {
                    sector.active = true;
                    this.activateSector(sector);
                }
            }
        }
        
        // Deactivate sectors that are no longer in range
        for (const sector of this.sectors) {
            const sectorKey = `${sector.gridX},${sector.gridY}`;
            if (sector.active && !shouldBeActive.has(sectorKey)) {
                sector.active = false;
                this.deactivateSector(sector);
            }
        }
    }
    
    activateSector(sector) {
        // This is called when a sector becomes active
        // Resources and obstacles for this sector are already created
        // We just need to enable them
        this.resources
            .filter(r => this.isInSector(r.sprite.x, r.sprite.y, sector))
            .forEach(r => {
                r.sprite.setActive(true);
                r.sprite.setVisible(true);
            });
            
        this.obstacles
            .filter(o => this.isInSector(o.x, o.y, sector))
            .forEach(o => {
                o.setActive(true);
                o.setVisible(true);
            });
    }
    
    deactivateSector(sector) {
        // This is called when a sector becomes inactive
        // We don't destroy objects, just disable them for efficiency
        this.resources
            .filter(r => this.isInSector(r.sprite.x, r.sprite.y, sector))
            .forEach(r => {
                r.sprite.setActive(false);
                r.sprite.setVisible(false);
            });
            
        this.obstacles
            .filter(o => this.isInSector(o.x, o.y, sector))
            .forEach(o => {
                o.setActive(false);
                o.setVisible(false);
            });
    }
    
    isInSector(x, y, sector) {
        return (
            x >= sector.x && 
            x < sector.x + this.sectorSize && 
            y >= sector.y && 
            y < sector.y + this.sectorSize
        );
    }
    
    generateSectorContent(sector) {
        // Use sector's grid coordinates to seed the RNG for deterministic generation
        const seed = sector.gridX * 1000 + sector.gridY;
        this.rng.sow([seed]);
        
        switch (sector.type) {
            case 'empty':
                this.generateEmptySector(sector);
                break;
            case 'asteroid_field':
                this.generateAsteroidField(sector);
                break;
            case 'debris_field':
                this.generateDebrisField(sector);
                break;
            case 'abandoned_station':
                this.generateAbandonedStation(sector);
                break;
        }
    }
    
    generateEmptySector(sector) {
        // Even empty sectors might have a few resources
        const resourceCount = this.rng.between(0, 3);
        
        for (let i = 0; i < resourceCount; i++) {
            const x = sector.x + this.rng.between(100, this.sectorSize - 100);
            const y = sector.y + this.rng.between(100, this.sectorSize - 100);
            
            const resourceType = this.rng.weightedPick(
                ['metal', 'crystal', 'fuel'], 
                [2, 2, 6]
            );
            
            const amount = this.rng.between(1, 2);
            
            const resource = new Resource(this.scene, x, y, resourceType, amount);
            this.resources.push(resource);
        }
    }
    
    generateAsteroidField(sector) {
        // Generate a field of asteroids with resources
        const asteroidCount = this.rng.between(10, 20);
        
        for (let i = 0; i < asteroidCount; i++) {
            const x = sector.x + this.rng.between(100, this.sectorSize - 100);
            const y = sector.y + this.rng.between(100, this.sectorSize - 100);
            
            // Determine asteroid size
            const size = this.rng.weightedPick(['small', 'medium', 'large'], [5, 3, 2]);
            let asteroidKey, scale, resourceChance;
            
            switch (size) {
                case 'small':
                    asteroidKey = 'asteroid-small';
                    scale = this.rng.realInRange(0.6, 0.9);
                    resourceChance = 0.3;
                    break;
                case 'medium':
                    asteroidKey = 'asteroid-medium';
                    scale = this.rng.realInRange(0.8, 1.2);
                    resourceChance = 0.6;
                    break;
                case 'large':
                    asteroidKey = 'asteroid-large';
                    scale = this.rng.realInRange(1.0, 1.5);
                    resourceChance = 0.9;
                    break;
            }
            
            // Create asteroid as an obstacle
            const asteroid = this.scene.physics.add.image(x, y, asteroidKey);
            asteroid.setScale(scale);
            asteroid.setImmovable(true);
            asteroid.body.setCircle(asteroid.width * 0.4);
            
            // Add a small rotation to make it more dynamic
            asteroid.rotationSpeed = this.rng.realInRange(-0.2, 0.2);
            asteroid.update = function() {
                this.angle += this.rotationSpeed;
            };
            
            this.obstacles.push(asteroid);
            
            // Chance to add a resource near the asteroid
            if (this.rng.frac() < resourceChance) {
                const resourceX = x + this.rng.between(-50, 50);
                const resourceY = y + this.rng.between(-50, 50);
                
                const resourceType = this.rng.weightedPick(
                    ['metal', 'crystal', 'fuel'], 
                    [5, 3, 2]
                );
                
                const amount = this.rng.between(1, 3);
                
                const resource = new Resource(this.scene, resourceX, resourceY, resourceType, amount);
                this.resources.push(resource);
            }
        }
    }
    
    generateDebrisField(sector) {
        // Generate a field of debris with resources
        const debrisCount = this.rng.between(8, 15);
        
        for (let i = 0; i < debrisCount; i++) {
            const x = sector.x + this.rng.between(100, this.sectorSize - 100);
            const y = sector.y + this.rng.between(100, this.sectorSize - 100);
            
            // Determine debris type
            const debrisType = this.rng.weightedPick([1, 2], [1, 1]);
            const debrisKey = `debris-${debrisType}`;
            
            // Create debris as an obstacle
            const debris = this.scene.physics.add.image(x, y, debrisKey);
            debris.setScale(this.rng.realInRange(0.7, 1.2));
            debris.setAngle(this.rng.between(0, 360));
            debris.setImmovable(true);
            
            // Add a small rotation to make it more dynamic
            debris.rotationSpeed = this.rng.realInRange(-0.3, 0.3);
            debris.update = function() {
                this.angle += this.rotationSpeed;
            };
            
            this.obstacles.push(debris);
            
            // Higher chance of resources from debris
            if (this.rng.frac() < 0.7) {
                const resourceX = x + this.rng.between(-30, 30);
                const resourceY = y + this.rng.between(-30, 30);
                
                const resourceType = this.rng.weightedPick(
                    ['metal', 'crystal', 'fuel', 'artifact'], 
                    [4, 3, 2, 1]
                );
                
                const amount = this.rng.between(2, 4);
                
                const resource = new Resource(this.scene, resourceX, resourceY, resourceType, amount);
                this.resources.push(resource);
            }
        }
    }
    
    generateAbandonedStation(sector) {
        // Create an abandoned station with valuable resources
        const x = sector.x + this.sectorSize / 2 + this.rng.between(-200, 200);
        const y = sector.y + this.sectorSize / 2 + this.rng.between(-200, 200);
        
        // Create the station
        const station = this.scene.physics.add.image(x, y, 'station');
        station.setScale(1.5);
        station.setImmovable(true);
        
        // Add a slow rotation
        station.rotationSpeed = this.rng.realInRange(-0.05, 0.05);
        station.update = function() {
            this.angle += this.rotationSpeed;
        };
        
        this.obstacles.push(station);
        
        // Add resources around the station
        const resourceCount = this.rng.between(8, 12);
        
        for (let i = 0; i < resourceCount; i++) {
            // Position in a circle around the station
            const angle = this.rng.frac() * Math.PI * 2;
            const distance = this.rng.between(100, 200);
            
            const resourceX = x + Math.cos(angle) * distance;
            const resourceY = y + Math.sin(angle) * distance;
            
            const resourceType = this.rng.weightedPick(
                ['metal', 'crystal', 'fuel', 'artifact'], 
                [3, 3, 2, 2]
            );
            
            const amount = this.rng.between(3, 5);
            
            const resource = new Resource(this.scene, resourceX, resourceY, resourceType, amount);
            this.resources.push(resource);
        }
        
        // Add some debris around as well
        const debrisCount = this.rng.between(5, 8);
        
        for (let i = 0; i < debrisCount; i++) {
            const angle = this.rng.frac() * Math.PI * 2;
            const distance = this.rng.between(220, 350);
            
            const debrisX = x + Math.cos(angle) * distance;
            const debrisY = y + Math.sin(angle) * distance;
            
            const debrisType = this.rng.weightedPick([1, 2], [1, 1]);
            const debrisKey = `debris-${debrisType}`;
            
            const debris = this.scene.physics.add.image(debrisX, debrisY, debrisKey);
            debris.setScale(this.rng.realInRange(0.6, 1.0));
            debris.setAngle(this.rng.between(0, 360));
            debris.setImmovable(true);
            
            debris.rotationSpeed = this.rng.realInRange(-0.2, 0.2);
            debris.update = function() {
                this.angle += this.rotationSpeed;
            };
            
            this.obstacles.push(debris);
        }
    }
    
    update() {
        // Update active obstacles (rotation, etc.)
        this.obstacles.forEach(obstacle => {
            if (obstacle.active && obstacle.update) {
                obstacle.update();
            }
        });
    }
    
    getResources() {
        return this.resources;
    }
    
    getObstacles() {
        return this.obstacles;
    }
    
    getWorldBounds() {
        return this.worldBounds;
    }
    
    cleanup() {
        // Clean up all resources and obstacles
        this.resources.forEach(resource => resource.destroy());
        this.obstacles.forEach(obstacle => obstacle.destroy());
        
        this.resources = [];
        this.obstacles = [];
        this.sectors = [];
        this.activeSectors.clear();
    }
} 