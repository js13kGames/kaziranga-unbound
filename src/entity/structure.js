const GROUND_Y = 580;

class Structure extends Entity {

    type = 'structure';
    categories = ['structure'];
    z = Z_STRUCTURE;

    reposition(entity, radiusX, radiusY) {
        // 1. Check ground line
        if (entity.y + radiusY >= GROUND_Y) {
            entity.y = GROUND_Y - radiusY;
            return true;
        }

        // 2. Check platform ledges
        if (entity.vY >= 0) {
            for (const platform of this.world.category('platform')) {
                const topY = platform.y - platform.radiusY;
                const prevBottom = (entity.previousY || entity.y) + radiusY;
                if (
                    entity.x + radiusX > platform.x - platform.radiusX &&
                    entity.x - radiusX < platform.x + platform.radiusX &&
                    prevBottom <= topY + 24 &&
                    entity.y + radiusY >= topY
                ) {
                    entity.y = topY - radiusY;
                    return true;
                }
            }
        }

        return false;
    }

    renderBackground() {
        const camera = firstItem(this.world.category('camera'));
        const camX = camera ? camera.x : 0;

        // 1. Night Sky Background
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, CANVAS_WIDTH * 2, CANVAS_HEIGHT * 2);

        // 2. Distant Parallax Mountains (0.1x speed)
        ctx.wrap(() => {
            const shift1 = (camX * 0.1) % 600;
            ctx.fillStyle = '#111827';
            ctx.beginPath();
            ctx.moveTo(-600 - shift1, GROUND_Y);
            for (let x = -600 - shift1; x < CANVAS_WIDTH + 600; x += 150) {
                ctx.lineTo(x + 75, GROUND_Y - 140 - (x % 300 === 0 ? 50 : 0));
                ctx.lineTo(x + 150, GROUND_Y);
            }
            ctx.closePath();
            ctx.fill();
        });

        // 3. Mid-ground Hills (0.3x speed)
        ctx.wrap(() => {
            const shift2 = (camX * 0.3) % 400;
            ctx.fillStyle = '#1e293b';
            ctx.beginPath();
            ctx.moveTo(-400 - shift2, GROUND_Y);
            for (let x = -400 - shift2; x < CANVAS_WIDTH + 400; x += 100) {
                ctx.quadraticCurveTo(x + 50, GROUND_Y - 50, x + 100, GROUND_Y);
            }
            ctx.closePath();
            ctx.fill();
        });
    }

    render() {
        const camera = firstItem(this.world.category('camera'));
        const camX = camera ? camera.x : 0;

        // Solid Ground Surface & Bedrock
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(camX - CANVAS_WIDTH, GROUND_Y, CANVAS_WIDTH * 2, CANVAS_HEIGHT);

        // Neon / Pixel Ground Top Line
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(camX - CANVAS_WIDTH, GROUND_Y, CANVAS_WIDTH * 2, 4);

        // Ground decorative dashes & pebbles (repeating pattern)
        ctx.fillStyle = '#334155';
        const startX = floor((camX - CANVAS_WIDTH) / 80) * 80;
        for (let x = startX; x < camX + CANVAS_WIDTH; x += 80) {
            ctx.fillRect(x + 10, GROUND_Y + 12, 18, 3);
            ctx.fillRect(x + 45, GROUND_Y + 22, 10, 2);
            ctx.fillRect(x + 65, GROUND_Y + 14, 6, 2);
        }
    }
}
