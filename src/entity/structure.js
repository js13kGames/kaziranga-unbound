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
        const camY = camera ? camera.y : 0;

        // 1. Luminous Sunset Sky Gradient (Lightened for High Gameplay Contrast)
        const skyGrad = ctx.createLinearGradient(0, -280, 0, GROUND_Y);
        skyGrad.addColorStop(0, '#4c2378');     // Lighter dusk violet
        skyGrad.addColorStop(0.26, '#6d308a');  // Soft magenta-purple
        skyGrad.addColorStop(0.48, '#a24478');  // Sunset rose
        skyGrad.addColorStop(0.68, '#dc6868');  // Soft coral-salmon
        skyGrad.addColorStop(0.84, '#f88c52');  // Warm peach-orange
        skyGrad.addColorStop(0.95, '#fbbf24');  // Golden horizon
        skyGrad.addColorStop(1, '#fef08a');     // Bright sunlight wash
        ctx.fillStyle = skyGrad;
        ctx.fillRect(camX - CANVAS_WIDTH, camY - CANVAS_HEIGHT * 2, CANVAS_WIDTH * 2, CANVAS_HEIGHT * 3);

        // 2. Radiant Setting Sun with Concentric Corona Rings (0.01x Parallax - Soft & Luminous)
        ctx.wrap(() => {
            const vCamX = camX * 0.01;
            const sunX = camX + (400 - vCamX);
            const sunY = GROUND_Y - 240;

            // Outermost soft corona
            ctx.fillStyle = 'rgba(254, 215, 170, 0.45)';
            ctx.beginPath();
            ctx.arc(sunX, sunY, 78, 0, TWO_PI);
            ctx.fill();

            // Concentric corona rings
            ctx.fillStyle = 'rgba(251, 146, 60, 0.6)';
            ctx.beginPath();
            ctx.arc(sunX, sunY, 64, 0, TWO_PI);
            ctx.fill();

            ctx.fillStyle = '#fb923c';
            ctx.beginPath();
            ctx.arc(sunX, sunY, 52, 0, TWO_PI);
            ctx.fill();

            ctx.fillStyle = '#fde047';
            ctx.beginPath();
            ctx.arc(sunX, sunY, 38, 0, TWO_PI);
            ctx.fill();

            // Inner bright sun core
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(sunX, sunY, 28, 0, TWO_PI);
            ctx.fill();
        });

        // 3. Golden-Crested Pastel Sunset Clouds (0.02x Parallax - Lightened)
        ctx.wrap(() => {
            const vCamX = camX * 0.02;
            const spacing = 480;
            const startIdx = floor((vCamX - CANVAS_WIDTH) / spacing) - 1;
            const endIdx = ceil((vCamX + CANVAS_WIDTH) / spacing) + 1;

            for (let i = startIdx; i <= endIdx; i++) {
                const cx = camX + (i * spacing - vCamX);
                const cy = GROUND_Y - 350 + ((abs(i * 37) % 5) - 2) * 10;

                // Soft pastel lavender/lilac base underside
                ctx.fillStyle = '#8b5cf6';
                ctx.fillRect(cx - 44, cy + 22, 110, 20);
                ctx.fillRect(cx - 24, cy + 8, 80, 20);

                ctx.fillStyle = '#a78bfa';
                ctx.fillRect(cx - 38, cy + 14, 98, 18);
                ctx.fillRect(cx - 16, cy + 2, 68, 18);

                ctx.fillStyle = '#c4b5fd';
                ctx.fillRect(cx - 30, cy + 6, 82, 14);

                // Golden/cream cloud crown & highlights
                ctx.fillStyle = '#fdba74';
                ctx.fillRect(cx - 24, cy - 2, 60, 10);
                ctx.fillStyle = '#fef08a';
                ctx.fillRect(cx - 18, cy - 8, 44, 8);
                ctx.fillRect(cx - 8, cy - 14, 26, 8);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(cx - 4, cy - 12, 16, 4);
            }
        });

        // 4. Distant Misty Lavender Mountains (0.04x Parallax - Lightened for Gameplay Contrast)
        ctx.wrap(() => {
            const vCamX = camX * 0.04;
            const spacing = 800;
            const startIdx = floor((vCamX - CANVAS_WIDTH) / spacing) - 1;
            const endIdx = ceil((vCamX + CANVAS_WIDTH) / spacing) + 1;

            for (let i = startIdx; i <= endIdx; i++) {
                const mx = camX + (i * spacing - vCamX);

                // Mountain Range Silhouettes (Soft Atmospheric Mauve/Lavender)
                ctx.fillStyle = '#8b68a6';
                ctx.beginPath();
                ctx.moveTo(mx - 100, GROUND_Y);
                ctx.lineTo(mx + 60, GROUND_Y - 180);
                ctx.lineTo(mx + 220, GROUND_Y - 80);
                ctx.lineTo(mx + 380, GROUND_Y - 150);
                ctx.lineTo(mx + 540, GROUND_Y - 70);
                ctx.lineTo(mx + 680, GROUND_Y - 170);
                ctx.lineTo(mx + 840, GROUND_Y - 60);
                ctx.lineTo(mx + 920, GROUND_Y);
                ctx.closePath();
                ctx.fill();

                // Mountain Sunlit Facet Highlights (Bright Lilac/Lavender)
                ctx.fillStyle = '#b490d1';
                ctx.beginPath();
                ctx.moveTo(mx + 60, GROUND_Y - 180);
                ctx.lineTo(mx + 150, GROUND_Y - 110);
                ctx.lineTo(mx + 220, GROUND_Y - 80);
                ctx.closePath();
                ctx.fill();

                ctx.beginPath();
                ctx.moveTo(mx + 380, GROUND_Y - 150);
                ctx.lineTo(mx + 460, GROUND_Y - 100);
                ctx.lineTo(mx + 540, GROUND_Y - 70);
                ctx.closePath();
                ctx.fill();

                ctx.beginPath();
                ctx.moveTo(mx + 680, GROUND_Y - 170);
                ctx.lineTo(mx + 760, GROUND_Y - 110);
                ctx.lineTo(mx + 840, GROUND_Y - 60);
                ctx.closePath();
                ctx.fill();
            }
        });

        // 5. Stable Silhouette Trees (0.06x Parallax - Soft Misty Plum for High Foreground Clarity)
        ctx.wrap(() => {
            const vCamX = camX * 0.06;
            const spacing = 110;
            const startIdx = floor((vCamX - CANVAS_WIDTH) / spacing) - 1;
            const endIdx = ceil((vCamX + CANVAS_WIDTH) / spacing) + 1;

            // Soft atmospheric plum tone (doesn't clash with dark platforms or player/hunters)
            ctx.fillStyle = '#654378';

            for (let i = startIdx; i <= endIdx; i++) {
                const tx = camX + (i * spacing - vCamX);
                const tType = abs((i * 17) % 3);
                const baseTreeY = GROUND_Y;

                if (tType === 0) {
                    // Flat-topped Acacia / Umbrella Tree
                    ctx.fillRect(tx - 2, baseTreeY - 38, 4, 38);
                    ctx.fillRect(tx - 12, baseTreeY - 34, 10, 3);
                    ctx.fillRect(tx + 2, baseTreeY - 36, 12, 3);

                    // Wide flat-top canopy
                    ctx.fillRect(tx - 24, baseTreeY - 44, 48, 8);
                    ctx.fillRect(tx - 28, baseTreeY - 42, 56, 4);
                    ctx.fillRect(tx - 18, baseTreeY - 47, 36, 4);
                } else if (tType === 1) {
                    // Medium Round Canopy Tree
                    ctx.fillRect(tx - 2, baseTreeY - 28, 4, 28);
                    ctx.beginPath();
                    ctx.arc(tx, baseTreeY - 34, 18, 0, TWO_PI);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(tx - 10, baseTreeY - 28, 12, 0, TWO_PI);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(tx + 10, baseTreeY - 28, 12, 0, TWO_PI);
                    ctx.fill();
                } else {
                    // Low Forest Bush / Shrub Cluster
                    ctx.beginPath();
                    ctx.arc(tx - 8, baseTreeY - 12, 12, 0, TWO_PI);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(tx + 8, baseTreeY - 14, 14, 0, TWO_PI);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(tx, baseTreeY - 18, 14, 0, TWO_PI);
                    ctx.fill();
                }
            }
        });
    }

    render() {
        const camera = firstItem(this.world.category('camera'));
        const camX = camera ? camera.x : 0;

        // 1. Earthy Bedrock Under Ground Line
        ctx.fillStyle = '#261102';
        ctx.fillRect(camX - CANVAS_WIDTH, GROUND_Y, CANVAS_WIDTH * 2, CANVAS_HEIGHT * 2);

        // 2. Rich Soil Strata Layer
        ctx.fillStyle = '#3d1d07';
        ctx.fillRect(camX - CANVAS_WIDTH, GROUND_Y, CANVAS_WIDTH * 2, 28);

        // 3. Lush Emerald Meadow Top Layer
        ctx.fillStyle = '#15803d';
        ctx.fillRect(camX - CANVAS_WIDTH, GROUND_Y, CANVAS_WIDTH * 2, 6);
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(camX - CANVAS_WIDTH, GROUND_Y, CANVAS_WIDTH * 2, 3);
        ctx.fillStyle = '#4ade80';
        ctx.fillRect(camX - CANVAS_WIDTH, GROUND_Y, CANVAS_WIDTH * 2, 1);

        // 4. Soil Pebbles, Roots & Grass Tufts
        const startX = floor((camX - CANVAS_WIDTH) / 80) * 80;
        for (let x = startX; x < camX + CANVAS_WIDTH; x += 80) {
            ctx.fillStyle = '#1e0c03';
            ctx.fillRect(x + 8, GROUND_Y + 14, 16, 4);
            ctx.fillStyle = '#5c2e0b';
            ctx.fillRect(x + 42, GROUND_Y + 20, 8, 3);
            ctx.fillStyle = '#78350f';
            ctx.fillRect(x + 64, GROUND_Y + 12, 6, 3);

            // Grass tufts along surface
            ctx.fillStyle = '#4ade80';
            ctx.fillRect(x + 18, GROUND_Y - 2, 2, 3);
            ctx.fillRect(x + 22, GROUND_Y - 4, 2, 5);
            ctx.fillRect(x + 55, GROUND_Y - 3, 2, 4);
        }
    }
}

