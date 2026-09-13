onresize = () => {
    let windowWidth = innerWidth,
        windowHeight = innerHeight,
        containerStyle = can.parentElement.style;

    if (windowHeight > windowWidth) {
        // Mobile Portrait Mode: Fullscreen with larger, chunky game elements
        CANVAS_WIDTH = 900;
        CANVAS_HEIGHT = ~~(900 * (windowHeight / windowWidth));

        can.width = CANVAS_WIDTH;
        can.height = CANVAS_HEIGHT;

        containerStyle.width = windowWidth + 'px';
        containerStyle.height = windowHeight + 'px';
    } else {
        // Landscape / Desktop Mode: Standard 16:9 aspect ratio
        CANVAS_WIDTH = 1600;
        CANVAS_HEIGHT = 900;

        let canvasRatio = CANVAS_WIDTH / CANVAS_HEIGHT,
            availableRatio = windowWidth / windowHeight,
            appliedWidth,
            appliedHeight;

        if (availableRatio <= canvasRatio) {
            appliedWidth = windowWidth;
            appliedHeight = appliedWidth / canvasRatio;
        } else {
            appliedHeight = windowHeight;
            appliedWidth = appliedHeight * canvasRatio;
        }

        can.width = CANVAS_WIDTH;
        can.height = CANVAS_HEIGHT;

        containerStyle.width = appliedWidth + 'px';
        containerStyle.height = appliedHeight + 'px';
    }
};
