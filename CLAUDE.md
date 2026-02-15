# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MTG Horde is a cooperative Magic: The Gathering game variant built with Svelte 5. Players fight together against an automated "horde" deck. The application runs entirely client-side with a custom game engine managing state via Svelte 5 runes.

Live app: https://mtg-horde.netlify.app/

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code (Prettier + ESLint)
npm run lint

# Format code
npm run format

# Import a new horde deck
cd decks/
node import-deck.js filename.txt
# Then add the generated JSON to decks/index.js exports
```

## Architecture

### Game Engine (`src/game/`)

The game uses a custom engine (no external framework). The engine is a singleton exported from `src/game/index.js`.

```
src/game/
├── index.js            # Singleton Engine export
├── engine.svelte.js    # Engine class (state, moves, undo/redo, savepoints)
├── phases.js           # Phase/stage definitions and move mappings
└── helpers.js          # Deck loading, card utilities, shuffle algorithms
```

- **Engine** (`engine.svelte.js`): Extends a custom `EventEmitter` (based on `EventTarget`). Uses `$state()` for reactive state and `$derived()` for computed values (`hordeLife`, `hordeDamage`). Includes built-in undo/redo stacks and localStorage savepoint system.
- **Phases** (`phases.js`):
  - `initialSurvivorsTurns`: Pre-game setup turns for survivors
  - `fightTheHorde`: Main game loop with stages `draw` and `attack`
- **Moves**: Defined in `PHASES_CONFIG`, automatically resolved from current phase via a `Proxy` on `engine.moves`.

Game state is accessed via `G.state` throughout components. Moves are called via `G.moves.moveName()`.

### Game Helpers (`src/game/helpers.js`)

Core game mechanics:

- **Deck Loading**: `loadDeck()` with three distribution modes for token placement:
  - `geometric`: Even token distribution with geometric probability
  - `geometric_boosted`: Geometric with limits on consecutive token draws (default)
  - `random`: Fully random distribution
- **Biased Shuffle**: `biaisedShuffle()` pushes late-game cards (tagged with `#lategame` or high CMC/rarity) toward the end of the deck
- **Card Utilities**: Type checks (`isTokenCard`, `isSorceryCard`, etc.), `clearCardState()`, `generateCardRandomId()` (uses `crypto.randomUUID()`)
- **Life Calculations**: Horde life = deck size + non-token creatures on battlefield

### Svelte 5 Patterns

This project uses **Svelte 5** with runes:

- `$state()`: Reactive state (Engine wraps game state)
- `$derived()`: Computed values (`hordeLife`, `hordeDamage`)
- `$effect()`: Side effects (e.g., showing modals, game over alerts)

Components subscribe to game state changes via the reactive `G.state` object (where `G` is the Engine singleton).

### Deck System

Decks are stored in `decks/` as JSON files:

- Each deck JSON contains cards with Scryfall data
- `decks/import-deck.js` converts text deck lists to JSON using the Scryfall SDK
- Text format: `<qty> <card name> (<set code>) #tag1 #tag2`
- Custom tags: `#lategame` affects shuffle bias
- Export new decks in `decks/index.js`

### Vite Configuration

Aliases in `vite.config.js`:

```javascript
alias: {
    $assets: './src/assets',
    decks: './decks'
}
```

### Component Structure

- `src/App.svelte`: Root component, hash-based routing (`#distribution` for stats page)
- `src/components/Board.svelte`: Main game board, manages modals and game flow
- `src/components/Battlefield.svelte`: Displays horde creatures
- `src/components/Card.svelte`: Individual card with tap/marker/zone controls
- `src/components/Score.svelte`: Life totals, damage tracking, undo/redo
- `src/components/Settings.svelte`: Game configuration (deck, players, tokens %)
- `src/components/SettingsModal.svelte`: Modal wrapper for Settings
- `src/components/GraveyardModal.svelte`: Graveyard zone browser
- `src/components/AddTokenModal.svelte`: Add extra tokens to battlefield
- `src/components/GameInfo.svelte`: Game information display
- `src/components/AlertToast.svelte`: Toast notifications
- `src/components/FullscreenToggle.svelte`: Fullscreen toggle
- `src/CompareDistribution.svelte`: Visualization page for distribution algorithms

### Key Game Flow

1. User configures game in Settings modal (deck, # survivors, token proportion)
2. `startGame` move initializes deck, life totals, and enters `initialSurvivorsTurns` phase
3. After initial turns, transitions to `fightTheHorde` phase
4. Each turn:
   - Horde draw stage: draw cards until first non-token (`hordeDrawCards`)
   - Horde attack stage: horde attacks with battlefield creatures
   - Survivors stage: players respond
5. Game ends when horde life or survivors life reaches 0

## Important Notes

- Double-faced cards: Random face selected during deck generation
- Tokens don't count toward horde life when marked as `isExtraToken`
- Sorceries/Instants must be removed from battlefield before ending horde turn (enforced by `hasSorceryOrInstantOnBattlefield` check)
- All card IDs use `crypto.randomUUID()` for unique tracking
- UI built with Flowbite-Svelte components + TailwindCSS 4 + @iconify/svelte for icons (Material Design Icons set)

## Design System

### Theme & Palette

Dark-mode-first gaming interface. The HTML root has `class="dark"` permanently.

- **Background**: Near-black `#0a0a0f` with subtle purple/blue radial gradients for atmosphere
- **Surfaces**: Semi-transparent whites (`rgba(255,255,255,0.06–0.15)`) with `backdrop-filter: blur(8px)` (glassmorphism)
- **Primary action color**: `cornflowerblue` — used for all primary buttons and interactive highlights
- **Text**: White at varying opacities (1.0 primary, 0.6 secondary, 0.35 muted)
- **Card type glow colors**: Sorcery `#e879f9` (magenta), Instant `#60a5fa` (blue), Enchantment `#4ade80` (green)
- **Semantic colors**: Damage/destructive `#ef4444`, Victory `#fbbf24`
- **Primary palette** (Tailwind theme in `app.css`): Blue-violet scale from `#eef2ff` to `#1e2548`

### Styling Conventions

- Scoped `<style>` blocks per component; global theme in `src/app.css`
- Prefer opacity layering over hard borders for depth (e.g. `rgba(255,255,255,0.15)` borders)
- Interactive states: `filter: brightness(1.15)` on hover, `transition: 0.2s`
- Disabled state: `opacity: 0.35` + `pointer-events: none`
- Labels: `text-transform: uppercase` + `letter-spacing: 0.5–2px` + `font-weight: 500–600`
- Border radius: `8px` for components, `50%` for dots/icons

### Layout

- Main layout: CSS Grid with `grid-template-columns: max-content 1fr` (side panel + main content)
- Side panel: Vertical flex column with glassmorphism background
- Battlefield: Responsive card grid (columns adapt to card count, 1–8 cols)
- Animations: Svelte `fly`/`scale` transitions + CSS keyframes for game events (flash, shake, pulse)
