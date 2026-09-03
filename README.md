# JS13K Game Starter Template

A clean, modular, and battle-tested starter pack for [JS13kGames](https://js13kgames.com/) submissions.

This template strips away game-specific assets and mechanics while keeping the complete build, audio, input, rendering, and entity architecture in place.

---

## Features

* **Under 13 KB Budget**: Built-in bundling pipeline with Terser, identifier mangling, constant inlining, and Roadroller quine compression.
* **Zero External Dependencies at Runtime**: 100% native HTML5 Canvas 2D and Web Audio API.
* **Physics & Substepping**: Smooth 120Hz physics substepping loop to eliminate high-speed tunneling and frame-rate dependence.
* **Audio Included**:
  * [ZzFX Micro](https://github.com/KilledByAPixel/ZzFX) for procedural 8-bit sound effects.
  * [Sonant-X](https://github.com/nicolas-van/sonant-x) for polyphonic chiptune synth background music.
* **Responsive Canvas**: Auto-scales to 16:9 widescreen or portrait orientation, with automatic mobile touch control detection.
* **Modular Screen Stack**: Promise-based screen navigation (`awaitCompletion()`) for menus, cutscenes, levels, and transitions.

---

## Quick Start

### 1. Development Mode
```bash
npm run build:debug
npm start
```
This starts a local development server with file watching. Open `http://localhost:8080/debug.html`.

### 2. Build for Production (JS13K submission)
```bash
npm run build:prod
npm run zip:prod
```
The final zipped game is generated at `build/game.zip`. The script will output the exact byte size and verify whether it fits under the 13,312 bytes (13 KB) limit.

---

## Controls

* **Desktop**:
  * `A` / `D` or `Arrow Left` / `Arrow Right`: Move
  * `W` / `Arrow Up` / `Space`: Jump / Action
  * `Escape`: Pause / Resume
  * `R`: Restart (in pause menu)
* **Mobile**:
  * On-screen touch zones for directional movement and actions.

---

## Project Structure

```
starter/
├── build-game.ts             # Bundler, constant inlining, Terser, Roadroller
├── build-zip.ts              # Zipping script & 13KB validator
├── package.json              # Build scripts and tooling dependencies
├── tsconfig.json             # TypeScript configuration for tsx scripts
└── src/
    ├── index.html            # Minimal HTML shell
    ├── style.css             # Full-window black canvas container
    ├── globals.js            # Shared global instances (can, ctx, G, inputMode)
    ├── main.js               # Entrypoint, canvas resize binding, Game init
    ├── game.js               # Game manager, requestAnimationFrame, screen stack
    ├── world.js              # Entity container, category indexing, camera scale
    ├── input/
    │   ├── keyboard.js       # WASD, ZQSD, and Arrow key input
    │   └── touch.js          # Touch screen event handling
    ├── utils/
    │   ├── math.js           # Math helpers (angle, lerp, rnd, clamp)
    │   ├── easing.js         # Animation curves (easeInQuad, easeOutSine)
    │   ├── rect.js           # AABB rectangle collision utility
    │   └── resizer.js        # Responsive 16:9 canvas letterboxing
    ├── graphics/
    │   ├── wrap.js           # ctx.wrap (save/restore)
    │   ├── create-canvas.js  # Offscreen canvas creator
    │   └── typography.js     # Styled canvas text for hotkey buttons
    ├── entity/
    │   ├── entity.js         # Base entity class with interp() tweening
    │   ├── camera.js         # Follow camera with screen shake and zoom
    │   ├── interpolator.js   # Async property lerp / tweening
    │   ├── particle.js       # Particle emitter & fireworks
    │   ├── player.js         # Starter player entity (movement, jump, dust)
    │   ├── structure.js      # Platform matrix with AABB collision
    │   └── hud.js            # HUD score, timer, and touch controls
    ├── screen/
    │   ├── screen.js         # Base screen class & screen transitions
    │   ├── world-screen.js   # World screen with 120Hz physics substepping
    │   ├── main-menu-screen.js # Title screen
    │   ├── gameplay-screen.js  # Main gameplay scene
    │   └── pause-screen.js     # Pause menu
    └── sound/
        ├── ZzFXMicro.js      # Procedural sound effect generator
        ├── sonantx.js        # Web Audio synth
        └── song.js           # Lightweight background music definition
```

---

## How to Customize

1. **Add an Entity**: Create a new class extending `Entity` in `src/entity/`, implement `cycle(elapsed)` and `render()`, and add the filename to `JS_FILES` in `build-game.ts`.
2. **Add Sound Effects**: Generate a sound with [ZzFX Sound Generator](https://killedbyapixel.github.io/ZzFX/) and play it with `zzfx(...[params])`.
3. **Change the Music**: Use [Sonant-X Live](https://github.com/nicolas-van/sonant-x-live) to export a JSON track and paste it into `src/sound/song.js`.
4. **Edit the Terrain**: Update `matrix` in `src/entity/structure.js` (`1` = solid block, `2` = one-way platform, `0` = empty space).
