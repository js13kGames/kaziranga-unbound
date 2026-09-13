class IntroScreen extends Screen {

    constructor() {
        super();

        this.addCommand(
            nomangle('[SPACE] / [TAP] SKIP'),
            () => downKeys[32] || downKeys[13] || downKeys[38] || TOUCH_DOWN,
            () => this.resolve(),
            false,
        );
    }

    cycle(elapsed) {
        super.cycle(elapsed);

        // Auto-advance once dream bubble expands to fill the screen (~11.5s)
        if (this.age > 11.5) {
            this.resolve();
        }
    }

    render() {
        const t = this.age;

        // 1. Solid Pure Black Background
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // 2. Large White Pixel Rhino (Side profile, P = 14)
        const groundY = CANVAS_HEIGHT * 0.78;
        const targetX = CANVAS_WIDTH / 2 - 340;
        let rhinoX;
        let walkPhase = 0;
        let isLyingDown = false;
        let lieProgress = 0;

        if (t < 1.2) {
            // Walking into center (1.2s)
            rhinoX = -500 + (targetX + 500) * easeOutSine(t / 1.2);
            walkPhase = t * 12;
        } else if (t < 2.2) {
            // Smoothly lying down to sleep (1.0s)
            rhinoX = targetX;
            lieProgress = min(1, (t - 1.2) / 1.0);
            isLyingDown = true;
        } else {
            // Sleeping soundly
            rhinoX = targetX;
            isLyingDown = true;
            lieProgress = 1;
        }

        const breath = (t > 2.0) ? sin((t - 2.0) * 3.5) * 4 : 0;
        this.renderGiantWhiteRhino(rhinoX, groundY, walkPhase, isLyingDown, lieProgress, breath);

        // 3. Emergency Story Dispatch Text (Simple Bold Black & White, No Border, No Color)
        if (t > 0.2) {
            ctx.wrap(() => {
                ctx.globalAlpha = min(1, (t - 0.2) / 0.5);

                const isPortrait = CANVAS_HEIGHT > CANVAS_WIDTH;
                const boxW = min(isPortrait ? 820 : 960, CANVAS_WIDTH * 0.92);
                const boxY = isPortrait ? (CANVAS_HEIGHT * 0.24) : (CANVAS_HEIGHT * 0.22);
                const boxH = isPortrait ? 270 : 210;

                ctx.translate(CANVAS_WIDTH / 2, boxY);

                // Header in simple bold white
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.font = nomangle('bold 22px Courier New, monospace');
                ctx.fillStyle = '#fff';
                ctx.fillText(nomangle('EMERGENCY ECO-ZONE DISPATCH'), 0, -boxH / 2 + 20);

                // Story Paragraphs in simple bold white
                const paragraphs = [
                    nomangle('The Bureaucracy has slashed Kaziranga’s Buffer from 10km to 1km!'),
                    nomangle('Restore the Eco-Zone with your horn and speed.'),
                    nomangle('The poachers and builders are coming. Fight back!')
                ];

                const maxTextW = boxW - 48;
                let curY = -boxH / 2 + 60;

                for (const txt of paragraphs) {
                    ctx.font = nomangle('bold 18px Courier New, monospace');
                    ctx.fillStyle = '#fff';
                    let cur = '';
                    for (const w of txt.split(' ')) {
                        const test = cur ? `${cur} ${w}` : w;
                        if (ctx.measureText(test).width <= maxTextW) {
                            cur = test;
                        } else {
                            if (cur) { ctx.fillText(cur, 0, curY); curY += 26; }
                            cur = w;
                        }
                    }
                    if (cur) { ctx.fillText(cur, 0, curY); curY += 28; }
                }
            });
        }

        // 4. Floating "Z z z" Sleeping Bubbles
        if (t > 2.0) {
            const zAge = t - 2.0;
            const snortX = rhinoX + 740;
            const snortY = groundY - 140 + lieProgress * (5 * 14);

            ctx.wrap(() => {
                ctx.fillStyle = '#fff';
                const zDefs = [[0, 36, 0, 0], [0.5, 48, 35, 30], [1.0, 64, 75, 60]];
                for (let i = 0; i < zDefs.length; i++) {
                    const [delay, size, offX, offY] = zDefs[i];
                    if (zAge > delay) {
                        const p = ((zAge - delay) * (1.2 - i * 0.1)) % 2.2;
                        ctx.font = nomangle('bold ') + size + nomangle('px Courier New, monospace');
                        ctx.globalAlpha = between(0, 1 - p / 2.2, 1);
                        ctx.fillText(i === 0 ? 'z' : 'Z', snortX + offX + sin(p * 3 + i) * (15 + i * 5) + p * (25 + i * 10), snortY - offY - p * (60 + i * 15));
                    }
                }
            });
        }

        // 5. Expanding Dream Bubble Portal into Title Screen (Simple Bold Black & White)
        if (t > 7.5) {
            const dreamAge = t - 7.5;
            const dreamProgress = min(1, dreamAge / 2.0);
            const bubbleRadius = easeInSine(dreamProgress) * (CANVAS_WIDTH * 1.4);

            const bubbleOriginX = rhinoX + 740;
            const bubbleOriginY = groundY - 260;

            // Expand dream circle
            ctx.wrap(() => {
                ctx.beginPath();
                ctx.arc(bubbleOriginX, bubbleOriginY, bubbleRadius, 0, TWO_PI);
                ctx.save();
                ctx.clip();

                // Solid Pure Black Background
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

                // Simple Bold Black & White Title & Subtitle (No borders, no colors)
                ctx.wrap(() => {
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.globalAlpha = between(0, (dreamAge - 0.2) / 0.8, 1);

                    const titleSize = min(80, CANVAS_WIDTH * 0.054);
                    ctx.font = nomangle('bold ') + ~~titleSize + nomangle('px Impact, Arial Black, sans-serif');

                    const titleY = CANVAS_HEIGHT * 0.35 + sin(t * 3) * 8;

                    // Simple Bold White Title
                    ctx.fillStyle = '#fff';
                    ctx.fillText(nomangle('KAZIRANGA UNBOUND'), CANVAS_WIDTH / 2, titleY);

                    // Subtitle in clean bold white monospace
                    ctx.font = nomangle('bold 20px Courier New, monospace');
                    ctx.fillStyle = '#fff';
                    ctx.fillText(nomangle('RHINO RUNNER • DEFLECT BULLETS • SMASH POACHERS'), CANVAS_WIDTH / 2, titleY + 64);

                    // High Score
                    if (G.highScore > 0) {
                        ctx.font = nomangle('bold 20px Courier New, monospace');
                        ctx.fillStyle = '#fff';
                        ctx.fillText(nomangle('BEST: ') + String(G.highScore).padStart(5, '0'), CANVAS_WIDTH / 2, titleY + 104);
                    }

                    // Prompt in bold white
                    if (dreamAge > 0.8) {
                        ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT * 0.74);
                        ctx.font = nomangle('bold 28px Courier New, monospace');
                        ctx.fillStyle = '#fff';
                        ctx.globalAlpha = 0.6 + sin(t * 8) * 0.4;
                        ctx.drawCommandText(nomangle('PRESS [SPACE] TO RUN'));
                    }
                });

                ctx.restore();
            });
        }

        // 6. Skip Prompt in Simple Bold White
        ctx.wrap(() => {
            ctx.fillStyle = '#fff';
            ctx.font = nomangle('bold 20px Courier New, monospace');
            ctx.textAlign = nomangle('right');
            ctx.textBaseline = nomangle('bottom');
            ctx.translate(CANVAS_WIDTH - 30, CANVAS_HEIGHT - 25);
            ctx.globalAlpha = 0.6 + sin(t * 4) * 0.3;
            ctx.fillText(nomangle('[SPACE] / [TAP] SKIP'), 0, 0);
        });
    }

    renderGiantWhiteRhino(x, y, walkPhase, isLyingDown, lieProgress, breath) {
        ctx.wrap(() => {
            ctx.translate(~~x, ~~y);

            const P = 14; // Large pixel scale
            const px = (pxX, pxY, w = 1, h = 1, color = '#fff') => {
                ctx.fillStyle = color;
                ctx.fillRect(pxX * P, pxY * P, w * P, h * P);
            };

            // Leg steps
            let fFarX = 0, fNearX = 0, bFarX = 0, bNearX = 0;
            if (!isLyingDown) {
                const s = sin(walkPhase);
                fNearX = ~~(s * 2);
                fFarX = ~~(-s * 2);
                bNearX = ~~(-s * 2);
                bFarX = ~~(s * 2);
            }

            // 1. Far Legs (Bottom stays on ground line pxY = 11)
            if (!isLyingDown) {
                px(6 + bFarX, 3, 5, 8);
                px(27 + fFarX, 3, 5, 8);
            } else if (lieProgress < 0.6) {
                const farH = ~~(8 - lieProgress * 8);
                if (farH > 0) {
                    px(6, 11 - farH, 5, farH);
                    px(27, 11 - farH, 5, farH);
                }
            }

            // 2. Near Legs (Foreground - Bottom ALWAYS locked at ground line pxY = 11)
            if (!isLyingDown) {
                px(8 + bNearX, -1, 1, 12, '#000');
                px(9 + bNearX, 3, 5, 8, '#fff');
                px(29 + fNearX, -2, 1, 13, '#000');
                px(30 + fNearX, 3, 5, 8, '#fff');
            } else {
                // Leg compresses from vertical (H=8) down to folded paws (H=3), bottom stays at 11
                const legH = ~~(8 - lieProgress * 5);
                const legW = ~~(5 + lieProgress * 4);
                px(8, 11 - legH, legW, legH, '#fff');
                px(29, 11 - legH, legW, legH, '#fff');
            }

            // 3. Main Massive White Body (Descends smoothly while legs fold)
            const bodyDrop = lieProgress * (5 * P);
            ctx.translate(0, bodyDrop + ~~breath);

            // Tail, Rump, Abdomen, Shoulder, Neck
            const bodyRects = [
                [-1, -6, 2, 6], [-2, -1, 2, 2], [1, -14, 11, 18],
                [11, -15, 14, 19], [24, -16, 11, 20], [34, -14, 7, 17]
            ];
            for (const r of bodyRects) px(r[0], r[1], r[2], r[3]);

            // Head & Horn
            const headDrop = isLyingDown ? 2 : 0;
            ctx.wrap(() => {
                ctx.translate(0, headDrop * P);

                // Crown, Muzzle, Ear
                const headRects = [
                    [40, -16, 8, 14], [47, -13, 7, 10], [49, -15, 4, 3], [39, -19, 3, 4]
                ];
                for (const r of headRects) px(r[0], r[1], r[2], r[3]);

                // Eye slit & Nostril
                px(43, isLyingDown && lieProgress > 0.6 ? -11 : -12, isLyingDown && lieProgress > 0.6 ? 3 : 2, isLyingDown && lieProgress > 0.6 ? 1 : 2, '#000');
                px(52, -8, 2, 2, '#000');

                // Upward Horn
                const hornRects = [
                    [49, -18, 4, 4], [50, -22, 3, 5], [51, -26, 2, 5], [52, -29, 2, 4], [53, -31, 1, 3]
                ];
                for (const r of hornRects) px(r[0], r[1], r[2], r[3]);
            });

            // Armor seams
            px(11, -14, 1, 14, '#000');
            px(24, -15, 1, 15, '#000');
        });
    }
}
