class MainMenuScreen extends Screen {

    title = nomangle('JS13K STARTER');

    constructor() {
        super();

        this.addCommand(
            inputMode === INPUT_MODE_KEYBOARD
                ? nomangle('PRESS [SPACE] TO START')
                : nomangle('[TAP] TO START'),
            () => downKeys[32] || TOUCH_DOWN,
            () => {
                playSong();
                this.resolve();
            },
            false,
        );
    }

    render() {
        // Background subtle gradient
        const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(1, '#1e293b');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Animated Title
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

            // Subtitle
            ctx.font = '28px Courier New';
            ctx.fillStyle = '#94a3b8';
            ctx.fillText(nomangle('Lightweight HTML5 2D Micro-Framework'), CANVAS_WIDTH / 2, titleY + 70);

            if (G.highScore > 0) {
                ctx.font = '22px Courier New';
                ctx.fillStyle = '#f59e0b';
                ctx.fillText(`BEST SCORE: ${G.highScore}`, CANVAS_WIDTH / 2, titleY + 110);
            }
        });

        // Prompt
        ctx.wrap(() => {
            ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT * 0.72);
            ctx.font = 'bold 36px Impact, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Pulsing opacity
            ctx.globalAlpha = 0.6 + sin(this.age * 6) * 0.4;
            for (const { label } of this.commands) {
                ctx.drawCommandText(label.call ? label() : label);
            }
        });
    }
}
