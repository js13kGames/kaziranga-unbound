class Game {

    screens = [];
    score = 0;
    highScore = parseInt(localStorage[nomangle("hs")]) || 0;

    constructor() {
        if (DEBUG) {
            this.lastFrameIndex = 0;
            this.frameTimes = Array(60).fill(0);
        }

        this.frame();
        setTimeout(() => this.startNavigation(), 0);
    }

    async startNavigation() {
        // 1. Play Opening Story Intro Cinematic
        await this.navigate(new IntroScreen(), true).awaitCompletion();

        while (true) {
            // 2. Show Main Menu
            await this.navigate(new MainMenuScreen(), true).awaitCompletion();

            // 2. Play Transition Screen
            this.navigate(new TransitionScreen(0, -1)).awaitCompletion();

            // 3. Start Gameplay
            const gameplay = this.navigate(new GameplayScreen(), true);
            await gameplay.awaitCompletion();

            // Update high score
            if (this.score > this.highScore) {
                this.highScore = this.score;
                localStorage[nomangle("hs")] = this.highScore;
            }

            // 4. Slide out transition
            await this.navigate(new TransitionScreen(1, 0)).awaitCompletion();
        }
    }

    frame() {
        const now = performance.now();
        const elapsed = min((now - (this.lastFrame || now)) / 1000, 1 / 30);
        this.lastFrame = now;

        ctx.miterLimit = 2;

        if (!DEBUG || document.hasFocus()) {
            let i = this.screens.length;
            while (this.screens[--i]) {
                const screen = this.screens[i];
                screen.cycle(elapsed);
                if (screen.absorb) break;
            }

            for (const screen of this.screens) {
                ctx.wrap(() => screen.render());
            }

            if (DEBUG && DEBUG_INFO) ctx.wrap(() => {
                this.frameTimes[this.lastFrameIndex] = now;
                const nextIndex = (this.lastFrameIndex + 1) % this.frameTimes.length;
                const fps = (this.frameTimes.length - 1) / ((now - this.frameTimes[nextIndex]) / 1000);
                this.lastFrameIndex = nextIndex;

                ctx.translate(10, 10);
                ctx.font = '20px Courier';
                ctx.textAlign = nomangle('left');
                ctx.textBaseline = nomangle('middle');
                ctx.fillStyle = '#fff';

                ctx.fillText(nomangle('FPS: ') + fps.toFixed(1), 0, 0);
            });
        }

        requestAnimationFrame(() => this.frame());
    }

    navigate(screen, reset) {
        if (reset) this.screens = [];
        this.screens.push(screen);
        return screen;
    }
}
