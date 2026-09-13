class HUD extends Entity {

    z = Z_HUD;
    categories = ['hud'];

    constructor(player) {
        super();
        this.player = player;
    }

    render() {
        this.cancelCamera();

        const pad5 = (n) => String(~~n).padStart(5, '0');
        const currentScore = G.score || 0;
        const highScore = G.highScore || 0;
        const player = this.player;
        const isPortrait = CANVAS_HEIGHT > CANVAS_WIDTH;
        const isMobile = isPortrait || (inputMode === INPUT_MODE_TOUCH);

        // 1. High Score & Current Score Badges
        ctx.wrap(() => {
            ctx.textBaseline = nomangle('top');
            const scoreX = CANVAS_WIDTH - 24;
            const isMilestone = (currentScore % 100 < 15) && (currentScore >= 100);

            if (!isMilestone || (sin(this.age * 20) > 0)) {
                ctx.textAlign = nomangle('right');
                ctx.fillStyle = isMilestone ? '#fbbf24' : '#fff';
                ctx.font = nomangle('bold 24px Courier New, monospace');
                ctx.fillText(nomangle('SCORE: ') + pad5(currentScore), scoreX, 20);
            }

            ctx.textAlign = nomangle('right');
            ctx.font = nomangle('bold 22px Courier New, monospace');
            ctx.fillStyle = '#fbbf24';
            ctx.fillText(nomangle('HI: ') + pad5(highScore), scoreX - 220, 22);
        });

        // 2. Desktop Keyboard & Mouse Tips
        if (!isMobile) {
            ctx.wrap(() => {
                ctx.font = nomangle('bold 16px Courier New, monospace');
                ctx.fillStyle = '#fbcfe8';
                ctx.textAlign = nomangle('left');
                ctx.textBaseline = nomangle('top');
                ctx.fillText(nomangle('⌨️ [SPACE / L-CLICK] JUMP  •  [R-CLICK / SHIFT] DASH  •  [ESC] PAUSE'), 30, 22);
            });
        }

        // 3. Rainbow Dust Energy Meter
        if (!player.dead) {
            ctx.wrap(() => {
                const meterW = 18;
                const meterH = isPortrait ? 180 : 220;
                const centerY = isPortrait ? (CANVAS_HEIGHT * 0.34) : (CANVAS_HEIGHT / 2);
                const meterX = CANVAS_WIDTH - meterW - 14;
                const meterY = ~~(centerY - meterH / 2);
                const dustRatio = between(0, player.dust / player.maxDust, 1);
                const isExhausted = player.dustCooldown > 0;
                const isFlickering = isExhausted && (sin(this.age * 32) > 0);

                ctx.textAlign = nomangle('center');
                ctx.textBaseline = nomangle('middle');

                if (isExhausted) {
                    ctx.font = nomangle('bold 13px Courier New, monospace');
                    ctx.fillStyle = isFlickering ? '#ef4444' : '#fbbf24';
                    ctx.fillText(`${ceil(player.dustCooldown)}s`, meterX + meterW / 2, meterY - 14);
                } else {
                    ctx.font = '14px sans-serif';
                    ctx.fillText('🌈', meterX + meterW / 2, meterY - 24);
                    ctx.font = nomangle('bold 10px Courier New, monospace');
                    ctx.fillStyle = player.dashing ? '#f472b6' : '#e2e8f0';
                    ctx.fillText(nomangle('DUST'), meterX + meterW / 2, meterY - 8);
                }

                ctx.fillStyle = (isExhausted && isFlickering) ? '#450a0a' : '#100422';
                ctx.fillRect(meterX, meterY, meterW, meterH);

                if (dustRatio > 0.01 && !isExhausted) {
                    const fillH = ~~(meterH * dustRatio);
                    const fillY = meterY + meterH - fillH;

                    const grad = ctx.createLinearGradient(0, meterY + meterH, 0, meterY);
                    grad.addColorStop(0, '#af52de');
                    grad.addColorStop(0.2, '#007aff');
                    grad.addColorStop(0.4, '#00c7be');
                    grad.addColorStop(0.6, '#34c759');
                    grad.addColorStop(0.8, '#ffcc00');
                    grad.addColorStop(1, '#ff3b30');

                    ctx.fillStyle = grad;
                    ctx.fillRect(meterX + 2, fillY + 2, meterW - 4, fillH - 4);

                    ctx.fillStyle = '#100422';
                    for (let y = meterY + meterH - 16; y > fillY + 4; y -= 16) {
                        ctx.fillRect(meterX + 2, y, meterW - 4, 2);
                    }

                    if (player.dashing) {
                        ctx.fillStyle = '#fff';
                        ctx.globalAlpha = 0.7 + sin(this.age * 14) * 0.3;
                        ctx.fillRect(meterX + 2, fillY + 2, meterW - 4, 3);
                    }
                }

                ctx.globalAlpha = 1;
                ctx.strokeStyle = isExhausted ? (isFlickering ? '#ef4444' : '#7f1d1d') : (player.dashing ? '#f472b6' : '#64748b');
                ctx.lineWidth = 2;
                ctx.strokeRect(meterX, meterY, meterW, meterH);
            });
        }

        // 4. Mobile / Touch Arcade Controller Buttons
        if (!player.dead && isMobile) {
            const bounds = getArcadeButtonBounds();

            this.drawArcadeButton(
                bounds.dash.x, bounds.dash.y, bounds.dash.r,
                nomangle('DASH'), nomangle('[HOLD]'), '⚡',
                '#af52de', '#7e22ce', DASH_TRIGGER, '#f472b6'
            );

            this.drawArcadeButton(
                bounds.jump.x, bounds.jump.y, bounds.jump.r,
                nomangle('JUMP'), nomangle('[STOMP]'), '▲',
                '#ff2d55', '#be123c', (TOUCH_DOWN && !DASH_TRIGGER), '#fda4af'
            );
        }

        // 5. Game Over Screen Overlay (Simple Bold Black & White, No Border, No Color)
        if (player.dead) {
            ctx.wrap(() => {
                ctx.fillStyle = '#000';
                ctx.globalAlpha = 0.85;
                ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                ctx.globalAlpha = 1;

                const centerY = isPortrait ? (CANVAS_HEIGHT * 0.34) : (CANVAS_HEIGHT / 2);

                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                ctx.font = nomangle('bold 48px Impact, Arial Black, sans-serif');
                ctx.fillStyle = '#fff';
                ctx.fillText(nomangle('G A M E   O V E R'), CANVAS_WIDTH / 2, centerY - 64);

                ctx.font = nomangle('bold 24px Courier New, monospace');
                ctx.fillStyle = '#fff';
                ctx.fillText(nomangle('SCORE: ') + pad5(currentScore) + nomangle('   BEST: ') + pad5(highScore), CANVAS_WIDTH / 2, centerY);

                ctx.font = nomangle('bold 20px Courier New, monospace');
                ctx.globalAlpha = 0.6 + sin(this.age * 8) * 0.4;
                ctx.fillStyle = '#fff';
                ctx.fillText(nomangle('▶ [TAP] OR [SPACE] TO RESTART ◀'), CANVAS_WIDTH / 2, centerY + 64);
            });
        }
    }

    drawArcadeButton(x, y, r, label, sublabel, icon, colorHex, darkColorHex, isPressed, brightHex) {
        ctx.wrap(() => {
            ctx.translate(~~x, ~~y);

            const arc = (offY, rad, col) => {
                ctx.fillStyle = col;
                ctx.beginPath();
                ctx.arc(0, offY, rad, 0, TWO_PI);
                ctx.fill();
            };

            // Drop shadow
            arc(10, r + 4, '#050811');

            ctx.translate(0, isPressed ? 8 : 0);

            // Outline, Bevel, and Main Disk
            arc(0, r + 4, '#000');
            arc(0, r, isPressed ? brightHex : darkColorHex);
            arc(isPressed ? 0 : -4, r - 6, isPressed ? '#fff' : colorHex);

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Icon
            ctx.fillStyle = isPressed ? darkColorHex : '#fff';
            ctx.font = nomangle('bold ') + ~~(r * 0.40) + nomangle('px Impact, Arial Black, sans-serif');
            ctx.fillText(icon, 0, isPressed ? -r * 0.16 : -r * 0.20);

            // Primary Label
            ctx.font = nomangle('bold ') + ~~(r * 0.26) + nomangle('px Courier New, monospace');
            ctx.fillText(label, 0, isPressed ? r * 0.20 : r * 0.16);

            // Sublabel
            if (sublabel) {
                ctx.font = nomangle('bold ') + ~~(r * 0.14) + nomangle('px Courier New, monospace');
                ctx.fillStyle = isPressed ? darkColorHex : 'rgba(255, 255, 255, 0.9)';
                ctx.fillText(sublabel, 0, isPressed ? r * 0.50 : r * 0.46);
            }
        });
    }
}
