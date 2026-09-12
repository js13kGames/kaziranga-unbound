class Camera extends Entity {

    zoom = 1.35;
    categories = ['camera'];

    get actual() {
        const factor = (this.age < this.shakeEndAge) * (this.shakePower || 0);
        this.cachedActual ||= {};
        this.cachedActual.x = this.x + sin(this.age * TWO_PI * 10) * factor;
        this.cachedActual.y = this.y + cos(this.age * TWO_PI * 15) * factor;
        return this.cachedActual;
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        this.hitbox.width = CANVAS_WIDTH / this.zoom;
        this.hitbox.height = CANVAS_HEIGHT / this.zoom;

        if (!this.target) return;

        // Position camera slightly ahead of the runner
        const targetX = this.target.x + 240;
        const targetY = 460;

        this.x += (targetX - this.x) * min(1, elapsed * 10);
        this.y += (targetY - this.y) * min(1, elapsed * 5);
    }

    shake(duration, shakePower) {
        this.shakeEndAge = this.age + duration;
        this.shakePower = shakePower;
    }
}
