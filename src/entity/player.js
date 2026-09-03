class Player extends Entity {

    type = 'player';
    z = Z_PLAYER;
    categories = ['player'];

    radiusX = 16;
    radiusY = 24;

    vX = 0;
    vY = 0;
    facing = 1;

    lastLanded = -9;
    jumpHoldTime = 0;
    releasedJump = true;
    jumpStartAge = -9;
    jumpStartY = 0;

    constructor() {
        super();
        this.hitbox.width = this.radiusX * 2;
        this.hitbox.height = this.radiusY * 2;
    }

    get landed() {
        return this.age - this.lastLanded < 0.1;
    }

    jump() {
        if (!this.landed && this.age - (this.lastWallContact || 0) > 0.1) return;
        if (!this.releasedJump) return;

        this.releasedJump = false;
        this.jumpStartAge = this.age;
        this.jumpStartY = this.y;
        this.jumpHoldTime = 0;
        this.lastLanded = -9;

        // Sound effect (zzfx jump)
        zzfx(...[.2,,292,.03,.02,.07,1,.4,,131,,,,,,,,.57,.01]);

        // Wall jump impulse
        if (this.wallDirection) {
            this.vX = -this.wallDirection * 400;
            this.facing = -this.wallDirection;
        }

        // Particle puff
        for (let i = 0; i < 8; i++) {
            const p = this.world.addEntity(new Particle());
            p.x = this.x + rnd(-8, 8);
            p.y = this.y + this.radiusY;
            p.size = rnd(3, 6);
            p.color = '#38bdf8';
            p.animate(rnd(0.2, 0.4), {
                x: rnd(-30, 30),
                y: rnd(-10, -30),
                size: -p.size,
                alpha: -1,
            });
        }
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        // 1. Horizontal input
        let dirX = 0;
        if (downKeys[37]) dirX = -1;
        if (downKeys[39]) dirX = 1;

        const targetVX = dirX * 350;
        const accel = this.landed ? 3000 : 1500;
        this.vX += between(-elapsed * accel, targetVX - this.vX, elapsed * accel);
        this.x += this.vX * elapsed;

        if (dirX) this.facing = dirX;

        // 2. Jump input
        if (downKeys[38] || downKeys[32]) {
            if (!this.releasedJump) {
                this.jumpHoldTime += elapsed;
            }
            this.jump();
        } else {
            this.releasedJump = true;
        }

        // Jump physics
        const jumpPower = min(1, this.jumpHoldTime / 0.12);
        const jumpHeight = 30 + jumpPower * 140;
        const riseDuration = 0.12 + jumpPower * 0.12;
        const riseProgress = between(0, (this.age - this.jumpStartAge) / riseDuration, 1);

        if (riseProgress < 1) {
            this.y = -easeOutSine(riseProgress) * jumpHeight + this.jumpStartY;
            this.vY = 0;
        } else {
            this.y += this.vY * elapsed;
            this.vY += elapsed * (this.wallDirection ? 300 : 1800); // Slower fall on wall
        }

        // 3. Collision resolution
        const { x, y, landed } = this;
        this.wallDirection = 0;

        for (const structure of this.world.category('structure')) {
            structure.reposition(this, this.radiusX, this.radiusY, this.previousX, this.previousY);
        }

        // Detect landing / ceiling
        if (this.y < y) {
            this.vY = 0;
            this.lastLanded = this.age;
        } else if (this.y > y) {
            this.jumpStartAge = -999;
        }

        // Detect wall contact
        if (x !== this.x && !this.landed) {
            this.wallDirection = sign(x - this.x);
            this.lastWallContact = this.age;
        }

        // Landing particles & sound
        if (this.landed && !landed) {
            zzfx(...[.05,,339,.01,.01,,4,4.4,11,-6,-486,.09,,,,,,.64,.03,.2]);
            for (let i = 0; i < 6; i++) {
                const p = this.world.addEntity(new Particle());
                p.x = this.x + rnd(-10, 10);
                p.y = this.y + this.radiusY;
                p.size = rnd(3, 5);
                p.color = '#94a3b8';
                p.animate(rnd(0.2, 0.3), {
                    x: rnd(-40, 40),
                    y: rnd(-5, -20),
                    size: -p.size,
                    alpha: -1,
                });
            }
        }
    }

    render() {
        ctx.translate(this.x, this.y);
        ctx.scale(this.facing, 1);

        // Body glow/shadow
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;

        // Torso / Main suit
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(-this.radiusX, -this.radiusY, this.radiusX * 2, this.radiusY * 2);

        // Visor / Eyes
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(2, -this.radiusY + 6, 12, 8);

        // Core light
        ctx.fillStyle = '#f0f9ff';
        ctx.fillRect(-4, -2, 8, 8);

        // Thruster flame when jumping
        if (!this.landed && this.vY < 0) {
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.moveTo(-6, this.radiusY);
            ctx.lineTo(0, this.radiusY + 12 + sin(this.age * 30) * 4);
            ctx.lineTo(6, this.radiusY);
            ctx.fill();
        }
    }
}
