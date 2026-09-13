canvasPrototype.drawCommandText = function(text) {
    this.wrap(() => {
        const { width } = ctx.measureText(text);
        this.translate(
            this.textAlign == nomangle('center')
            ? -width / 2
            : this.textAlign == nomangle('right')
            ? -width
            : 0,
            0
        );

        this.textAlign = nomangle('left');
        this.fillText(text, 0, 0);
    });
};
