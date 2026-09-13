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
        this.groundSpawnX = 850;
        this.tierSpawnX = [320, 480, 640];
        this.lastMilestone = 0;
        this.gameOverTime = 0;
        this.releasedRestart = false;

        G.bonusScore = 0;
        G.score = 0;
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        if (!this.isForeground()) return;

        // 1. Live Gameplay Loop
        if (!this.player.dead) {
            // Distance-based score + Hunter defeat bonus score
            const distScore = ~~max(0, (this.player.x - 200) / 18);
            G.score = distScore + (G.bonusScore || 0);

            // Milestone sound fanfare every 100 meters (Classic Chrome Dino beep)
            const currentMilestone = floor(G.score / 100) * 100;
            if (currentMilestone > this.lastMilestone && currentMilestone >= 100) {
                this.lastMilestone = currentMilestone;
                zzfx(...[.3,,850,.01,.06,.15,,,,,-120,.08,,,,,,.8,.02]);
            }

            // Procedural Spawner Loop (generates platforms and ground ahead of camera)
            const forwardHorizon = this.player.x + 1800;

            // Ground obstacles (Tier 0: Forest Huts & Ground Hunters)
            while (this.groundSpawnX < forwardHorizon) {
                const roll = rnd(0, 100);
                if (roll < 45) {
                    this.world.addEntity(new ForestHut(this.groundSpawnX, GROUND_Y));
                } else {
                    this.world.addEntity(new Hunter(this.groundSpawnX, GROUND_Y - 16, 1.6));
                }
                this.groundSpawnX += rnd(680, 960);
            }

            // Tier 1 Platform (Level 1 Grass - y = 410: Hunters, Huts & Destructible Trees)
            while (this.tierSpawnX[0] < forwardHorizon) {
                const segW = rnd(650, 950);
                const platX = this.tierSpawnX[0] + segW / 2;
                this.world.addEntity(new PlatformTower(platX, 410, segW, 18));

                const roll = rnd(0, 100);
                if (roll < 20) {
                    this.world.addEntity(new Hunter(platX + rnd(-segW * 0.2, segW * 0.2), 410 - 25, 1.4));
                } else if (roll < 40) {
                    this.world.addEntity(new ForestHut(platX + rnd(-segW * 0.2, segW * 0.2), 410 - 9));
                } else if (roll < 75) {
                    this.world.addEntity(new SmallTree(platX + rnd(-segW * 0.25, segW * 0.25), 410 - 9 - 13));
                }

                const gap = rnd(100, 140);
                this.tierSpawnX[0] += segW + gap;
            }

            // Tier 2 Platform (Level 2 Elevated Grass - y = 240: VERY HARD High-Stakes Gauntlet!)
            while (this.tierSpawnX[1] < forwardHorizon) {
                const segW = rnd(520, 780);
                const platX = this.tierSpawnX[1] + segW / 2;
                this.world.addEntity(new PlatformTower(platX, 240, segW, 18));

                const roll = rnd(0, 100);
                if (roll < 32) {
                    // Gauntlet 1: Double Hazard - Rapid Sniper Hunter at rear + Charging Tiger up front!
                    this.world.addEntity(new Hunter(platX + segW * 0.35, 240 - 25, 1.1));
                    this.world.addEntity(new Tiger(platX + segW * 0.1, 240 - 9 - 12, rnd(-390, -450)));
                } else if (roll < 60) {
                    // Gauntlet 2: Tiger Rush + Destructible Small Tree / Watchtower hurdle
                    this.world.addEntity(new SmallTree(platX - segW * 0.1, 240 - 9 - 13));
                    this.world.addEntity(new Tiger(platX + segW * 0.32, 240 - 9 - 12, rnd(-380, -440)));
                } else if (roll < 82) {
                    // Gauntlet 3: Double Tiger Pincer sprint!
                    this.world.addEntity(new Tiger(platX + segW * 0.08, 240 - 9 - 12, -370));
                    this.world.addEntity(new Tiger(platX + segW * 0.38, 240 - 9 - 12, -430));
                } else {
                    // Gauntlet 4: Lookout Bunker + Elite Sniper Hunter + Tree
                    this.world.addEntity(new ForestHut(platX - segW * 0.18, 240 - 9));
                    this.world.addEntity(new SmallTree(platX + segW * 0.05, 240 - 9 - 13));
                    this.world.addEntity(new Hunter(platX + segW * 0.35, 240 - 25, 0.9));
                }

                const gap = rnd(125, 175);
                this.tierSpawnX[1] += segW + gap;
            }

            // Tier 3 Cloud Platform (y = 70: Rare stepping stones, 1-2 per screen with large gaps)
            while (this.tierSpawnX[2] < forwardHorizon) {
                const segW = rnd(100, 160); // Small stepping stone cloud
                const platX = this.tierSpawnX[2] + segW / 2;
                this.world.addEntity(new CloudPlatform(platX, 70, segW, 18));

                const gap = rnd(500, 850); // Large distance: only 1 or 2 clouds visible per screen
                this.tierSpawnX[2] += segW + gap;
            }

            // Garbage Collection: remove passed entities behind runner
            const cutoffX = this.player.x - 700;
            for (const categoryId of ['cactus', 'platform', 'enemy', 'bullet', 'pickup', 'destructible']) {
                for (const entity of this.world.category(categoryId)) {
                    if (entity.x + (entity.radiusX || 0) < cutoffX) {
                        this.world.removeEntity(entity);
                    }
                }
            }

            // Pause (ESC key = 27)
            this.releasedPause ||= !downKeys[27];
            if (this.releasedPause && downKeys[27]) {
                this.releasedPause = false;
                downKeys[27] = false;
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
}

