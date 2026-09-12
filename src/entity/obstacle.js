class Cactus extends Entity {

    type = 'cactus';
    z = Z_PLAYER;
    categories = ['obstacle', 'cactus'];

    constructor(x, groundY, variant = 0) {
        super();
        this.x = x;
        this.groundY = groundY;
        this.variant = variant; // 0 = small, 1 = tall, 2 = double, 3 = triple

        // Dimensions based on variant
        if (variant === 0) {
            this.width = 16;
            this.height = 32;
        } else if (variant === 1) {
            this.width = 18;
            this.height = 44;
        } else if (variant === 2) {
            this.width = 34;
            this.height = 36;
        } else {
            this.width = 48;
            this.height = 44;
        }

        this.radiusX = this.width / 2;
        this.radiusY = this.height / 2;
        this.y = groundY - this.radiusY;

        this.hitbox.width = this.width - 6;
        this.hitbox.height = this.height - 4;
    }

    cycle(elapsed) {
        super.cycle(elapsed);
        this.hitbox.x = this.x;
        this.hitbox.y = this.y;

        const player = firstItem(this.world.category('player'));
        if (player && !player.dead && this.hitbox.intersects(player.hitbox)) {
            player.die('cactus');
        }
    }

    render() {
        ctx.translate(~~this.x, ~~this.y);
        const P = 2;
        const px = (x, y, w = 1, h = 1, color) => {
            if (color) ctx.fillStyle = color;
            ctx.fillRect(x * P, y * P, w * P, h * P);
        };

        const C_DARK = '#1b4332';
        const C_MAIN = '#2d6a4f';
        const C_LIGHT = '#52b788';
        const C_THORN = '#d8f3dc';

        const drawSingleCactus = (cx, cy, tall) => {
            const h = tall ? 18 : 13;
            // Trunk body
            ctx.fillStyle = C_MAIN;
            px(cx - 2, cy - h, 4, h + 8);
            ctx.fillStyle = C_LIGHT;
            px(cx - 1, cy - h, 2, h + 8);

            // Left arm
            ctx.fillStyle = C_MAIN;
            px(cx - 5, cy - h + 4, 3, 2);
            px(cx - 5, cy - h + 1, 2, 4);
            ctx.fillStyle = C_LIGHT;
            px(cx - 4, cy - h + 1, 1, 3);

            // Right arm
            ctx.fillStyle = C_MAIN;
            px(cx + 2, cy - h + 7, 3, 2);
            px(cx + 3, cy - h + 3, 2, 5);
            ctx.fillStyle = C_LIGHT;
            px(cx + 4, cy - h + 3, 1, 4);

            // Thorns
            ctx.fillStyle = C_THORN;
            px(cx - 6, cy - h + 2, 1, 1);
            px(cx + 5, cy - h + 4, 1, 1);
            px(cx, cy - h - 1, 1, 1);
        };

        if (this.variant === 0) {
            drawSingleCactus(0, 0, false);
        } else if (this.variant === 1) {
            drawSingleCactus(0, 0, true);
        } else if (this.variant === 2) {
            drawSingleCactus(-4, 2, false);
            drawSingleCactus(5, -2, true);
        } else {
            drawSingleCactus(-7, 2, false);
            drawSingleCactus(0, -3, true);
            drawSingleCactus(7, 0, false);
        }
    }
}

class PlatformTower extends Entity {

    type = 'platform';
    z = Z_STRUCTURE;
    categories = ['platform'];

    constructor(x, y, width = 240, height = 18) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.radiusX = width / 2;
        this.radiusY = height / 2;
        this.hitbox.width = width;
        this.hitbox.height = height;
    }

    cycle(elapsed) {
        super.cycle(elapsed);
        this.hitbox.x = this.x;
        this.hitbox.y = this.y;
    }

    render() {
        ctx.translate(~~this.x, ~~this.y);
        const w = this.width;
        const h = this.height;

        // Thin sleek platform block body
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-w / 2, -h / 2, w, h);

        // Top neon ledge surface
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(-w / 2, -h / 2, w, 4);

        // Under-edge dark trim
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-w / 2, h / 2 - 3, w, 3);

        // Subtle borders
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.strokeRect(-w / 2, -h / 2, w, h);
    }
}
