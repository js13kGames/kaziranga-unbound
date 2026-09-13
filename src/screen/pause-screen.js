class PauseScreen extends Screen {

    absorb = true;

    constructor() {
        super();
        this.songVolume = 0.3;

        this.addCommand(
            nomangle('PRESS [ESC] OR [SPACE] TO RESUME'),
            () => downKeys[27] || downKeys[32] || TOUCH_DOWN,
            () => {
                downKeys[27] = false;
                downKeys[32] = false;
                TOUCH_DOWN = false;
                this.resolve();
            },
        );

        this.addCommand(
            nomangle('PRESS [R] TO RESTART'),
            () => downKeys[82],
            () => {
                downKeys[82] = false;
                this.pop();
                G.navigate(new GameplayScreen(), true);
            },
        );
    }

    render() {
        ctx.fillStyle = '#000';
        ctx.globalAlpha = 0.85;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.globalAlpha = 1;

        ctx.wrap(() => {
            const centerY = CANVAS_HEIGHT * 0.46;

            // "P A U S E D" Banner in bold white (No borders, no colors)
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = nomangle('bold 48px Impact, Arial Black, sans-serif');
            ctx.fillStyle = '#fff';
            ctx.fillText(nomangle('P A U S E D'), CANVAS_WIDTH / 2, centerY - 60);

            // Commands in simple bold white monospace
            ctx.translate(CANVAS_WIDTH / 2, centerY + 16);
            ctx.font = nomangle('bold 22px Courier New, monospace');
            ctx.fillStyle = '#fff';
            for (const { label } of this.commands) {
                ctx.drawCommandText(label.call ? label() : label);
                ctx.translate(0, 46);
            }
        });
    }
}
