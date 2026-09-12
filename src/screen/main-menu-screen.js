class MainMenuScreen extends Screen {

    title = nomangle('UNICORN RUNNER');

    constructor() {
        super();

        this.addCommand(
            inputMode === INPUT_MODE_KEYBOARD
                ? nomangle('PRESS [SPACE] TO RUN')
                : nomangle('[TAP] TO RUN'),
            () => downKeys[32] || downKeys[38] || TOUCH_DOWN,
            () => {
                playSong();
                this.resolve();
            },
            false,
        );
    }

    render() {
        const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
        grad.addColorStop(0, '#090d16');
        grad.addColorStop(1, '#1e293b');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Animated Rainbow Title
        ctx.wrap(() => {
            ctx.fillStyle = '#38bdf8';
            ctx.strokeStyle = '#0284c7';
            ctx.lineWidth = 12;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = 'bold 96px Impact, Arial Black, sans-serif';

            const titleY = CANVAS_HEIGHT / 3 + sin(this.age * 2) * 10;
            ctx.strokeText(this.title, CANVAS_WIDTH / 2, titleY);
            ctx.fillText(this.title, CANVAS_WIDTH / 2, titleY);

            // Subtitle instructions
            ctx.font = '26px Courier New, monospace';
            ctx.fillStyle = '#94a3b8';
            ctx.fillText(nomangle('Jump Cacti • Deflect Bullets • Smash Hunters'), CANVAS_WIDTH / 2, titleY + 70);

            if (G.highScore > 0) {
                ctx.font = 'bold 24px Courier New, monospace';
                ctx.fillStyle = '#f59e0b';
                ctx.fillText(`BEST SCORE: ${String(G.highScore).padStart(5, '0')}`, CANVAS_WIDTH / 2, titleY + 115);
            }
        });

        // Prompt
        ctx.wrap(() => {
            ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT * 0.74);
            ctx.font = 'bold 36px Impact, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.globalAlpha = 0.6 + sin(this.age * 6) * 0.4;
            for (const { label } of this.commands) {
                ctx.drawCommandText(label.call ? label() : label);
            }
        });
    }
}
