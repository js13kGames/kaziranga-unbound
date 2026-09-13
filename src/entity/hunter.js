class Bullet extends Entity {

    type = 'bullet';
    z = Z_PLAYER;
    categories = ['bullet'];

    radiusX = 4;
    radiusY = 4;
    deflected = false;

    constructor(x, y, dirX) {
        super();
        this.x = x;
        this.y = y;
        this.vX = dirX * 520;
        this.vY = 0;
        this.hitbox.width = 10;
        this.hitbox.height = 8;
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        this.x += this.vX * elapsed;
        this.y += this.vY * elapsed;

        const player = firstItem(this.world.category('player'));
        const camera = firstItem(this.world.category('camera'));
        const camX = camera ? camera.x : (player ? player.x : 0);

        // 1. If not deflected yet: check player collision & shield deflection
        if (!this.deflected) {
            if (player && !player.dead && this.hitbox.intersects(player.hitbox)) {
                if (player.isShielding) {
                    this.deflected = true;
                    // Deflect backward with high speed and slight angle
                    this.vX = 820;
                    this.vY = rnd(-50, 50);

                    // High-pitched crystal shield deflect ping SFX
                    zzfx(...[.35,,900,.01,.04,.12,1,2,,,-450,.08,,,,,,.85,.02]);

                    camera?.shake(0.12, 5);
                    return;
                }

                // Player hit without shield -> player dies
                player.die('bullet');
                this.destroy();
                return;
            }
        } else {
            // 2. If deflected: check collision with enemies/hunters
            for (const hunter of this.world.category('hunter')) {
                if (!hunter.dead && this.hitbox.intersects(hunter.hitbox)) {
                    hunter.hit(this.vX);
                    this.destroy();
                    return;
                }
            }
        }

        // Garbage collection: remove if offscreen or expired
        if (this.age > 4 || this.x < camX - 600 || this.x > camX + 1600) {
            this.destroy();
        }
    }

    destroy() {
        this.world?.removeEntity(this);
    }

    render() {
        ctx.translate(~~this.x, ~~this.y);
        const P = 2;
        if (this.deflected) {
            // Deflected magical rainbow energy projectile
            const rainbowColors = ['#ff3b30', '#ff9500', '#ffcc00', '#34c759', '#00c7be', '#007aff', '#af52de'];
            for (let i = 0; i < rainbowColors.length; i++) {
                ctx.fillStyle = rainbowColors[i];
                ctx.fillRect((-4 + i) * P, -1 * P, 1.5 * P, 2 * P);
            }
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, -0.5 * P, 2 * P, 1 * P);
        } else {
            // Normal bullet
            ctx.fillStyle = '#ff5722';
            ctx.fillRect(-3 * P, -1 * P, 6 * P, 2 * P);
            ctx.fillStyle = '#ffeb3b';
            ctx.fillRect(-2 * P, -1 * P, 4 * P, 2 * P);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-1 * P, 0, 2 * P, 1 * P);
        }
    }
}

class ScorePopup extends Entity {
    z = Z_HUD;
    constructor(x, y, text = '+500') {
        super();
        this.x = x;
        this.y = y;
        this.text = text;
        this.vY = -120;
    }
    cycle(elapsed) {
        super.cycle(elapsed);
        this.y += this.vY * elapsed;
        if (this.age > 1.0) {
            this.world?.removeEntity(this);
        }
    }
    render() {
        ctx.wrap(() => {
            ctx.translate(~~this.x, ~~this.y);
            const alpha = between(0, 1 - (this.age / 1.0), 1);
            ctx.globalAlpha = alpha;
            ctx.font = 'bold 26px Courier New, monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#fbbf24';
            ctx.strokeStyle = '#050811';
            ctx.lineWidth = 4;
            ctx.strokeText(this.text, 0, 0);
            ctx.fillText(this.text, 0, 0);
        });
    }
}

class Hunter extends Entity {

    type = 'hunter';
    z = Z_PLAYER;
    categories = ['enemy', 'hunter'];

    radiusX = 10;
    radiusY = 16;
    facing = -1;
    dead = false;

    shootTimer = 0;
    shootInterval = 1.6;
    aimDuration = 0.5;

    constructor(x, y, shootInterval = 1.6) {
        super();
        this.x = x;
        this.y = y;
        this.shootInterval = shootInterval;
        this.shootTimer = rnd(0.4, shootInterval * 0.7); // Prime timer so hunters shoot quickly upon sighting
        this.hitbox.width = this.radiusX * 2;
        this.hitbox.height = this.radiusY * 2;
    }

    hit(hitVX = 0) {
        if (this.dead) return;
        this.dead = true;
        this.deathAge = this.age;
        this.vX = sign(hitVX || 1) * 340;
        this.vY = -400;

        // Hunter defeat SFX
        zzfx(...[.5,,260,.02,.1,.25,2,1.5,-4,2,-80,.08,,,,,,.65,.05]);
        
        // Award bonus kill score (+500)
        G.bonusScore = (G.bonusScore || 0) + 500;
        this.world?.addEntity(new ScorePopup(this.x, this.y - 30, '+500'));
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        // Defeated tumbling physics
        if (this.dead) {
            this.vY += elapsed * 1200;
            this.x += this.vX * elapsed;
            this.y += this.vY * elapsed;
            this.rotation = (this.rotation || 0) + elapsed * 8;
            if (this.age - this.deathAge > 2 || this.y > CANVAS_HEIGHT + 100) {
                this.world?.removeEntity(this);
            }
            return;
        }

        // Track player & check shield tackle collision
        const player = firstItem(this.world.category('player'));
        if (player) {
            // Collision check: Jump stomp kill OR shield tackle kill
            if (!player.dead && this.hitbox.intersects(player.hitbox)) {
                // 1. Jump stomp from above: if player is falling down onto the hunter
                const isStomping = (player.vY > 0) && (player.y < this.y);
                if (isStomping) {
                    this.hit(player.vX || 250);
                    // Bounce player upwards
                    player.vY = -380;
                    player.jumpStartAge = -999;
                    // Stomp bounce SFX & screen shake
                    zzfx(...[.6,,350,.01,.06,.2,1,2.2,-6,4,-200,.08,,,,,,.75,.04]);
                    const camera = firstItem(this.world.category('camera'));
                    camera?.shake(0.18, 6);
                    return;
                }

                // 2. Shield tackle: charging forward into hunter
                if (player.isShielding) {
                    this.hit(player.vX);
                    // Heavy impact SFX & screen shake
                    zzfx(...[.6,,120,.01,.08,.25,2,2.5,-6,4,-200,.08,,,,,,.75,.04]);
                    const camera = firstItem(this.world.category('camera'));
                    camera?.shake(0.2, 8);
                    return;
                } else {
                    // Collision without shield or stomp kills player
                    player.die('hunter');
                    return;
                }
            }

            this.facing = player.x < this.x ? -1 : 1;

            // Shoot when player is approaching from left within range (1000px)
            const inRange = (this.x - player.x > 80) && (this.x - player.x < 1100);
            if (inRange) {
                this.shootTimer += elapsed;
                if (this.shootTimer >= this.shootInterval) {
                    this.shootTimer = 0;
                    this.shoot();
                }
            }
        }
    }

    shoot() {
        if (this.dead) return;

        // Subtle, quiet gunshot pop SFX
        zzfx(...[.18,,360,,.01,.05,4,1.8,-12,,,,,.04,1,,.04,.04,.35,.02]);

        const barrelX = this.x + this.facing * 24;
        const barrelY = this.y - 4;

        this.world.addEntity(new Bullet(barrelX, barrelY, this.facing));
        this.lastShotAge = this.age;
    }

    render() {
        ctx.translate(~~this.x, ~~this.y);
        if (this.dead) {
            ctx.rotate(this.rotation || 0);
        }
        ctx.scale(this.facing, 1);

        const P = 2; // Pixel unit
        const px = (x, y, w = 1, h = 1, color) => {
            if (color) ctx.fillStyle = color;
            ctx.fillRect(x * P, y * P, w * P, h * P);
        };

        // State: Aiming before shooting
        const isAiming = (this.shootInterval - this.shootTimer) <= this.aimDuration;
        const isFiring = (this.age - (this.lastShotAge || -9)) < 0.1;

        // Recoil kickback
        const recoil = isFiring ? -2 : 0;
        ctx.translate(recoil, 0);

        // Safari hunter palette
        const C_HELMET = '#a4b832';
        const C_HELMET_DARK = '#73821a';
        const C_SKIN = '#fed093';
        const C_MUSTACHE = '#1a161e';
        const C_JACKET = '#96aa26';
        const C_JACKET_DARK = '#748418';
        const C_BELT = '#453216';
        const C_SHORTS = '#889c20';
        const C_SOCKS = '#e8ecce';
        const C_BOOTS = '#5c401c';
        const C_GUN_WOOD = '#6a3c1c';
        const C_GUN_METAL = '#8ea1b4';

        // 1. Legs & Boots (ground-aligned at y = 8, 8 * 2 = 16 = radiusY)
        px(-4, 2, 3, 2, C_SHORTS);
        px(-4, 4, 2, 2, C_SKIN);
        px(-4, 6, 2, 1, C_SOCKS);
        px(-5, 7, 3, 1, C_BOOTS);

        px(1, 2, 3, 2, C_SHORTS);
        px(1, 4, 2, 2, C_SKIN);
        px(1, 6, 2, 1, C_SOCKS);
        px(0, 7, 4, 1, C_BOOTS);

        // 2. Torso (Khaki Safari Jacket & Belt)
        ctx.fillStyle = C_JACKET;
        px(-4, -5, 8, 6);  // Jacket main body
        px(-5, -4, 2, 4);  // Left sleeve
        px(3, -4, 2, 4);   // Right sleeve
        px(-3, -1, 2, 2, C_JACKET_DARK); // Pocket flap
        px(1, -1, 2, 2, C_JACKET_DARK);  // Pocket flap
        px(-4, 1, 8, 1, C_BELT);         // Leather belt
        px(-1, 1, 2, 1, '#f9c74f');      // Belt buckle

        // 3. Head & Face
        ctx.fillStyle = C_SKIN;
        px(-3, -9, 6, 4);  // Face
        px(3, -8, 2, 2);   // Nose / cheek

        // Dark Eyes
        px(0, -8, 1, 1, '#1a161e');
        px(2, -8, 1, 1, '#1a161e');

        // Handlebar Mustache
        ctx.fillStyle = C_MUSTACHE;
        px(-2, -7, 7, 2);  // Mustache core
        px(-4, -6, 2, 1);  // Left curl tip
        px(4, -6, 3, 1);   // Right upward curl tip

        // 4. Safari Pith Helmet
        ctx.fillStyle = C_HELMET;
        px(-3, -13, 6, 2); // Top crown
        px(-4, -11, 8, 2); // Dome body
        px(-7, -9, 14, 2); // Wide brim
        px(-7, -8, 14, 1, C_HELMET_DARK); // Brim underside shadow
        px(-1, -14, 2, 1, '#536010');      // Helmet top knob

        // 5. Rifle & Hands
        ctx.wrap(() => {
            if (isAiming || isFiring) {
                // Raised Aiming Pose
                ctx.translate(0, -3);

                px(-3, 0, 4, 2, C_GUN_WOOD);
                px(1, -1, 10, 2, C_GUN_METAL);
                px(10, -2, 1, 1, '#2c3e50');

                px(-1, 0, 2, 2, C_SKIN);
                px(4, 0, 2, 2, C_SKIN);

                // Muzzle Flash
                if (isFiring) {
                    ctx.fillStyle = '#ffeb3b';
                    px(11, -3, 3, 5);
                    ctx.fillStyle = '#ff5722';
                    px(12, -2, 3, 3);
                    ctx.fillStyle = '#ffffff';
                    px(12, -1, 1, 1);
                }
            } else {
                // Resting Gun Pose
                px(-4, 0, 3, 2, C_GUN_WOOD);
                px(-1, -2, 3, 2, C_GUN_WOOD);
                px(2, -4, 6, 2, C_GUN_METAL);
                px(8, -5, 1, 1, '#2c3e50');

                px(-2, 0, 2, 2, C_SKIN);
                px(2, -2, 2, 2, C_SKIN);
            }
        });
    }
}
