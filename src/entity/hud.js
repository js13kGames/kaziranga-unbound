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

        // 1. Chrome Dino Style Top Score Bar
        ctx.wrap(() => {
            ctx.textAlign = nomangle('right');
            ctx.textBaseline = nomangle('top');
            ctx.font = nomangle('bold 26px Courier New, monospace');

            const scoreX = CANVAS_WIDTH - 40;
            const scoreY = 30;

            // High Score (Muted grey)
            ctx.fillStyle = '#64748b';
            const hiText = `HI ${pad5(highScore)}  `;
            ctx.fillText(hiText, scoreX - 120, scoreY);

            // Current Score (Blinks briefly on every 100m milestone)
            const isMilestone = (currentScore % 100 < 15) && (currentScore >= 100);
            const showScore = !isMilestone || (sin(this.age * 20) > 0);

            if (showScore) {
                ctx.fillStyle = isMilestone ? '#38bdf8' : '#f8fafc';
                ctx.fillText(pad5(currentScore), scoreX, scoreY);
            }
        });

        // 2. Control hint in top-left
        if (!this.player.dead) {
            ctx.wrap(() => {
                ctx.textAlign = nomangle('left');
                ctx.textBaseline = nomangle('top');
                ctx.font = nomangle('18px Courier New, monospace');
                ctx.fillStyle = '#64748b';
                ctx.fillText(nomangle('[SPACE] / [TAP] JUMP  |  [ESC] PAUSE'), 40, 30);
            });
        }

        // 3. Retro Game Over Screen Overlay
        if (this.player.dead) {
            ctx.wrap(() => {
                // Semi-transparent backdrop tint
                ctx.fillStyle = '#050811';
                ctx.globalAlpha = 0.55;
                ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

                ctx.globalAlpha = 1;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                const centerY = CANVAS_HEIGHT / 2;

                // "G A M E   O V E R" Banner
                ctx.font = 'bold 76px Impact, Arial Black, sans-serif';
                ctx.fillStyle = '#ff3b30';
                ctx.strokeStyle = '#7f1d1d';
                ctx.lineWidth = 10;
                ctx.strokeText(nomangle('G A M E   O V E R'), CANVAS_WIDTH / 2, centerY - 80);
                ctx.fillText(nomangle('G A M E   O V E R'), CANVAS_WIDTH / 2, centerY - 80);

                // Final Score breakdown
                ctx.font = 'bold 32px Courier New, monospace';
                ctx.fillStyle = '#f8fafc';
                ctx.fillText(`SCORE: ${pad5(currentScore)}   BEST: ${pad5(highScore)}`, CANVAS_WIDTH / 2, centerY);

                // Pulsing Restart Prompt
                ctx.font = 'bold 28px Courier New, monospace';
                ctx.globalAlpha = 0.5 + sin(this.age * 8) * 0.5;
                ctx.fillStyle = '#38bdf8';
                ctx.fillText(nomangle('PRESS [SPACE] OR [TAP] TO RESTART'), CANVAS_WIDTH / 2, centerY + 80);
            });
        }
    }
}
