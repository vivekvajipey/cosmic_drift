import Phaser from 'phaser';

export class Ship {
    constructor(scene, x, y) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(x, y, 'ship');
        
        // Set up physics properties
        this.sprite.setDrag(0.99);
        this.sprite.setAngularDrag(0.95);
        this.sprite.setMaxVelocity(200);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.body.setBounce(0.4);
        
        // Ship properties
        this.fuel = 100;
        this.maxFuel = 100;
        this.cargo = 0;
        this.maxCargo = 50;
        this.salvageRange = 100;
        
        // Resources collected
        this.resources = {
            metal: 0,
            crystal: 0,
            artifacts: 0
        };
        
        // Upgrades
        this.upgrades = {
            cargoCapacity: 1,
            fuelEfficiency: 1,
            enginePower: 1,
            salvageRange: 1
        };
        
        // Engine sound
        this.engineSound = scene.sound.add('engine', { loop: true, volume: 0.2 });
        
        // Create thrust particles
        this.thrustParticles = scene.add.particles(0, 0, 'fuel', {
            lifespan: 600,
            speed: { min: 100, max: 200 },
            scale: { start: 0.5, end: 0 },
            alpha: { start: 1, end: 0 },
            blendMode: 'ADD',
            emitting: false
        });
    }
    
    update(cursors) {
        // Store the ship's current angle for thrust calculations
        const shipAngle = Phaser.Math.DegToRad(this.sprite.angle - 90);
        
        // Reset angular velocity if no rotation keys are pressed
        if (!cursors.left.isDown && !cursors.right.isDown) {
            this.sprite.setAngularVelocity(0);
        }
        
        // Handle rotation
        if (cursors.left.isDown) {
            this.sprite.setAngularVelocity(-150);
        } else if (cursors.right.isDown) {
            this.sprite.setAngularVelocity(150);
        }
        
        // Handle thrust with fuel consumption
        if (cursors.up.isDown && this.fuel > 0) {
            // Apply thrust based on ship angle
            const thrustPower = 5 * this.upgrades.enginePower;
            this.sprite.body.velocity.x += Math.cos(shipAngle) * thrustPower;
            this.sprite.body.velocity.y += Math.sin(shipAngle) * thrustPower;
            
            // Consume fuel with efficiency factored in
            const fuelConsumption = 0.1 / this.upgrades.fuelEfficiency;
            this.fuel = Math.max(0, this.fuel - fuelConsumption);
            
            // Play engine sound if not already playing
            if (!this.engineSound.isPlaying) {
                this.engineSound.play();
            }
            
            // Emit thrust particles
            this.thrustParticles.setPosition(
                this.sprite.x - Math.cos(shipAngle) * 20,
                this.sprite.y - Math.sin(shipAngle) * 20
            );
            this.thrustParticles.setAngle(this.sprite.angle + 180);
            
            // Set particles to emit
            this.thrustParticles.emitting = true;
        } else {
            // Stop engine sound and particles when not thrusting
            if (this.engineSound.isPlaying) {
                this.engineSound.stop();
            }
            this.thrustParticles.emitting = false;
        }
        
        // Display a warning if fuel is low
        if (this.fuel < 20 && this.fuel > 0 && Math.floor(this.scene.time.now / 1000) % 2 === 0) {
            if (!this.lowFuelWarning) {
                this.lowFuelWarning = this.scene.time.now;
                this.scene.sound.play('alert', { volume: 0.3 });
            }
        } else if (this.fuel >= 20 || this.fuel <= 0) {
            this.lowFuelWarning = null;
        }
    }
    
    collectResource(resourceType, amount) {
        // Check if there's enough cargo space
        if (this.cargo + amount <= this.maxCargo * this.upgrades.cargoCapacity) {
            this.resources[resourceType] += amount;
            this.cargo += amount;
            this.scene.sound.play('collect');
            return true;
        }
        return false;
    }
    
    refuel(amount) {
        const previousFuel = this.fuel;
        this.fuel = Math.min(this.maxFuel, this.fuel + amount);
        return this.fuel - previousFuel; // Return amount actually refueled
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
            
            // Deduct resources
            this.resources.metal -= costs[upgrade].metal;
            this.resources.crystal -= costs[upgrade].crystal;
            
            // Apply upgrade
            this.upgrades[upgrade] += 0.25;
            
            // Play upgrade sound
            this.scene.sound.play('upgrade');
            
            // Update ship appearance if we've hit certain thresholds
            if (this.getUpgradeTotal() >= 2 && this.getUpgradeTotal() < 4) {
                this.sprite.setTexture('ship-upgraded-1');
            } else if (this.getUpgradeTotal() >= 4) {
                this.sprite.setTexture('ship-upgraded-2');
            }
            
            // Recalculate max cargo if that was upgraded
            if (upgrade === 'cargoCapacity') {
                this.maxCargo = 50 * this.upgrades.cargoCapacity;
            }
            
            // Update salvage range if that was upgraded
            if (upgrade === 'salvageRange') {
                this.salvageRange = 100 * this.upgrades.salvageRange;
            }
            
            return true;
        }
        return false;
    }
    
    getUpgradeTotal() {
        return (
            (this.upgrades.cargoCapacity - 1) + 
            (this.upgrades.fuelEfficiency - 1) + 
            (this.upgrades.enginePower - 1) + 
            (this.upgrades.salvageRange - 1)
        );
    }
    
    destroy() {
        this.sprite.destroy();
        this.thrustParticles.destroy();
        if (this.engineSound.isPlaying) {
            this.engineSound.stop();
        }
    }
} 