canvasPrototype.drawCommandText = function(text) {
    const colorStack = [this.fillStyle];
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

        for (const char of text.split('')) {
            if (char == '[') colorStack.push('#38bdf8'); // Highlight key in sky blue
            if (char == '(') colorStack.push('#a855f7'); // Highlight secondary info in purple
            this.fillStyle = colorStack[colorStack.length - 1];
            this.strokeText(char, 0, 0);
            this.fillText(char, 0, 0);
            this.translate(this.measureText(char).width, 0);
            if (char == ']' || char == ')') colorStack.pop();
        }
    });
};
