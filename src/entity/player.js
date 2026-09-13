class Player extends Entity {

    type = 'player';
    z = Z_PLAYER;
    categories = ['player'];

    radiusX = 14;
    radiusY = 16;

    vX = 400;
    vY = 0;
    facing = 1;
    dead = false;

    // Rainbow Dash & Rainbow Dust
    dust = 100;
    maxDust = 100;
    dustCooldown = 0;
    dashing = false;

    runPhase = 0;
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

    get isShielding() {
        return !this.dead && this.dashing && this.landed;
    }

    die(reason = '') {
        if (this.dead) return;
        this.dead = true;
        this.deathAge = this.age;
        this.dashing = false;
        this.vX = 60;
        this.vY = -380;
        this.rotation = 0;

        // Retro impact/crunch SFX
        zzfx(...[.8,,180,,.04,.3,4,3.5,-12,,,,.1,2,,.1,.1,.8,.06]);

        const camera = firstItem(this.world?.category('camera'));
        camera?.shake(0.3, 10);
    }

    jump() {
        if (this.dead || !this.landed || !this.releasedJump) return;

        this.releasedJump = false;
        this.jumpStartAge = this.age;
        this.jumpStartY = this.y;
        this.jumpHoldTime = 0;
        this.lastLanded = -9;

        // Jump SFX
        zzfx(...[.2,,292,.03,.02,.07,1,.4,,131,,,,,,,,.57,.01]);
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        // 1. Death physics & animation
        if (this.dead) {
            this.vY += elapsed * 1600;
            this.y += this.vY * elapsed;
            this.x += this.vX * elapsed;
            this.rotation = (this.rotation || 0) + elapsed * 8;
            return;
        }

        // 2. Rainbow Dash & Rainbow Dust Consumption / Recharge (3s delay if completely empty)
        const dashRequested = downKeys[16] || downKeys[40] || downKeys[83] || downKeys[68] || DASH_TRIGGER;

        if (this.dustCooldown > 0) {
            this.dustCooldown = max(0, this.dustCooldown - elapsed);
            this.dashing = false;
        } else if (dashRequested && (this.dashing ? this.dust > 0 : this.dust >= 25)) {
            if (!this.dashing) {
                // Dash activation chime SFX
                zzfx(...[.4,,600,.01,.05,.18,1,2,,,-200,.05,,,,,,.8,.02]);
            }
            this.dashing = true;
            this.dust = max(0, this.dust - elapsed * 28);
            if (this.dust <= 0) {
                this.dust = 0;
                this.dashing = false;
                this.dustCooldown = 3.0; // 3-second lockout before refilling when completely depleted
                zzfx(...[.3,,150,.01,.08,.2,1,1.5,-4,2,-80,.08,,,,,,.65,.05]);
            }
        } else {
            this.dashing = false;
            this.dust = min(this.maxDust, this.dust + elapsed * 20);
        }

        // 3. Automatic continuous forward runner acceleration
        const baseTargetVX = min(950, 420 + max(0, this.x - 200) * 0.035);
        const targetVX = baseTargetVX + (this.dashing ? 260 : 0);
        const accel = this.landed ? (this.dashing ? 4000 : 3000) : 1200;
        this.vX += between(-elapsed * accel, targetVX - this.vX, elapsed * accel);
        this.x += this.vX * elapsed;
        this.facing = 1;

        // Gallop animation phase
        if (this.landed && abs(this.vX) > 10) {
            this.runPhase += abs(this.vX) * elapsed * 0.035;
        }

        // 4. Jump input (Space, Up Arrow, W, or Screen Tap)
        const jumpPressed = downKeys[38] || downKeys[32] || (TOUCH_DOWN && !DASH_TRIGGER);
        if (jumpPressed) {
            if (!this.releasedJump) {
                this.jumpHoldTime += elapsed;
            }
            this.jump();
        } else {
            this.releasedJump = true;
        }

        // Jump physics curve (responsive Chrome Dino feel + higher platform clearance)
        const jumpPower = min(1, this.jumpHoldTime / 0.14);
        const jumpHeight = 40 + jumpPower * 195;
        const riseDuration = 0.14 + jumpPower * 0.15;
        const riseProgress = between(0, (this.age - this.jumpStartAge) / riseDuration, 1);

        if (riseProgress < 1) {
            this.y = -easeOutSine(riseProgress) * jumpHeight + this.jumpStartY;
            this.vY = 0;
        } else {
            this.y += this.vY * elapsed;
            this.vY += elapsed * 2200;
        }

        // 5. Ground & Platform Collision resolution
        const { y, landed } = this;

        for (const structure of this.world.category('structure')) {
            structure.reposition?.(this, this.radiusX, this.radiusY, this.previousX, this.previousY);
        }

        // Detect landing
        if (this.y < y) {
            this.vY = 0;
            this.lastLanded = this.age;
        } else if (this.y > y) {
            this.jumpStartAge = -999;
        }

        // Landing sound
        if (this.landed && !landed) {
            zzfx(...[.05,,339,.01,.01,,4,4.4,11,-6,-486,.09,,,,,,.64,.03,.2]);
        }
    }

    render() {
        ctx.translate(~~this.x, ~~this.y);
        if (this.dead) {
            ctx.rotate(this.rotation || 0);
        }
        ctx.scale(this.facing, 1);

        const moving = !this.dead && this.landed && abs(this.vX) > 15;
        const bob = moving ? -abs(sin(this.runPhase * 2)) * 2 : 0;
        ctx.translate(0, ~~bob);

        const P = 2; // Compact retro pixel size
        const px = (x, y, w = 1, h = 1, color) => {
            if (color) ctx.fillStyle = color;
            ctx.fillRect(x * P, y * P, w * P, h * P);
        };

        // Retro Rainbow palette
        const C_IVORY = '#fffdf0';
        const C_SHADE = '#9ca6d6';
        const C_DARK = '#6b72a6';
        const C_EYE = '#221535';
        const C_HOOF = '#1e1438';

        // Rainbow Spectrum
        const C_RED = '#ff3b30';
        const C_ORANGE = '#ff9500';
        const C_YELLOW = '#ffcc00';
        const C_GREEN = '#34c759';
        const C_CYAN = '#00c7be';
        const C_BLUE = '#007aff';
        const C_PURPLE = '#af52de';
        const C_MAGENTA = '#ff2d55';

        // Leg step offsets
        let fFarX = 0, fNearX = 0, bFarX = 0, bNearX = 0;
        if (!this.landed) {
            fFarX = 2; fNearX = 3;
            bFarX = -2; bNearX = -3;
        } else if (moving) {
            const s = sin(this.runPhase * 2);
            fNearX = ~~(s * 2);
            fFarX = ~~(-s * 2);
            bNearX = ~~(-s * 2);
            bFarX = ~~(s * 2);
        }

        // Hoof bottom is at y = 8 (8 * 2 = 16 = radiusY, perfectly on ground)
        const renderPixelLeg = (baseX, dx, isFar) => {
            const coatColor = isFar ? C_DARK : C_IVORY;
            px(baseX, 0, 2, 3, coatColor);
            px(baseX + dx, 3, 2, 3, coatColor);
            px(baseX + dx - 1, 4, 1, 2, isFar ? C_DARK : C_SHADE);
            px(baseX + dx, 6, 2, 1, isFar ? C_PURPLE : C_MAGENTA);
            px(baseX + dx, 7, 3, 1, C_HOOF);
        };

        // 1. Far Legs
        renderPixelLeg(-5, bFarX, true);
        renderPixelLeg(3, fFarX, true);

        // 2. Flowing Rainbow Tail
        ctx.wrap(() => {
            ctx.translate(-6 * P, -3 * P);

            const tailAngle = moving ? -0.45 + sin(this.runPhase * 2) * 0.15 : sin(this.age * 2.5) * 0.08;
            ctx.rotate(tailAngle);

            const w = moving ? this.runPhase * 2 : this.age * 2;
            const w1 = ~~(sin(w) * 1.0);
            const w2 = ~~(sin(w - 0.7) * 1.3);
            const w3 = ~~(sin(w - 1.4) * 1.6);

            px(-2, 0 + w1, 2, 2, C_RED);
            px(-4, 0 + w1, 2, 2, C_ORANGE);
            px(-6, 0 + w2, 2, 2, C_YELLOW);
            px(-8, 1 + w2, 2, 2, C_GREEN);
            px(-10, 1 + w3, 2, 2, C_CYAN);
            px(-12, 1 + w3, 2, 1, C_PURPLE);
        });

        // 3. Torso & Body Base
        ctx.fillStyle = C_IVORY;
        px(-6, -4, 9, 3); // Spine
        px(2, -5, 2, 2);  // Withers
        px(-7, -3, 2, 3); // Rump
        px(2, -3, 2, 3);  // Chest

        ctx.fillStyle = C_SHADE;
        px(-5, -1, 8, 1);
        px(-6, 0, 7, 1);

        // 4. Head Pose: Upright during normal gallop, tilted down into charge when DASHING!
        const targetHeadTilt = this.dashing ? (0.52 + sin(this.runPhase * 2) * 0.10) : (sin(this.age * 2) * 0.03);
        this.currentHeadTilt = (this.currentHeadTilt === undefined) ? targetHeadTilt : (this.currentHeadTilt + (targetHeadTilt - this.currentHeadTilt) * 0.35);

        ctx.wrap(() => {
            ctx.translate(2 * P, -4 * P);
            ctx.rotate(this.currentHeadTilt);
            ctx.translate(-2 * P, 4 * P);

            // Neck
            ctx.fillStyle = C_IVORY;
            px(3, -7, 2, 3);
            px(4, -9, 2, 3);

            // Head & Muzzle
            px(5, -10, 3, 3); // Forehead
            px(7, -8, 3, 2);  // Muzzle
            px(6, -6, 2, 1);  // Jaw

            // Alert Ear
            px(4, -12, 2, 3);
            px(4, -11, 1, 1, C_MAGENTA);

            // Nostril
            px(9, -7, 1, 1, C_EYE);

            // Eye
            px(6, -9, 2, 1, C_EYE);
            px(7, -9, 1, 1, C_CYAN);

            // 5. Rainbow Mane
            const maneWave = moving ? ~~(sin(this.runPhase * 2) * 1.0) : 0;
            px(2 + maneWave, -11, 2, 2, C_RED);
            px(3 + maneWave, -10, 2, 2, C_ORANGE);
            px(0 + maneWave, -9, 2, 2, C_YELLOW);
            px(1 + maneWave, -8, 2, 2, C_GREEN);
            px(-2 + maneWave, -7, 2, 2, C_CYAN);
            px(-1 + maneWave, -6, 2, 2, C_PURPLE);

            // 6. Rainbow Spiral Horn
            px(7, -11, 2, 2, C_RED);
            px(9, -13, 2, 2, C_ORANGE);
            px(11, -15, 2, 2, C_YELLOW);
            px(13, -17, 1, 2, C_CYAN);
            px(14, -18, 1, 1, '#ffffff');

            // 7. Magical Rainbow Horn Shield Barrier (Only active during Rainbow Dash!)
            if (this.dashing && this.landed) {
                ctx.wrap(() => {
                    const hx = 14, hy = -18;
                    const pulse = sin(this.runPhase * 6);

                    ctx.translate(hx * P, hy * P);
                    ctx.rotate(-PI / 4);

                    ctx.globalAlpha = 0.38 + sin(this.runPhase * 4) * 0.12;

                    // Outer Rainbow Energy Dome
                    px(3 + pulse, -2, 2, 5, C_CYAN);
                    px(2 + pulse, -4, 2, 2, C_YELLOW);
                    px(0 + pulse, -6, 2, 2, C_ORANGE);
                    px(-3 + pulse, -7, 3, 2, C_RED);
                    px(-6, -7, 3, 2, C_MAGENTA);

                    px(2 + pulse, 3, 2, 2, C_GREEN);
                    px(0 + pulse, 5, 2, 2, C_BLUE);
                    px(-3 + pulse, 6, 3, 2, C_PURPLE);
                    px(-6, 6, 3, 2, C_MAGENTA);

                    // Inner Chromatic Core
                    px(1 + pulse, -1, 2, 3, C_MAGENTA);
                    px(0 + pulse, -3, 2, 2, C_YELLOW);
                    px(0 + pulse, 2, 2, 2, C_CYAN);
                    px(-2 + pulse, -5, 2, 2, C_RED);
                    px(-2 + pulse, 4, 2, 2, C_PURPLE);

                    // Radiant White Center Gleam
                    ctx.fillStyle = '#ffffff';
                    px(2 + pulse, -1, 1, 3);
                    px(0, 0, 1, 1);
                });
            }
        });

        // 8. Near Legs
        renderPixelLeg(-5, bNearX, false);
        renderPixelLeg(3, fNearX, false);
    }
}
