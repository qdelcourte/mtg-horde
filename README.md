<p align="center">
  <img src="src/assets/logo.svg" alt="MTG Horde" width="600" />
</p>

<p align="center">
  <a href="https://app.netlify.com/sites/mtg-horde/deploys"><img src="https://api.netlify.com/api/v1/badges/c6818713-2f34-43d2-8261-c57a9268cea5/deploy-status" alt="Netlify Status" /></a>
</p>

A cooperative Magic: The Gathering variant where players fight together against an automated "horde" deck. Built with [Svelte 5](https://svelte.dev/), [TailwindCSS](https://tailwindcss.com/) and [Flowbite](https://flowbite-svelte.com/).

Inspired from [mtg-horde](https://github.com/dkniffin/mtg-horde) by dkniffin.

[Play!](https://mtg-horde.netlify.app/)

## Features

- Included horde decks ready to play
- Manage score and life totals
- Tap/Untap cards
- Add/Remove markers on cards
- Move cards between zones (battlefield, graveyard, library, exile)
- Browse the horde graveyard
- Add extra tokens onto the battlefield
- Undo/Redo actions
- Savepoint system (save/restore in browser)
- Explore distribution/shuffle methods on the [stats page](https://mtg-horde.netlify.app/#distribution)

## Rules

No official rules, so work in progress...

You can contribute and do some proposals by creating an issue.

Current rules: [RULES.md](./RULES.md)

Resources:

- https://tappedout.net/mtg-decks/zombie-horde-co-op-magic
- https://github.com/dkniffin/mtg-horde
- https://magic-casual.fr/pour-la-horde (FR)

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build & preview
npm run build
npm run preview
```

### Import a new horde deck

```bash
cd decks/
node import-deck.js filename.txt
```

Then export the generated JSON file in `decks/index.js`.
