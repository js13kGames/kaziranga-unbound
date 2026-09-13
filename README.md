# 🦏 Kaziranga Unbound
### **#SaveKaziranga • JS13kGames 2026 Entry**

[![JS13K Size](https://img.shields.io/badge/JS13K%20Size-11.4%20KB%20%2F%2013%20KB-success)](https://js13kgames.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

*The Bureaucracy has slashed Kaziranga National Park's Eco-Sensitive Zone buffer from 10km down to just 1km! Armed poachers, snipers, and illegal corporate encroachers are swarming the sanctuary. As the armored Great Indian One-Horned Rhino, charge across the wilderness, deflect sniper rounds with your horn, smash poachers, and reclaim the Eco-Zone!*

---

## 🦄 Myth & Lore: The Rhino & The Unicorn

> **Historical Fact**: The legendary myth of the **Unicorn** was historically inspired by early traveler encounters with the **Indian One-Horned Rhinoceros** (*Rhinoceros unicornis*).
> 
> Throughout history, myths falsely claimed their single horns possessed magical healing and medicinal properties. Tragically, this myth led both the fictional unicorn and the real-world rhinoceros into centuries of ruthless poaching, greed, and exploitation. In *Kaziranga Unbound*, the rhino reclaims this mystical energy—channeling the legendary rainbow horn power not for exploitation, but to fight back and defend its ancestral homeland!

---

## 🎮 Controls

### ⌨️ Desktop (Keyboard & Mouse)
| Action | Key / Input | Description |
| :--- | :--- | :--- |
| **Jump / Stomp** | `[SPACE]`, `[W]`, `[UP]`, `[L-CLICK]` | Hold for higher jumps; stomp down on poachers & tigers from above |
| **Rainbow Dash / Horn Shield** | `[SHIFT]`, `[D]`, `[RIGHT]`, `[R-CLICK]` | Charge at hypersonic speed; raises horn to deflect sniper bullets |
| **Pause / Resume** | `[ESC]`, `[P]` | Pause or resume the game |
| **Quick Restart** | `[R]` | Instant restart |

### 📱 Mobile & Touch
- **Dedicated Arcade Touch Buttons**: On-screen **JUMP** and **DASH** arcade buttons.
- **Responsive Layout**: Seamlessly adapts to portrait or landscape orientations on mobile phones and tablets.

---

## ⚔️ Gameplay & Features

- **Horn Deflection Engine**: Activate your Rainbow Dash to raise your indestructible horn shield. Incoming sniper bullets will bounce off your horn and reflect straight back at the hunters!
- **Multi-Tiered Platform Gauntlet**:
  - **Ground**: Swamps, bulldozers, jeeps, and patrolling poachers.
  - **Tier 1 (Canopy)**: Riverbank platforms and aggressive scouts.
  - **Tier 2 (High Ridges)**: Perilous multi-hazard gauntlets and rapid-fire sniper riflemen.
  - **Tier 3 (Clouds)**: Rare, floating cloud platforms for high-risk navigation and massive score bonuses.
- **Dust Energy Management**: Dashes consume Rainbow Dust energy. Manage your meter to prevent exhaustion and maintain your defensive charge.
- **Enemies & Hazards**:
  - **Poachers & Snipers**: Ranged riflemen that track and shoot fast velocity bullets.
  - **Tigers**: High-speed sprinting predators.
  - **Bulldozers & Jeeps**: Heavy industrial obstacles encroaching on the buffer zone.

---

## 🛠️ Technical Highlights (Under 11.4 KB Total)

* **100% Pure Procedural Graphics**: Zero external image files or spritesheets. All rhino skeletal walking/sleeping kinematics, poachers, tigers, parallax sunset mountains, volumetric particle smoke, and muzzle flashes are mathematically rendered in real-time on HTML5 Canvas 2D.
* **Chill Assamese Bihu Soundtrack (112 BPM)**: Custom synthesized chiptune background score featuring the **Bahi** (bamboo flute), **Dhol** (Assamese pitch-sliding drum), **Toka** (bamboo clapper), and **Ektara** folk bass.
* **Physics & Deflection Engine**: Custom vector-reflection collision engine for real-time projectile deflections and multi-platform raycasting.
* **Ultra-Lean Compression Pipeline**: Built with Terser, custom macro inlining, identifier mangling, and [Roadroller](https://github.com/lifthrasiir/roadroller) level 2 quine compression.

---

## 🚀 Building & Running Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)

### 1. Development Mode
```bash
npm run build:debug
npm start
```
Starts a local development server with live watching at `http://localhost:8080/debug.html`.

### 2. Production Build (JS13K Submission)
```bash
npm run build:prod
npm run zip:prod
```
Builds the final production bundle at `build/index.html` and packages `build/game.zip`.

---

## 📊 Build Size Budget

```
Target Limit : 13,312 bytes (13.00 KB)
Current Build: 11,406 bytes (~11.14 KB)
Free Margin  :  1,906 bytes (14.3% remaining)
```

---

## 🌿 #SaveKaziranga
Protect the wildlife, restore the Eco-Sensitive Zone, and support the conservation of the Great Indian One-Horned Rhinoceros!
