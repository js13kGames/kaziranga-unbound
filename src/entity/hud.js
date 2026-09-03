class HUD extends Entity {

    z = Z_HUD;
    categories = ['hud'];

    constructor(player) {
        super();
        this.player = player;
    }

    render() {
        this.cancelCamera();

        ctx.wrap(() => {
            ctx.textAlign = nomangle('left');
            ctx.textBaseline = nomangle('top');
            ctx.fillStyle = '#f8fafc';
            ctx.font = nomangle('bold 24px Courier New');

            ctx.translate(30, 30);
            ctx.fillText(`SCORE: ${G.score}`, 0, 0);

            ctx.font = nomangle('18px Courier New');
            ctx.fillStyle = '#94a3b8';
            ctx.fillText(`[ESC] PAUSE  |  [A/D/ARROWS] MOVE  |  [W/SPACE] JUMP`, 0, 35);
        });

        // Touch on-screen buttons when on mobile
        if (inputMode === INPUT_MODE_TOUCH) {
            ctx.wrap(() => {
                ctx.fillStyle = '#ffffff';
                ctx.globalAlpha = 0.25;

                const btnY = CANVAS_HEIGHT - 120;
                const btnSize = 70;

                // Left button
                ctx.fillRect(CANVAS_WIDTH * 0.1, btnY, btnSize, btnSize);
                // Right button
                ctx.fillRect(CANVAS_WIDTH * 0.3, btnY, btnSize, btnSize);
                // Jump button
                ctx.fillRect(CANVAS_WIDTH * 0.8, btnY, btnSize, btnSize);

                ctx.globalAlpha = 0.8;
                ctx.font = '28px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#ffffff';
                ctx.fillText('◄', CANVAS_WIDTH * 0.1 + btnSize / 2, btnY + btnSize / 2);
                ctx.fillText('►', CANVAS_WIDTH * 0.3 + btnSize / 2, btnY + btnSize / 2);
                ctx.fillText('▲', CANVAS_WIDTH * 0.8 + btnSize / 2, btnY + btnSize / 2);
            });
        }
    }
}
