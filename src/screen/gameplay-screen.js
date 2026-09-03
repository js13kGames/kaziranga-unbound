class GameplayScreen extends WorldScreen {

    constructor() {
        super();

        // 1. Add Platform Structure
        this.world.addEntity(new Structure());

        // 2. Add Player
        this.player = this.world.addEntity(new Player());
        this.player.x = 200;
        this.player.y = 200;

        // 3. Add Camera
        const camera = this.world.addEntity(new Camera());
        camera.target = this.player;
        camera.x = this.player.x;
        camera.y = this.player.y - 100;

        // 4. Add HUD
        this.world.addEntity(new HUD(this.player));

        G.score = 0;
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        if (this.isForeground()) {
            G.score += ~~(elapsed * 10);

            // Check pause (ESC key = 27)
            this.releasedPause ||= !downKeys[27];
            if (this.releasedPause && downKeys[27]) {
                this.releasedPause = false;
                G.navigate(new PauseScreen()).awaitCompletion();
            }
        }
    }
}
