<p align="center">
  <img src="src/assets/logo.svg" alt="MTG Horde" width="600" />
</p>

<p align="center">
  <a href="https://app.netlify.com/sites/mtg-horde/deploys"><img src="https://api.netlify.com/api/v1/badges/c6818713-2f34-43d2-8261-c57a9268cea5/deploy-status" alt="Netlify Status" /></a>
</p>

[Play!](https://mtg-horde.netlify.app/)

Built with [Svelte](https://github.com/sveltejs/svelte)

Inspired from https://github.com/dkniffin/mtg-horde

You can explore distribution/shuffle methods [here](https://mtg-horde.netlify.app/#distribution).

## Features

- Add/Remove marker to a card
- Tap/Untap a card
- See the horde graveyard
- Remove a card from the battlefield to the graveyard or the top library
- Remove a card from the graveyard to the battlefield or the top library or the exile
- Exile a card from the battlefield or the top library or the graveyard
- Add token onto the battlefield
- Included decks
- Manage score
- Start/Restart game
- Undo/Redo actions
- Savepoint (save in browser)

## Rules

No official rules, so work in progress...

You can contribute and do some proposals by creating an issue.

Current rules: [RULES.md](./RULES.md)

Resources:

- https://tappedout.net/mtg-decks/zombie-horde-co-op-magic
- https://github.com/dkniffin/mtg-horde
- https://magic-casual.fr/pour-la-horde (FR)

## Run dev

    npm install
    npm run dev

## Import new horde in local

    cd decks/
    node import-deck.js filename.txt

Then in `decks/index.js`, export the generated json file.

## Run prod

    npm install
    npm run build
    npm run preview
