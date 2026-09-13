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
        const isPortrait = CANVAS_HEIGHT > CANVAS_WIDTH;
        const screenCenterY = isPortrait ? (CANVAS_HEIGHT * 0.68 - 120 * camera.zoom) : (CANVAS_HEIGHT / 2);
        ctx.translate(
            camera.actual.x - CANVAS_WIDTH / (2 * camera.zoom),
            camera.actual.y - screenCenterY / camera.zoom,
        );
        ctx.scale(1 / camera.zoom, 1 / camera.zoom);
    }

    renderDebug() {
        if (DEBUG && DEBUG_HITBOXES) this.hitbox.render();
    }
}
