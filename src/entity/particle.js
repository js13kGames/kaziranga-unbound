class Particle extends Entity {

    z = Z_PARTICLE;
    alpha = 1;
    size = 1;
    color = '#fff';

    render() {
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    }

    animate(duration, values) {
        const interps = [];
        for (const [propertyKey, offset] of Object.entries(values)) {
            interps.push(this.interp(propertyKey, this[propertyKey], this[propertyKey] + offset, duration));
        }
        return Promise.all(interps).then(() => this.world?.removeEntity(this));
    }
}

class PhysicalParticle extends Entity {

    z = Z_PARTICLE;
    speed = rnd(200, 400);
    angle = rnd(-PI, 0);

    vX = cos(this.angle) * this.speed;
    vY = sin(this.angle) * this.speed;

    cycle(elapsed) {
        super.cycle(elapsed);

        this.vY += elapsed * 800; // Gravity

        this.x += this.vX * elapsed;
        this.y += this.vY * elapsed;

        const { x, y } = this;
        for (const structure of this.world.category('structure')) {
            structure.reposition(this, 2, 2, x, y);
        }

        if (x !== this.x) this.vX *= -0.5;
        if (y !== this.y) {
            this.vX *= 0.5;
            this.vY *= -0.5;
        }

        if (this.age > 3 || pointDistance(0, 0, this.vX, this.vY) < 10) {
            this.world?.removeEntity(this);
        }
    }

    color = ['#f33', '#f90', '#fc0', '#3c5', '#0cb', '#af5', '#f25'][~~rnd(0, 7)];

    render() {
        const s = pointDistance(0, 0, this.vX, this.vY) / 25;
        ctx.translate(this.x, this.y);
        ctx.rotate(atan2(this.vY, this.vX) + PI);
        ctx.fillStyle = this.color;
        ctx.fillRect(0, -2, s, 4);
    }
}

fireworks = (world, position, count, radiusX = 0, radiusY = 0) => {
    for (let i = 0 ; i < count; i++) {
        const particle = world.addEntity(new PhysicalParticle());
        particle.x = position.x + rnd(-1, 1) * radiusX;
        particle.y = position.y + rnd(-1, 1) * radiusY;
    }
};

class SparkleParticle extends Entity {
    z = Z_PARTICLE;
    constructor(x, y, color = '#fbbf24') {
        super();
        this.x = x;
        this.y = y;
        this.color = color;
        this.vX = rnd(-160, 160);
        this.vY = rnd(-220, 40);
        this.size = rnd(3, 5);
    }
    cycle(elapsed) {
        super.cycle(elapsed);
        this.vY += elapsed * 600;
        this.x += this.vX * elapsed;
        this.y += this.vY * elapsed;
        if (this.age > 0.6) {
            this.world?.removeEntity(this);
        }
    }
    render() {
        ctx.translate(~~this.x, ~~this.y);
        ctx.globalAlpha = between(0, 1 - (this.age / 0.6), 1);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    }
}

