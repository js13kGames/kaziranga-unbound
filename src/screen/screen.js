class Screen {
    age = 0;
    commands = [];
    songVolume = 1;

    addCommand(label, detect, action, playSound = true) {
        this.commands.push({ label, detect, action, playSound });
    }

    pop() {
        const index = G.screens.indexOf(this);
        if (index >= 0) G.screens.splice(index, 9);
    }

    resolve() {
        const { resolvers } = this;
        if (!resolvers) return;
        this.resolvers = null;
        this.pop();
        resolvers.resolve();
    }

    reject() {
        const { resolvers } = this;
        if (!resolvers) return;
        this.resolvers = null;
        this.pop();
        resolvers.reject();
    }

    awaitCompletion() {
        return new Promise((resolve, reject) => {
            this.resolvers = { resolve, reject };
        });
    }

    cycle(elapsed) {
        this.age += elapsed;

        if (Object.values(downKeys).filter(x => x).length === 0 && !TOUCH_DOWN) {
            this.releasedCommand = true;
        }

        if (this.releasedCommand && this.isForeground()) {
            for (const { detect, action, playSound } of this.commands) {
                if (detect?.()) {
                    if (playSound) zzfx(...[.5,,500,,.02,.14,,3.2,,,325,.05,.03,,,,,.79,.04,,-1129]);
                    this.releasedCommand = false;
                    action();
                }
            }
        }

        if (this.isForeground()) {
            setSongVolume(this.songVolume * (document.hasFocus() ? 1 : 0));
        }
    }

    render() {}

    isForeground() {
        return G?.screens?.[G.screens.length - 1] === this;
    }
}

class TransitionScreen extends Screen {

    constructor(from, to) {
        super();
        this.from = from;
        this.to = to;
    }

    get progress() {
        return this.age / 0.25;
    }

    cycle(elapsed) {
        super.cycle(elapsed);
        if (this.progress >= 1) {
            this.resolve();
        }
    }

    render() {
        ctx.translate(interpolate(this.from, this.to, this.progress) * (CANVAS_WIDTH + 200), 0);

        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(CANVAS_WIDTH + 200, 0);
        ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.lineTo(-200, CANVAS_HEIGHT);
        ctx.fill();
    }
}
