class PauseScreen extends Screen {

    constructor() {
        super();

        this.addCommand(
            nomangle('PRESS [ESC] OR [SPACE] TO RESUME'),
            () => downKeys[27] || downKeys[32] || TOUCH_DOWN,
            () => this.resolve(),
        );

        this.addCommand(
            nomangle('PRESS [R] TO RESTART'),
            () => downKeys[82],
            () => {
                this.pop();
                G.startNavigation();
            },
        );
    }

    render() {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.wrap(() => {
            ctx.fillStyle = '#f8fafc';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = 'bold 72px Impact, sans-serif';
            ctx.fillText(nomangle('PAUSED'), CANVAS_WIDTH / 2, CANVAS_HEIGHT * 0.4);

            ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT * 0.6);
            ctx.font = '28px Courier New';
            for (const { label } of this.commands) {
                ctx.drawCommandText(label.call ? label() : label);
                ctx.translate(0, 50);
            }
        });
    }
}
