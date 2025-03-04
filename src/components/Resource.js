import Phaser from 'phaser';

export class Resource {
    constructor(scene, x, y, type, amount = 1) {
        this.scene = scene;
        this.type = type;
        this.amount = amount;
        
        // Determine sprite based on resource type
        let spriteTexture = '';
        switch (type) {
            case 'metal':
                spriteTexture = 'metal';
                break;
            case 'crystal':
                spriteTexture = 'crystal';
                break;
            case 'fuel':
                spriteTexture = 'fuel';
                break;
            case 'artifact':
                spriteTexture = 'artifact';
                break;
            default:
                spriteTexture = 'metal';
        }
        
        // Create the sprite
        this.sprite = scene.physics.add.sprite(x, y, spriteTexture);
        
        // Adjust sprite scale based on amount
        const scale = 0.5 + (amount * 0.1);
        this.sprite.setScale(scale);
        
        // Add physics properties
        this.sprite.body.setImmovable(true);
        
        // Add a floating effect
        this.floatTween = scene.tweens.add({
            targets: this.sprite,
            y: y + 10,
            duration: 1500,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
        
        // Add a pulsing effect based on resource type
        let tint;
        switch (type) {
            case 'metal':
                tint = 0xaaaaaa; // Gray
                break;
            case 'crystal':
                tint = 0x55aaff; // Blue
                break;
            case 'fuel':
                tint = 0xffaa00; // Orange
                break;
            case 'artifact':
                tint = 0xaa00ff; // Purple
                break;
            default:
                tint = 0xffffff; // White
        }
        
        this.sprite.setTint(tint);
        
        this.pulseTween = scene.tweens.add({
            targets: this.sprite,
            alpha: 0.6,
            duration: 1000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
        
        // Add a collection indicator
        this.collectionIndicator = scene.add.circle(x, y, 40, 0xffffff, 0);
        
        // Store references to improve collision detection
        this.sprite.parentResource = this;
    }
    
    isInRange(ship) {
        const distance = Phaser.Math.Distance.Between(
            this.sprite.x, this.sprite.y,
            ship.sprite.x, ship.sprite.y
        );
        
        const inRange = distance <= ship.salvageRange;
        
        // Update collection indicator based on whether in range
        if (inRange) {
            this.collectionIndicator.setAlpha(0.2);
        } else {
            this.collectionIndicator.setAlpha(0);
        }
        
        return inRange;
    }
    
    collect(ship) {
        // Check if ship is in range
        if (this.isInRange(ship)) {
            let collected = false;
            
            // Handle collection based on resource type
            switch (this.type) {
                case 'metal':
                case 'crystal':
                case 'artifact':
                    // Add to ship's cargo if there's space
                    collected = ship.collectResource(this.type, this.amount);
                    break;
                case 'fuel':
                    // Add to ship's fuel
                    const refueled = ship.refuel(this.amount * 10);
                    collected = refueled > 0;
                    break;
            }
            
            if (collected) {
                // Create collection effect
                this.scene.add.particles(this.sprite.x, this.sprite.y, this.type, {
                    lifespan: 800,
                    speed: { min: 50, max: 100 },
                    scale: { start: 0.4, end: 0 },
                    alpha: { start: 1, end: 0 },
                    blendMode: 'ADD',
                    emitting: false,
                    quantity: 10,
                    emitCallback: () => {}
                }).explode(10);
                
                // Clean up
                this.destroy();
                return true;
            }
        }
        
        return false;
    }
    
    destroy() {
        if (this.floatTween) {
            this.floatTween.stop();
        }
        if (this.pulseTween) {
            this.pulseTween.stop();
        }
        if (this.sprite) {
            this.sprite.destroy();
        }
        if (this.collectionIndicator) {
            this.collectionIndicator.destroy();
        }
    }
} 