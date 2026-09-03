let TOUCH_DOWN = false;

ontouchstart = (evt) => {
    inputMode = INPUT_MODE_TOUCH;
    evt.preventDefault();
    updateTouches(evt.touches);
};

ontouchmove = (evt) => {
    evt.preventDefault();
    updateTouches(evt.touches);
};

ontouchend = (evt) => {
    evt.preventDefault();
    updateTouches(evt.touches);
};

updateTouches = (touches) => {
    downKeys = {};

    const out = {};
    for (const touch of touches) {
        getEventPosition(touch, can, out);

        // Left third: Move Left
        // Middle-left: Move Right
        // Middle-right: Action 1 (Down / Roll / Crouch)
        // Right third: Action 2 (Jump / Space)
        const cellX = ~~(4 * out.x / can.width);
        downKeys[37] ||= cellX == 0; // Left
        downKeys[39] ||= cellX == 1; // Right
        downKeys[40] ||= cellX == 2; // Down
        downKeys[38] ||= cellX == 3; // Up / Jump
        downKeys[32] ||= cellX == 3; // Space
    }

    TOUCH_DOWN = touches.length > 0;
};

getEventPosition = (evt, can, out) => {
    if (!can) return;
    const canvasRect = can.getBoundingClientRect();
    out.x = (evt.pageX - canvasRect.nomangle(left)) / canvasRect.width * can.width;
    out.y = (evt.pageY - canvasRect.nomangle(top)) / canvasRect.height * can.height;
};
