class GameplayScreen extends WorldScreen {

    constructor() {
        super();

        // 1. Add Infinite Scrolling Structure
        this.structure = this.world.addEntity(new Structure());

        // 2. Add Runner Player
        this.player = this.world.addEntity(new Player());
        this.player.x = 200;
        this.player.y = GROUND_Y - 16;

        // 3. Add Smooth Tracking Camera
        const camera = this.world.addEntity(new Camera());
        camera.target = this.player;
        camera.x = this.player.x + 240;
        camera.y = 460;

        // 4. Add HUD
        this.world.addEntity(new HUD(this.player));

        // State variables
        this.spawnX = 850;
        this.lastMilestone = 0;
        this.bonusScore = 0;
        this.gameOverTime = 0;
        this.releasedRestart = false;

        G.score = 0;
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        if (!this.isForeground()) return;

        // 1. Live Gameplay Loop
        if (!this.player.dead) {
            // Distance-based score
            const distScore = ~~max(0, (this.player.x - 200) / 18);
            G.score = distScore + this.bonusScore;

            // Milestone sound fanfare every 100 meters (Classic Chrome Dino beep)
            const currentMilestone = floor(G.score / 100) * 100;
            if (currentMilestone > this.lastMilestone && currentMilestone >= 100) {
                this.lastMilestone = currentMilestone;
                zzfx(...[.3,,850,.01,.06,.15,,,,,-120,.08,,,,,,.8,.02]);
            }

            // Procedural Obstacle Spawner Loop (generates ahead of camera)
            while (this.spawnX < this.player.x + 1600) {
                this.spawnNextObstacle();
            }

            // Garbage Collection: remove passed entities behind runner
            const cutoffX = this.player.x - 700;
            for (const categoryId of ['cactus', 'platform', 'enemy', 'bullet']) {
                for (const entity of this.world.category(categoryId)) {
                    if (entity.x < cutoffX) {
                        this.world.removeEntity(entity);
                    }
                }
            }

            // Pause (ESC key = 27)
            this.releasedPause ||= !downKeys[27];
            if (this.releasedPause && downKeys[27]) {
                this.releasedPause = false;
                G.navigate(new PauseScreen()).awaitCompletion();
            }
        } else {
            // 2. Game Over & Instant Restart Loop
            if (G.score > G.highScore) {
                G.highScore = G.score;
                localStorage[nomangle("hs")] = G.highScore;
            }

            this.gameOverTime += elapsed;

            // Wait for key release before allowing instant restart to prevent accidental triggers
            if (!downKeys[32] && !downKeys[38] && !TOUCH_DOWN) {
                this.releasedRestart = true;
            }

            if (this.gameOverTime > 0.35 && this.releasedRestart) {
                const restartTriggered = downKeys[32] || downKeys[38] || TOUCH_DOWN;
                if (restartTriggered) {
                    downKeys[32] = false;
                    downKeys[38] = false;
                    TOUCH_DOWN = false;
                    G.navigate(new GameplayScreen(), true);
                }
            }
        }
    }

    spawnNextObstacle() {
        const sx = this.spawnX;
        const progress = min(1, (this.player.x - 200) / 12000); // 0 to 1 scaling difficulty
        const gapReduction = progress * 120;
        const roll = rnd(0, 100);

        if (roll < 25) {
            // Pattern 1: Single Cactus (Small or Tall)
            const variant = rnd(0, 1) < 0.6 ? 0 : 1;
            this.world.addEntity(new Cactus(sx, GROUND_Y, variant));
            this.spawnX += max(420, rnd(460, 680) - gapReduction);
        } else if (roll < 45) {
            // Pattern 2: Clustered Cacti (Double or Triple)
            const variant = progress > 0.3 && rnd(0, 1) < 0.5 ? 3 : 2;
            this.world.addEntity(new Cactus(sx, GROUND_Y, variant));
            this.spawnX += max(450, rnd(500, 720) - gapReduction);
        } else if (roll < 65) {
            // Pattern 3: Ground Hunters (Standalone or with Cactus)
            if (rnd(0, 1) < 0.5) {
                // Standalone Ground Hunter
                this.world.addEntity(new Hunter(sx, GROUND_Y - 16));
            } else {
                // Cactus + Ground Hunter
                this.world.addEntity(new Cactus(sx - 80, GROUND_Y, 0));
                this.world.addEntity(new Hunter(sx + 70, GROUND_Y - 16));
            }
            this.spawnX += max(480, rnd(540, 760) - gapReduction);
        } else if (roll < 85) {
            // Pattern 4: Long, Thin Raised Platform with Hunter on center-right
            const platformW = rnd(240, 280);
            const platformH = 18;
            const platformY = GROUND_Y - 75;
            this.world.addEntity(new PlatformTower(sx, platformY, platformW, platformH));

            // Place hunter on center-right of platform (giving left runway to land & run)
            const hunterOffset = platformW * rnd(0.18, 0.32);
            this.world.addEntity(new Hunter(sx + hunterOffset, platformY - platformH / 2 - 16));

            this.spawnX += max(500, platformW + rnd(260, 420) - gapReduction);
        } else {
            // Pattern 5: Long Raised Platform + Hunter + Ground Cactus
            const platformW = 260;
            const platformH = 18;
            const platformY = GROUND_Y - 75;
            this.world.addEntity(new PlatformTower(sx + 60, platformY, platformW, platformH));

            // Hunter on center-right of platform
            const hunterOffset = platformW * rnd(0.18, 0.30);
            this.world.addEntity(new Hunter(sx + 60 + hunterOffset, platformY - platformH / 2 - 16));

            // Cactus on ground before the platform
            this.world.addEntity(new Cactus(sx - 70, GROUND_Y, 0));

            this.spawnX += max(520, platformW + rnd(280, 450) - gapReduction);
        }
    }
}
