# Session 1 — Context

**Date:** 2026-04-14
**Branch:** feat/visual-rework
**Agent:** Claude Sonnet 4.6

---

## What This Session Accomplished

Full context load, brand doc retrieval, and first-pass obvious fixes on the 3 migrated pages. No new features or page rebuilds — foundation work only.

---

## Project Overview

**RAD/S²** (Radians per Second Squared) is a venture creation factory. The website lives at `radsquared.ai`. A redesign prototype is being developed at `new.radsquared.ai` on the `feat/visual-rework` branch. When ready, pushed to the radsquared.ai GitHub repo → GitHub Actions auto-deploys main to radsquared.ai.

**Tech stack:** Vite 6, vanilla JS, Three.js (gyroscope hero), no framework. 12 HTML pages, all at root. Nav, footer, live indicator, and scroll reveal are injected dynamically by `app.mjs`.

---

## Company Identity (confirmed from brand docs)

| Field      | Value |
|------------|-------|
| Brand name | Rad/s² AI |
| Legal name | Radians per Second Squared, LLC |
| Tagline    | Angular Acceleration |
| Address    | 301 Science Park Rd, Suite 113 · State College, PA 16803 |
| Location   | State College, PA — coords: 40.7934° N, 77.8600° W |
| Website    | https://radsquared.ai |

---

## Two Design Eras

### Era 1 — Kinetic Precision (original radsquared.ai)
Pure black bg, pure white, architectural brutalism, zero border-radius, hover inversion flicker, particle dot grid, Space Grotesk + IBM Plex Mono. Telemetry/physics-lab aesthetic. Design system preserved in Stitch (`projects/15634751862408681161`).

### Era 2 — Warm Editorial (current rework direction)
Off-white (`#FAF9F7`) bg, deep sage (`#5A7A6B`) accent, near-black (`#1A1A1A`) text. Quiet confidence. Organic warmth (the hand-drawn logo is evidence of this intent). References: Stripe, Linear, Apple typography, McKinsey editorial layouts.

**Canonical design context:** `.impeccable.md` at project root — always read before design work.

---

## Logo

**File:** `assets/logo.png` — 465×502px, RGBA PNG, transparent background.

Hand-drawn circular brushstroke mark with "rad/s²" inside. Organic, ink-like — not geometric. This warmth is intentional. The logo coexisting with the Three.js gyroscope in the hero creates a deliberate tension: organic brushstroke meets precision mechanics.

**Now used in:** Nav (32px height, replaces the "RAD/S²" text wordmark).

---

## Page Migration Status

### New Era — Migrated to Warm Editorial
- `index.html` — hero, system definition, operating modes, system map
- `manifesto.html` — 5-section doctrine with pull quotes, physics grid
- `ventures.html` — stats bar + 5 venture cards

### Old Era — Not Yet Migrated (Inter + dark bg + old component classes)
- **Dark bg pages:** `contact.html`, `team.html`, `catalyst.html`, `lab.html`, `hybrid.html`
- **Uncertain (Inter, possibly light):** `roadmap.html`, `opportunities.html`, `legal.html`

These 9 pages are the main backlog — to be reworked with precision in upcoming sessions.

---

## All Changes Made This Session

### styles.css
- `--font-display` → `'Avenir Next', 'Avenir', system-ui, -apple-system, sans-serif`
- `--font-mono` → `'Menlo', 'SF Mono', 'Consolas', monospace`
- `.nav-brand` → replaced text styling with flex/image container
- `.nav-logo` → new rule: `height: 32px; width: auto;`
- `.manifesto-pull-quote` → removed banned `border-left: 2px solid var(--accent)`; replaced with accent-colored text at 1.25rem

### app.mjs
- Removed `injectFont()` function and its DOMContentLoaded call (no longer needed — system fonts)
- Nav brand replaced: text "RAD/S²" → `<img src="assets/logo.png" alt="Rad/s²" class="nav-logo" />`

### index.html, manifesto.html, ventures.html
- Removed Google Fonts `<link>` tags (3 per page: 2× preconnect + 1× stylesheet)

### index.html
- Fixed hero coordinates: NYC (40.7128° N, 74.0060° W) → State College PA (40.7934° N, 77.8600° W)

### assets/logo.png
- Downloaded from `rads2-engineering/toolbox` → `sandbox/doc-renderer` branch
- Placed at `assets/logo.png`

### .impeccable.md
- Added: Company Identity table, Logo section with usage rules, Location/coordinates, confirmed canonical color palette and fonts from brand docs, typographic H1 motif note

### context/context_1.md
- This file (created this session)

---

## Brand Docs Location

`rads2-engineering/toolbox` GitHub repo, branch `sandbox/doc-renderer`, path `sandbox/doc-renderer/engine/templates/brands/rads2/`.

Key files:
- `brand.typ` — company constants
- `engine/templates/pandoc/memo.typ` — full design system (colors, fonts, heading styles)
- `engine/templates/brands/rads2/logo.png` — brand logo

---

## Tools Available

### Impeccable Skills (`.agents/skills/`)
- `/impeccable [teach|craft|extract]` — core design framework
- `/shape [feature]` — design brief before writing code
- `/critique [area]` — scored design review (Nielsen heuristics + AI slop detection)
- `/animate`, `/polish`, `/typeset`, `/colorize`, `/layout` — targeted refinements
- `/bolder`, `/quieter`, `/overdrive`, `/delight`, `/distill` — intensity + UX adjustments

### Stitch MCP
Project `projects/15634751862408681161` — "Rad/s² AI Website" with Kinetic Precision (Era 1) design system. Use to prototype screens before implementing code. For Era 2 work, create a new Warm Editorial design system in Stitch or use text-to-screen with `.impeccable.md` palette.

---

## What Comes Next (Backlog for Upcoming Sessions)

1. **9-page rework backlog** — migrate old-era pages to Warm Editorial system, one by one with precision
2. **Critique pass** — run `/critique` on the 3 migrated pages for a scored baseline
3. **Logo integration** — consider logo in hero section (alongside or replacing the "rad/s²" logomark text overlay on the gyroscope canvas)
4. **Typographic motif** — explore the brand doc's H1 accent underline rule as a web pattern
5. **Deeper feature work** — TBD based on user direction in upcoming sessions

---

## Key Files for Next Agent

| File | Purpose |
|------|---------|
| `.impeccable.md` | Primary design context — read before ANY design work |
| `styles.css` | Full design system CSS (Era 2) |
| `app.mjs` | Nav, footer, live indicator, scroll reveal — injected on all pages |
| `hero.js` | Three.js gyroscope hero animation |
| `assets/logo.png` | Brand logo mark (hand-drawn circular brushstroke) |
| `index.html`, `manifesto.html`, `ventures.html` | The 3 migrated Era 2 pages |
| `context/context_1.md` | This file — full session record |
