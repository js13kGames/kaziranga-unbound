downKeys = {};

ALT_KEYS = {
    // WASD -> Arrows
    65: 37, // A -> Left
    68: 39, // D -> Right
    87: 38, // W -> Up
    83: 40, // S -> Down

    // ZQSD (French layout) -> Arrows
    90: 38, // Z -> Up
    81: 37, // Q -> Left
};

document.onkeydown = (evt) => {
    inputMode = INPUT_MODE_KEYBOARD;
    downKeys[ALT_KEYS[evt.keyCode] || evt.keyCode] = true;
};

document.onkeyup = (evt) => {
    downKeys[ALT_KEYS[evt.keyCode] || evt.keyCode] = false;
};

onblur = () => {
    downKeys = {};
};
