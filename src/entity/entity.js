class Entity {
    categories = [];

    constructor() {
        this.x = this.y = this.previousX = this.previousY = this.age = 0;
        this.z = 0;
    }

    get hitbox() {
        this.cachedHitbox ||= new Rect();
        this.cachedHitbox.x = this.x;
        this.cachedHitbox.y = this.y;
        return this.cachedHitbox;
    }

    cycle(elapsed) {
        this.age += elapsed;
        this.previousX = this.x;
        this.previousY = this.y;
    }

    renderBackground() {}

    render() {}

    cancelCamera() {
        const camera = firstItem(this.world.category('camera'));
        if (!camera) return;
        ctx.translate(
            camera.actual.x - (1 / camera.zoom) * CANVAS_WIDTH / 2,
            camera.actual.y - (1 / camera.zoom) * CANVAS_HEIGHT / 2,
        );
        ctx.scale(1 / camera.zoom, 1 / camera.zoom);
    }

    renderDebug() {
        if (DEBUG && DEBUG_HITBOXES) this.hitbox.render();
    }
}
