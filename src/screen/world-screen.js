class WorldScreen extends Screen {
    absorb = true;

    constructor() {
        super();
        this.world = new World();
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        // Fixed 120Hz physics substepping
        let remaining = elapsed;
        while (remaining > 0) {
            const advance = min(remaining, 1 / 120);
            remaining -= advance;
            this.world.cycle(advance);
        }
    }

    render() {
        super.render();
        ctx.wrap(() => this.world.render());
    }
}
