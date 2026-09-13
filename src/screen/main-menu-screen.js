class MainMenuScreen extends Screen {

    title = nomangle('KAZIRANGA UNBOUND');

    constructor() {
        super();

        this.addCommand(
            inputMode === INPUT_MODE_KEYBOARD
                ? nomangle('▶ PRESS [SPACE] TO RUN ◀')
                : nomangle('▶ [TAP] ANYWHERE TO RUN ◀'),
            () => downKeys[32] || downKeys[38] || downKeys[13] || TOUCH_DOWN,
            () => {
                playSong();
                this.resolve();
            },
            false,
        );
    }

    render() {
        // 1. Solid Pure Black Background
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // 2. Simple Bold Black & White Title & Subtitle (No borders, no colors)
        ctx.wrap(() => {
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const titleSize = min(68, CANVAS_WIDTH * 0.064);
            ctx.font = nomangle('bold ') + ~~titleSize + nomangle('px Impact, Arial Black, sans-serif');

            const titleY = CANVAS_HEIGHT * 0.35 + sin(this.age * 2.5) * 6;

            // Simple Bold White Title
            ctx.fillStyle = '#fff';
            ctx.fillText(this.title, CANVAS_WIDTH / 2, titleY);

            // Subtitle in clean bold white monospace
            ctx.font = nomangle('bold 18px Courier New, monospace');
            ctx.fillStyle = '#fff';
            ctx.fillText(nomangle('RHINO RUNNER • DEFLECT BULLETS • SMASH POACHERS'), CANVAS_WIDTH / 2, titleY + 54);

            // High Score
            if (G.highScore > 0) {
                const hsY = titleY + 92;
                const hsText = nomangle('BEST: ') + String(G.highScore).padStart(5, '0');
                ctx.font = nomangle('bold 20px Courier New, monospace');
                ctx.fillStyle = '#fff';
                ctx.fillText(hsText, CANVAS_WIDTH / 2, hsY);
            }
        });

        // 3. Simple Bold White Start Prompt (No borders, no colors)
        ctx.wrap(() => {
            const promptY = CANVAS_HEIGHT * 0.74;

            ctx.translate(CANVAS_WIDTH / 2, promptY);
            ctx.font = nomangle('bold 26px Courier New, monospace');
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#fff';

            ctx.globalAlpha = 0.6 + sin(this.age * 6) * 0.4;
            for (const { label } of this.commands) {
                ctx.drawCommandText(label.call ? label() : label);
            }
        });
    }
}
