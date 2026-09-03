import { EVALUATE, NOMANGLE, assembleHtml, hardcodeConstants, macro, mangle } from "@remvst/js13k-tools";
import CleanCSS from 'clean-css';
import { promises as fs } from 'fs';
import { minify as minifyHTML } from 'html-minifier';
import { Packer } from 'roadroller';
import * as terser from 'terser';
import yargs from 'yargs/yargs';

const JS_FILES = [
    'globals.js',

    'input/keyboard.js',
    'input/touch.js',

    'utils/math.js',
    'utils/easing.js',
    'utils/resizer.js',
    'utils/rect.js',
    'utils/first-item.js',

    'graphics/wrap.js',
    'graphics/create-canvas.js',
    'graphics/typography.js',

    'entity/entity.js',
    'entity/interpolator.js',
    'entity/particle.js',
    'entity/camera.js',
    'entity/structure.js',
    'entity/player.js',
    'entity/hud.js',

    'screen/screen.js',
    'screen/world-screen.js',
    'screen/main-menu-screen.js',
    'screen/gameplay-screen.js',
    'screen/pause-screen.js',

    'sound/ZzFXMicro.js',
    'sound/sonantx.js',
    'sound/song.js',

    'world.js',
    'game.js',
    'main.js',
];

const CONSTANTS = {
    "true": 1,
    "false": 0,
    "const": "let",
    "null": 0,

    "CELL_SIZE": 50,
    "COMMAND_SPACING": 50,

    "INPUT_MODE_KEYBOARD": 0,
    "INPUT_MODE_TOUCH": 1,

    "SONG_VOLUME": 0.35,

    "DEBUG_INFO": 0,
    "DEBUG_HITBOXES": 0,
};

const MANGLE_PARAMS = {
    "skip": [
        "repeat",
    ],
    "force": [
        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
        "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
        "u", "v", "w", "x", "y", "z",
        "alpha", "direction", "ended", "key", "speed", "item",
        "center", "wrap", "angle", "target", "path", "step",
        "color", "label", "action", "duration", "name", "controls",
        "update", "state", "rotation", "zoom", "entity", "entities",
        "frame", "text", "matrix", "acceleration"
    ]
};

const argv = yargs(process.argv.slice(2)).options({
    debug: { type: 'boolean', default: false },
    mangle: { type: 'boolean', default: false },
    minify: { type: 'boolean', default: false },
    'roadroll-level': { type: 'number', default: 0 },
    pack: { type: 'boolean', default: false },
    html: { type: 'string', demandOption: true },
}).parse();

(async () => {
    const constants: Record<string, any> = {
        DEBUG: argv.debug,
        ...CONSTANTS,
    };

    let z = 0;
    for (const constant of [
        "Z_BACKGROUND",
        "Z_STRUCTURE",
        "Z_PARTICLE",
        "Z_PLAYER",
        "Z_HUD",
    ]) {
        constants[constant] = z++;
    }

    let html = await fs.readFile('src/index.html', 'utf-8');
    let css = await fs.readFile('src/style.css', 'utf-8');

    let js = (await Promise.all(
        JS_FILES.map(path => fs.readFile('src/' + path, 'utf-8')))
    ).join('\n');

    js = hardcodeConstants(js, constants);
    js = macro(js, NOMANGLE);
    js = macro(js, EVALUATE);

    if (argv.mangle) {
        console.log('Mangling identifiers...');
        js = mangle(js, MANGLE_PARAMS);
    }

    if (argv.minify) {
        console.log('Minifying JS...');
        js = (await terser.minify(js, {
            mangle: {
                properties: false,
                toplevel: true,
            }
        })).code!;
    }

    if (argv['roadroll-level'] > 0) {
        console.log('Roadrolling (level ' + argv['roadroll-level'] + ')...');
        const packer = new Packer([
            {
                data: js,
                type: 'js',
                action: 'eval',
            },
        ], {});
        await packer.optimize(argv['roadroll-level']);
        const { firstLine, secondLine } = packer.makeDecoder();
        js = firstLine + secondLine;
    }

    if (argv.minify) {
        html = minifyHTML(html, {
            collapseWhitespace: true,
            minifyCSS: false,
            minifyJS: false
        });

        css = new CleanCSS().minify(css).styles;
    }

    const finalHtml = assembleHtml({ html, css, js });

    await fs.mkdir('build/', { recursive: true });
    await fs.writeFile(argv.html, finalHtml);
    console.log('Successfully built ' + argv.html);
})();
