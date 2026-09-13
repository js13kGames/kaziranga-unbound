let TOUCH_DOWN = false;

getArcadeButtonBounds = () => {
    const isPortrait = CANVAS_HEIGHT > CANVAS_WIDTH;
    if (isPortrait) {
        const deckTop = CANVAS_HEIGHT * 0.68;
        const btnY = deckTop + (CANVAS_HEIGHT - deckTop) * 0.52;
        const btnR = min(110, CANVAS_WIDTH * 0.17);
        return {
            isPortrait: true,
            dash: { x: CANVAS_WIDTH * 0.28, y: btnY, r: btnR },
            jump: { x: CANVAS_WIDTH * 0.72, y: btnY, r: btnR },
            deckTop,
        };
    } else {
        const btnR = 75;
        const btnY = CANVAS_HEIGHT - 95;
        return {
            isPortrait: false,
            dash: { x: 130, y: btnY, r: btnR },
            jump: { x: CANVAS_WIDTH - 130, y: btnY, r: btnR },
            deckTop: CANVAS_HEIGHT - 170,
        };
    }
};

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

oncontextmenu = (evt) => {
    evt.preventDefault();
    return false;
};

onmousedown = (evt) => {
    if (evt.button === 2) {
        // Right Mouse Click -> DASH
        evt.preventDefault();
        DASH_TRIGGER = true;
        return;
    }

    const out = {};
    getEventPosition(evt, can, out);
    const bounds = getArcadeButtonBounds();

    TOUCH_DOWN = true;

    if (inputMode === INPUT_MODE_TOUCH || bounds.isPortrait) {
        const dDash = hypot(out.x - bounds.dash.x, out.y - bounds.dash.y);
        if (dDash <= bounds.dash.r * 1.35) {
            DASH_TRIGGER = true;
            return;
        }
    }

    downKeys[32] = true;
};

onmouseup = (evt) => {
    if (evt.button === 2) {
        DASH_TRIGGER = false;
        return;
    }
    downKeys[32] = false;
    TOUCH_DOWN = false;
    DASH_TRIGGER = false;
};

updateTouches = (touches) => {
    downKeys = {};
    DASH_TRIGGER = false;

    const bounds = getArcadeButtonBounds();
    const out = {};
    let jumpTouch = false;
    let anyTouch = touches.length > 0;

    for (const touch of touches) {
        getEventPosition(touch, can, out);

        // Check Dash button circular zone
        const dDash = hypot(out.x - bounds.dash.x, out.y - bounds.dash.y);
        if (dDash <= bounds.dash.r * 1.35) {
            DASH_TRIGGER = true;
            continue;
        }

        // Any other touch on the entire screen triggers jump & start
        jumpTouch = true;
    }

    downKeys[32] = jumpTouch;
    downKeys[38] = jumpTouch;
    TOUCH_DOWN = anyTouch;
};

getEventPosition = (evt, can, out) => {
    if (!can) return;
    const canvasRect = can.getBoundingClientRect();
    out.x = (evt.pageX - canvasRect.left) / canvasRect.width * can.width;
    out.y = (evt.pageY - canvasRect.top) / canvasRect.height * can.height;
};
