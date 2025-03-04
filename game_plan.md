# Cosmic Drift: Space Salvage Adventure
## Game Concept Overview

**Cosmic Drift** is a 2D space exploration and resource management game where players control a salvage ship in a vast procedurally generated star system. After a mysterious cosmic event, the star system is filled with debris, abandoned ships, and valuable resources. As a resourceful salvager, your mission is to collect resources, upgrade your ship, and uncover the mystery behind the cosmic event.

## Core Gameplay Loop

1. **Explore**: Navigate your ship through the procedural space environment
2. **Salvage**: Collect resources from debris fields and abandoned vessels
3. **Upgrade**: Enhance your ship's capabilities with collected resources
4. **Discover**: Uncover story elements through exploration and encounters

## Key Features

- **Physics-Based Movement**: Realistic momentum and inertia for ship navigation
- **Resource Management**: Balance fuel, cargo space, and ship integrity
- **Procedural Generation**: Randomized star systems for unique play sessions
- **Upgrade System**: Modular ship improvements to enhance capabilities
- **Light Narrative**: Discover story fragments through exploration

## Technical Implementation

### Game Engine & Framework
- **Phaser 3**: Popular, well-documented HTML5 game framework with physics support
- **JavaScript/ES6**: Core programming language

### Core Systems

#### Player Ship Controller
```javascript
// Basic ship movement with physics
class ShipController {
  constructor(scene, x, y) {
    this.sprite = scene.physics.add.sprite(x, y, 'ship');
    this.sprite.setDrag(0.99);
    this.sprite.setAngularDrag(0.95);
    this.sprite.setMaxVelocity(200);
    
    this.thrust = 0;
    this.rotationSpeed = 0.05;
    this.fuel = 100;
    this.cargo = 0;
    this.maxCargo = 50;
  }
  
  update(cursors) {
    // Rotation
    if (cursors.left.isDown) {
      this.sprite.setAngularVelocity(-150);
    } else if (cursors.right.isDown) {
      this.sprite.setAngularVelocity(150);
    }
    
    // Thrust
    if (cursors.up.isDown && this.fuel > 0) {
      // Calculate vector based on ship's rotation
      const angle = Phaser.Math.DegToRad(this.sprite.angle - 90);
      this.sprite.body.velocity.x += Math.cos(angle) * 5;
      this.sprite.body.velocity.y += Math.sin(angle) * 5;
      
      // Consume fuel
      this.fuel -= 0.1;
    }
  }
}
```

#### Procedural Generation
```javascript
class SpaceGenerator {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.sectors = [];
  }
  
  generateStarSystem(seed) {
    // Use seed for deterministic generation
    this.rng = new Phaser.Math.RandomDataGenerator([seed]);
    
    // Generate sectors
    for (let x = 0; x < this.width; x += 1000) {
      for (let y = 0; y < this.height; y += 1000) {
        this.generateSector(x, y);
      }
    }
  }
  
  generateSector(x, y) {
    const sectorType = this.rng.weightedPick([
      'empty', 'asteroid_field', 'debris_field', 'abandoned_station'
    ]);
    
    const sector = {
      x: x,
      y: y,
      type: sectorType,
      objects: []
    };
    
    // Generate objects based on sector type
    if (sectorType === 'asteroid_field') {
      const asteroidCount = this.rng.between(5, 20);
      for (let i = 0; i < asteroidCount; i++) {
        sector.objects.push({
          type: 'asteroid',
          x: x + this.rng.between(0, 1000),
          y: y + this.rng.between(0, 1000),
          size: this.rng.between(1, 3)
        });
      }
    }
    
    // Add more generation logic for other sector types
    
    this.sectors.push(sector);
    return sector;
  }
}
```

#### Resource System
```javascript
class ResourceManager {
  constructor() {
    this.resources = {
      metal: 0,
      crystal: 0,
      fuel: 100,
      artifacts: 0
    };
    this.upgrades = {
      cargoCapacity: 1,
      fuelEfficiency: 1,
      enginePower: 1,
      salvageRange: 1
    };
  }
  
  collectResource(type, amount) {
    this.resources[type] += amount;
  }
  
  canAffordUpgrade(upgrade) {
    const costs = {
      cargoCapacity: { metal: 10, crystal: 5 },
      fuelEfficiency: { metal: 5, crystal: 10 },
      enginePower: { metal: 15, crystal: 15 },
      salvageRange: { metal: 10, crystal: 20 }
    };
    
    return this.resources.metal >= costs[upgrade].metal && 
           this.resources.crystal >= costs[upgrade].crystal;
  }
  
  purchaseUpgrade(upgrade) {
    if (this.canAffordUpgrade(upgrade)) {
      const costs = {
        cargoCapacity: { metal: 10, crystal: 5 },
        fuelEfficiency: { metal: 5, crystal: 10 },
        enginePower: { metal: 15, crystal: 15 },
        salvageRange: { metal: 10, crystal: 20 }
      };
      
      this.resources.metal -= costs[upgrade].metal;
      this.resources.crystal -= costs[upgrade].crystal;
      this.upgrades[upgrade] += 1;
      
      return true;
    }
    return false;
  }
}
```

### Asset Requirements

#### Graphics
- **Ship Sprites**: Player ship with different upgrade states (3-4 variations)
- **Space Background**: Tileable starfield texture
- **Asteroids/Debris**: Various sizes and shapes (8-10 variations)
- **Abandoned Ships/Stations**: 3-5 different designs
- **Resource Pickups**: Visual indicators for different resource types
- **UI Elements**: Health bar, fuel gauge, cargo capacity meter, minimap

#### Audio
- **Ambient Space Sound**: Background loop
- **Thruster SFX**: Ship movement sounds
- **Collection SFX**: Resource pickup
- **Alert SFX**: Low fuel/danger warnings
- **Collision SFX**: Impact sounds

## Development Timeline (13 Days)

### Days 1-3: Core Framework Setup
- Day 1: Project setup, basic Phaser configuration
- Day 2: Ship controls and physics implementation
- Day 3: Camera system, basic collision detection

### Days 4-6: Procedural Generation & Resource System
- Day 4: Implement procedural space sector generation
- Day 5: Create resource collection mechanics
- Day 6: Set up inventory and resource management system

### Days 7-10: Gameplay Systems
- Day 7: Upgrade system implementation
- Day 8: Hazards, obstacles, and dangers
- Day 9: Game progression mechanics
- Day 10: UI implementation and polish

### Days 11-13: Polish & Finalization
- Day 11: Sound effects and music integration
- Day 12: Bug fixes and gameplay balance
- Day 13: Final polish and preparation for submission

## Asset Acquisition Strategy

### Option 1: Open Source Assets
- [Kenney's Space Shooter Assets](https://kenney.nl/assets/space-shooter-redux) (free)
- [OpenGameArt.org Space Collections](https://opengameart.org/content/space-assets)
- [Freesound.org](https://freesound.org/) for audio assets

### Option 2: Generated Assets
- Use tools like Midjourney or DALL-E for custom sprite generation
- Use Bfxr for custom sound effects

## Technical Architecture

```
/src
  /assets
    /images
    /audio
  /scenes
    Boot.js
    Preloader.js
    MainMenu.js
    Game.js
    Upgrade.js
  /components
    Ship.js
    Resource.js
    SectorGenerator.js
    UIManager.js
  /systems
    ResourceManager.js
    ProgressionSystem.js
  index.js
  config.js
```

## Post-Jam Expansion Possibilities
- Multiplayer capabilities
- Additional star systems to explore
- Deeper narrative elements and quests
- Combat mechanics with space pirates
- Trading system with NPC stations

## Minimum Viable Product Definition
For the game jam submission, the following features must be complete:
- Functional ship movement with physics
- Procedural generation of at least 3 sector types
- Resource collection and basic inventory
- At least 3 different ship upgrades
- Simple UI showing resources and ship status
- Start and end game conditions

## Technical Challenges & Solutions

### Challenge: Efficient Procedural Generation
**Solution**: Use chunking system to only generate and render visible sectors

### Challenge: Physics Performance with Many Objects
**Solution**: Implement object pooling and distance-based activation/deactivation

### Challenge: Engaging Gameplay Loop
**Solution**: Focus on satisfying core mechanics (movement, collection) before adding complexity

## Conclusion
Cosmic Drift offers an engaging space exploration experience within the constraints of a 13-day game jam. By focusing on solid core mechanics and leveraging procedural generation, we can create a game with high replay value while keeping the scope manageable. The modular approach to development allows for a functional MVP within the timeframe while leaving room for polish and potential post-jam expansion. 