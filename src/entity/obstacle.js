class ForestHut extends Entity {

    type = 'forest_hut';
    z = Z_PLAYER;
    categories = ['obstacle', 'cactus', 'building', 'forest_hut'];

    constructor(x, groundY) {
        super();
        this.x = x;
        this.groundY = groundY;
        this.width = 44;
        this.height = 46;

        this.radiusX = 22;
        this.radiusY = 23;
        this.y = groundY - 23;

        this.hitbox.width = 30;
        this.hitbox.height = 38;
    }

    cycle(elapsed) {
        super.cycle(elapsed);
        this.hitbox.x = this.x;
        this.hitbox.y = this.y;

        const player = firstItem(this.world.category('player'));
        if (player && !player.dead && this.hitbox.intersects(player.hitbox)) {
            // Indestructible Wooden Lookout Watchtower: must be jumped over!
            player.die('forest_hut');
        }
    }

    render() {
        ctx.translate(~~this.x, ~~this.y);
        const P = 2;
        const px = (x, y, w = 1, h = 1, color) => {
            if (color) ctx.fillStyle = color;
            ctx.fillRect(x * P, y * P, w * P, h * P);
        };

        const gy = 11; // Ground contact line in grid units

        // 1. Base Foliage & Tree Canopies (Left and Right of the Stilts)
        // Left Bush
        px(-13, gy - 8, 7, 8, '#064e3b');
        px(-12, gy - 7, 5, 7, '#15803d');
        px(-11, gy - 6, 3, 4, '#22c55e');
        px(-10, gy - 5, 2, 2, '#4ade80');
        px(-10, gy - 3, 2, 3, '#78350f');

        // Right Bush
        px(6, gy - 8, 7, 8, '#064e3b');
        px(7, gy - 7, 5, 7, '#15803d');
        px(8, gy - 6, 3, 4, '#22c55e');
        px(8, gy - 5, 2, 2, '#4ade80');
        px(8, gy - 3, 2, 3, '#78350f');

        // Ground Grass & Earthy Path Footing
        px(-13, gy - 1, 26, 1, '#16a34a');
        px(-11, gy - 2, 22, 1, '#22c55e');
        px(-2, gy - 1, 4, 1, '#d97706');

        // 2. Timber Stilts (4 Tall Legs) & Diagonal Cross X-Braces
        // Left Stilt
        px(-6, gy - 15, 2, 15, '#78350f');
        px(-6, gy - 15, 1, 15, '#b45309');

        // Right Stilt
        px(4, gy - 15, 2, 15, '#451a03');
        px(4, gy - 15, 1, 15, '#92400e');

        // Diagonal X-Braces
        for (let i = 0; i < 5; i++) {
            px(-4 + i * 1.6, gy - 13 + i * 2, 2, 1.5, '#92400e');
            px(3 - i * 1.6, gy - 13 + i * 2, 2, 1.5, '#78350f');
        }

        // Central hanging rope / ladder
        px(0, gy - 14, 1, 10, '#b45309');
        px(-1, gy - 4, 2, 2, '#78350f');

        // 3. Mid-Deck Platform & Observation Railings
        px(-8, gy - 16, 16, 2, '#92400e');
        px(-8, gy - 14, 16, 1, '#451a03');

        // Balustrade safety railing box
        px(-7, gy - 20, 14, 4, '#78350f');
        px(-5, gy - 19, 2, 2, '#451a03');
        px(-1, gy - 19, 2, 2, '#451a03');
        px(3, gy - 19, 2, 2, '#451a03');
        px(-8, gy - 21, 16, 1, '#d97706');

        // Interior opening & upper support posts
        px(-6, gy - 25, 12, 4, '#1c1936');
        px(-6, gy - 25, 2, 5, '#b45309');
        px(4, gy - 25, 2, 5, '#78350f');
        px(-2, gy - 25, 1, 4, '#451a03');
        px(1, gy - 25, 1, 4, '#291102');

        // 4. Pyramid Pitch Timber Shingle Roof
        px(-9, gy - 26, 18, 1, '#451a03');
        px(-8, gy - 28, 16, 2, '#78350f');
        px(-7, gy - 28, 8, 2, '#b45309');

        px(-6, gy - 30, 12, 2, '#92400e');
        px(-5, gy - 30, 6, 2, '#d97706');

        px(-4, gy - 32, 8, 2, '#b45309');
        px(-3, gy - 32, 4, 2, '#f59e0b');

        px(-2, gy - 33, 4, 1, '#fbbf24');
        px(-1, gy - 34, 2, 1, '#fde68a');
    }
}

// Backward-compatible aliases for procedural spawning and categories
const Building = ForestHut;
const Cactus = ForestHut;

class PlatformTower extends Entity {

    type = 'platform';
    z = Z_STRUCTURE;
    categories = ['platform'];

    constructor(x, y, width = 240, height = 18) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.radiusX = width / 2;
        this.radiusY = height / 2;
        this.hitbox.width = width;
        this.hitbox.height = height;
    }

    cycle(elapsed) {
        super.cycle(elapsed);
        this.hitbox.x = this.x;
        this.hitbox.y = this.y;
    }

    render() {
        ctx.translate(~~this.x, ~~this.y);
        const w = this.width;
        const h = this.height;

        // Dark earthy soil platform body
        ctx.fillStyle = '#3d1d07';
        ctx.fillRect(-w / 2, -h / 2, w, h);

        // Under-edge bedrock trim
        ctx.fillStyle = '#261102';
        ctx.fillRect(-w / 2, h / 2 - 3, w, 3);

        // Lush green meadow top layer
        ctx.fillStyle = '#15803d';
        ctx.fillRect(-w / 2, -h / 2, w, 5);
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(-w / 2, -h / 2, w, 3);
        ctx.fillStyle = '#4ade80';
        ctx.fillRect(-w / 2, -h / 2, w, 1);

        // Grass tufts along surface
        for (let gx = -w / 2 + 12; gx < w / 2 - 12; gx += 36) {
            ctx.fillStyle = '#4ade80';
            ctx.fillRect(gx, -h / 2 - 2, 2, 3);
            ctx.fillRect(gx + 3, -h / 2 - 3, 2, 4);
        }

        // Subtle edge outline
        ctx.strokeStyle = '#1e0c03';
        ctx.lineWidth = 1;
        ctx.strokeRect(-w / 2, -h / 2, w, h);
    }
}

class CloudPlatform extends Entity {

    type = 'cloud_platform';
    z = Z_STRUCTURE;
    categories = ['platform'];

    constructor(x, y, width = 220, height = 18) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.radiusX = width / 2;
        this.radiusY = height / 2;
        this.hitbox.width = width;
        this.hitbox.height = height;
    }

    cycle(elapsed) {
        super.cycle(elapsed);
        this.hitbox.x = this.x;
        this.hitbox.y = this.y;
    }

    render() {
        ctx.translate(~~this.x, ~~this.y);
        const w = this.width;
        const topY = -this.height / 2;
        const botY = this.height / 2;

        const N = max(3, ~~(w / 35));
        const step = w / N;

        const drawCloudShape = (offsetY = 0) => {
            ctx.beginPath();
            // Flat top line across the entire platform
            ctx.moveTo(-w / 2, topY + offsetY);
            ctx.lineTo(w / 2, topY + offsetY);

            // Right side down
            ctx.quadraticCurveTo(w / 2 + 3, topY + offsetY, w / 2 + 3, botY + offsetY - 3);
            ctx.quadraticCurveTo(w / 2 + 3, botY + offsetY, w / 2, botY + offsetY);

            // Scallops along the bottom from right to left (U U U U U)
            for (let i = N - 1; i >= 0; i--) {
                const x0 = -w / 2 + i * step;
                const x1 = -w / 2 + (i + 1) * step;
                const mx = (x0 + x1) / 2;
                ctx.quadraticCurveTo(mx, botY + offsetY + 10, x0, botY + offsetY);
            }

            // Left side up
            ctx.quadraticCurveTo(-w / 2 - 3, botY + offsetY, -w / 2 - 3, topY + offsetY + 3);
            ctx.quadraticCurveTo(-w / 2 - 3, topY + offsetY, -w / 2, topY + offsetY);
            ctx.closePath();
            ctx.fill();
        };

        // 1. Underside soft shadow layer
        ctx.fillStyle = '#b8b5d6';
        drawCloudShape(4);

        // 2. Pure white flat cloud platform body
        ctx.fillStyle = '#ffffff';
        drawCloudShape(0);

        // 3. Crisp top surface shimmer highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fillRect(-w / 2 + 2, topY + 1, w - 4, 2);
    }
}


class SmallTree extends Entity {

    type = 'small_tree';
    z = Z_PLAYER;
    categories = ['obstacle', 'cactus', 'destructible'];

    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 26;
        this.radiusX = 10;
        this.radiusY = 13;
        this.hitbox.width = 16;
        this.hitbox.height = 22;
    }

    cycle(elapsed) {
        super.cycle(elapsed);
        this.hitbox.x = this.x;
        this.hitbox.y = this.y;

        const player = firstItem(this.world.category('player'));
        if (player && !player.dead && this.hitbox.intersects(player.hitbox)) {
            // If dashing or stomping from above -> smash tree!
            if (player.dashing || (player.vY > 80 && player.y < this.y)) {
                // Break sound effect
                zzfx(...[.5,,380,.01,.04,.12,1,2.5,-8,1,-180,.06,,,,,,.75,.04]);
                G.bonusScore = (G.bonusScore || 0) + 200;
                this.world.addEntity(new ScorePopup(this.x, this.y - 12, '+200'));

                // Leaves & wood splinters
                for (let i = 0; i < 6; i++) {
                    const p = this.world.addEntity(new SparkleParticle(this.x, this.y));
                    p.color = i % 2 === 0 ? '#4ade80' : '#78350f';
                    p.vX = rnd(-150, 150);
                    p.vY = rnd(-220, -50);
                }
                this.world.removeEntity(this);
                return;
            }

            // Otherwise, collision hurts player!
            player.die('tree');
        }
    }

    render() {
        ctx.translate(~~this.x, ~~this.y);
        const P = 2;
        const px = (x, y, w = 1, h = 1, color) => {
            if (color) ctx.fillStyle = color;
            ctx.fillRect(x * P, y * P, w * P, h * P);
        };
        const gy = 6;

        // Slender bamboo stalks & trunk
        px(-2, gy - 8, 2, 8, '#78350f');
        px(1, gy - 7, 2, 7, '#92400e');
        px(-1, gy - 8, 1, 8, '#a16207');

        // Lush green leafy bush canopy
        px(-5, gy - 12, 10, 5, '#16a34a');
        px(-4, gy - 13, 8, 6, '#22c55e');
        px(-2, gy - 14, 4, 3, '#4ade80');
        px(2, gy - 10, 3, 3, '#86efac');
    }
}

class Tiger extends Entity {

    type = 'tiger';
    z = Z_PLAYER;
    categories = ['enemy', 'tiger', 'obstacle'];

    radiusX = 18;
    radiusY = 12;
    vX = -380; // Sprints very fast towards player

    constructor(x, y, speed = -380) {
        super();
        this.x = x;
        this.y = y;
        this.vX = speed;
        this.hitbox.width = 30;
        this.hitbox.height = 20;
    }

    cycle(elapsed) {
        super.cycle(elapsed);
        this.x += this.vX * elapsed;
        this.hitbox.x = this.x;
        this.hitbox.y = this.y;

        const player = firstItem(this.world.category('player'));
        if (player && !player.dead && this.hitbox.intersects(player.hitbox)) {
            // 1. Shield tackle or Rainbow Dash defeat
            if (player.isShielding || player.dashing) {
                G.bonusScore = (G.bonusScore || 0) + 500;
                this.world.addEntity(new ScorePopup(this.x, this.y - 16, '+500'));
                zzfx(...[.7,,160,.01,.06,.2,2,3,-18,2,-150,.08,,,,,,.8,.05]);
                const camera = firstItem(this.world.category('camera'));
                camera?.shake(0.2, 8);
                for (let i = 0; i < 8; i++) {
                    const p = this.world.addEntity(new SparkleParticle(this.x, this.y));
                    p.color = i % 2 === 0 ? '#ea580c' : '#fbbf24';
                    p.vX = rnd(-180, 180);
                    p.vY = rnd(-250, -80);
                }
                this.world.removeEntity(this);
                return;
            }

            // 2. Check stomp from above:
            const playerBottom = player.y + player.radiusY;
            const tigerTop = this.y - this.radiusY;

            if (player.vY > 30 && playerBottom <= tigerTop + 16) {
                // Stomp victory!
                player.vY = -380;
                player.lastLanded = -9;
                G.bonusScore = (G.bonusScore || 0) + 500;
                this.world.addEntity(new ScorePopup(this.x, this.y - 16, '+500'));

                // Defeat roar / crunch SFX
                zzfx(...[.7,,160,.01,.06,.2,2,3,-18,2,-150,.08,,,,,,.8,.05]);
                const camera = firstItem(this.world.category('camera'));
                camera?.shake(0.18, 6);

                // Defeat particles
                for (let i = 0; i < 8; i++) {
                    const p = this.world.addEntity(new SparkleParticle(this.x, this.y));
                    p.color = i % 2 === 0 ? '#ea580c' : '#fbbf24';
                    p.vX = rnd(-180, 180);
                    p.vY = rnd(-250, -80);
                }
                this.world.removeEntity(this);
                return;
            }

            // Touched tiger without shield/dash/stomp -> player dies
            player.die('tiger');
        }
    }

    render() {
        ctx.translate(~~this.x, ~~this.y);
        ctx.scale(-1, 1); // Facing left towards player

        const P = 2;
        const px = (x, y, w = 1, h = 1, color) => {
            if (color) ctx.fillStyle = color;
            ctx.fillRect(x * P, y * P, w * P, h * P);
        };

        const gallop = sin(this.age * 22);
        const fLeg = ~~(gallop * 3);
        const bLeg = ~~(-gallop * 3);

        const C_ORANGE = '#ea580c';
        const C_DARK = '#1c0a00';
        const C_WHITE = '#fef08a';

        // Legs
        px(-7 + bLeg, 2, 2, 4, C_ORANGE);
        px(-7 + bLeg, 5, 2, 2, C_DARK);
        px(6 + fLeg, 2, 2, 4, C_ORANGE);
        px(6 + fLeg, 5, 2, 2, C_DARK);

        // Body
        px(-8, -4, 16, 7, C_ORANGE);
        px(-6, -1, 12, 3, C_WHITE); // Belly

        // Tiger Stripes
        px(-5, -4, 1, 5, C_DARK);
        px(-2, -4, 1, 6, C_DARK);
        px(1, -4, 1, 5, C_DARK);
        px(4, -4, 1, 4, C_DARK);

        // Tail
        px(-10, -6 + ~~(gallop * 2), 3, 2, C_ORANGE);
        px(-11, -8 + ~~(gallop * 2), 2, 2, C_DARK);

        // Head & Jaw
        px(7, -7, 6, 6, C_ORANGE);
        px(10, -3, 3, 3, C_WHITE); // Muzzle
        px(8, -8, 2, 2, C_DARK);   // Ear
        px(9, -6, 2, 1, '#fef08a'); // Glowing eye
        px(11, -5, 1, 1, '#000');
    }
}



