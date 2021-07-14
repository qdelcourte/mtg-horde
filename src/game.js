import { INVALID_MOVE } from 'boardgame.io/core';
import decks from 'decks';


function computeNbCardsMaxInHordeDeck(nbSurvivors) {
  switch(nbSurvivors) {
    case 1:
      return 45;
    case 2:
      return 60;
    case 3:
      return 75;
    case 4:
      return 100;
    default:
      return Infinity;
  }
}

function loadDeck(ctx, nbSurvivors, deckName) {
  // Build deck
  let deck = [];
  decks[deckName].forEach(card => {
    deck = deck.concat(Array(card.qty).fill(card.card));
  });

  // Shuffle and slice
  return deck.sort(function () { return 0.5 - Math.random() }).slice(0, Math.min(computeNbCardsMaxInHordeDeck(nbSurvivors), deck.length));
}

function computeHordeLife(G) {
  return G.hordeDeck.length + G.hordeBattlefield.filter(card => !card.is_extra_token).length;
}

function computeDefaultSurvivorsLife(nbSurvivors) {
  return nbSurvivors * 20;
}

export function isTokenCard(card) {
  return card.layout === "token";
}

export function isSorceryCard(card) {
  return card.type === 'Sorcery';
}

export function isInstantCard(card) {
  return card.type === 'Instant';
}

export function isEnchantmentCard(card) {
  return card.type === 'Enchantment';
}

function clearCardState(card) {
  card.tapped = false;
  card.powerMarker = 0;
  card.toughnessMarker = 0;

  return card;
}

function hordeDrawCards(G, ctx) {
  // Draw cards in horde deck until the first token
  let deck = JSON.parse(JSON.stringify(G.hordeDeck));
  const indexOfFirstNonToken = deck.findIndex(card => !isTokenCard(card));
  if (indexOfFirstNonToken === -1) {
    G.hordeDeck = [];
    G.hordeBattlefield = JSON.parse(JSON.stringify(G.hordeBattlefield)).concat(deck);
  } else {
    G.hordeDeck = deck.slice(indexOfFirstNonToken+1);
    G.hordeBattlefield = JSON.parse(JSON.stringify(G.hordeBattlefield)).concat(deck.slice(0, indexOfFirstNonToken+1));
  }
  G.hordeLife = computeHordeLife(G);
}

function hordeUntapAllCards(G, ctx) {
  let battlefield = JSON.parse(JSON.stringify(G.hordeBattlefield));
  G.hordeBattlefield = battlefield.map(card => {
    card.tapped = false;
    return card;
  });
}

function hordeTapAllCards(G, ctx) {
  let battlefield = JSON.parse(JSON.stringify(G.hordeBattlefield));
  G.hordeBattlefield = battlefield.map(card => {
    if (isInstantCard(card) || isSorceryCard(card) || isEnchantmentCard(card)) {
      return card;
    }
    card.tapped = true;
    return card;
  });
}

function addTokenInHordeBattlefield(G, ctx, card, power, toughness) {
  let battlefield = JSON.parse(JSON.stringify(G.hordeBattlefield));

  card = Object.assign({}, card);
  card.power = power;
  card.toughness = toughness;
  card.is_extra_token = true;

  battlefield.push(card);
  G.hordeBattlefield = battlefield;
  G.hordeLife = computeHordeLife(G);
}

function putCardsInHordeGraveyardFromDeck(G, ctx, n) {
  if (n <= 0) return INVALID_MOVE;

  // Put first N cards in the graveyard from the top of the library
  let deck = JSON.parse(JSON.stringify(G.hordeDeck));
  G.hordeDeck = deck.slice(n);
  G.hordeGraveyard = JSON.parse(JSON.stringify(G.hordeGraveyard)).concat(deck.slice(0, n).filter(card => !isTokenCard(card)).map(card => clearCardState(card)));
  G.hordeLife = computeHordeLife(G);
}

function putCardInHordeGraveyardFromBattlefield(G, ctx, index) {
  if (index < 0) return INVALID_MOVE;

  let battlefield = JSON.parse(JSON.stringify(G.hordeBattlefield));
  battlefield[index] = clearCardState(battlefield[index]);
  G.hordeGraveyard = JSON.parse(JSON.stringify(G.hordeGraveyard)).concat(battlefield.splice(index, 1).filter(card => !isTokenCard(card)));
  G.hordeBattlefield = battlefield;
  G.hordeLife = computeHordeLife(G);
}

function putCardInHordeDeckFromBattlefield(G, ctx, index) {
  if (index < 0) return INVALID_MOVE;

  let battlefield = JSON.parse(JSON.stringify(G.hordeBattlefield));
  battlefield[index] = clearCardState(battlefield[index]);
  G.hordeDeck = battlefield.splice(index, 1).concat(JSON.parse(JSON.stringify(G.hordeDeck)));
  G.hordeBattlefield = battlefield;
  G.hordeLife = computeHordeLife(G);
}

function putCardInHordeExileFromBattlefield(G, ctx, index) {
  if (index < 0) return INVALID_MOVE;

  let battlefield = JSON.parse(JSON.stringify(G.hordeBattlefield));
  battlefield[index] = clearCardState(battlefield[index]);
  battlefield.splice(index, 1);
  G.hordeBattlefield = battlefield;
  G.hordeLife = computeHordeLife(G);
}

function putCardInHordeDeckFromGraveyard(G, ctx, index, top=true) {
  if (index < 0) return INVALID_MOVE;

  let graveyard = JSON.parse(JSON.stringify(G.hordeGraveyard));
  let card = graveyard.splice(index, 1)[0];
  let deck = JSON.parse(JSON.stringify(G.hordeDeck));
  if (top) {
    deck.unshift(card);
  } else {
    deck.push(card);
  }
  G.hordeDeck = deck;
  G.hordeGraveyard = graveyard;
  G.hordeLife = computeHordeLife(G);
}

function putCardInHordeBattefieldFromGraveyard(G, ctx, index, tapped=false) {
  if (index < 0) return INVALID_MOVE;

  let graveyard = JSON.parse(JSON.stringify(G.hordeGraveyard));
  let card = graveyard.splice(index, 1)[0];
  if (tapped) {
    card.tapped = true;
  }
  let battlefield = JSON.parse(JSON.stringify(G.hordeBattlefield));
  battlefield.push(card)
  G.hordeBattlefield = battlefield;
  G.hordeGraveyard = graveyard;
  G.hordeLife = computeHordeLife(G);
}

function putCardInHordeExileFromGraveyard(G, ctx, index) {
  if (index < 0) return INVALID_MOVE;

  let graveyard = JSON.parse(JSON.stringify(G.hordeGraveyard));
  graveyard.splice(index, 1)[0];
  G.hordeGraveyard = graveyard;
  G.hordeLife = computeHordeLife(G);
}

function changeCardPowerCounter(G, ctx, index, nbPower) {
  if (index < 0) return INVALID_MOVE;

  let battlefield = JSON.parse(JSON.stringify(G.hordeBattlefield));
  if (!battlefield[index].hasOwnProperty('powerMarker')) {
    battlefield[index].powerMarker = 0;
  }
  battlefield[index].powerMarker += nbPower;
  G.hordeBattlefield = battlefield;
}

function changeCardToughnessCounter(G, ctx, index, nbToughness) {
  if (index < 0) return INVALID_MOVE;

  let battlefield = JSON.parse(JSON.stringify(G.hordeBattlefield));
  if (!battlefield[index].hasOwnProperty('toughnessMarker')) {
    battlefield[index].toughnessMarker = 0;
  }
  battlefield[index].toughnessMarker += nbToughness;
  G.hordeBattlefield = battlefield;
}

function changeCardMarkerCounter(G, ctx, index, nbMarker) {
  if (index < 0) return INVALID_MOVE;

  let battlefield = JSON.parse(JSON.stringify(G.hordeBattlefield));
  if (!battlefield[index].hasOwnProperty('powerMarker')) {
    battlefield[index].powerMarker = 0;
  }
  if (!battlefield[index].hasOwnProperty('toughnessMarker')) {
    battlefield[index].toughnessMarker = 0;
  }
  battlefield[index].powerMarker += nbMarker;
  battlefield[index].toughnessMarker += nbMarker;
  G.hordeBattlefield = battlefield;
}

export const MTGHorde = {
  name: 'mtg-horde',

  setup: (ctx, setupData) => {
    let defaultNbSurvivors = 1;
    let defaultDeckName = Object.keys(decks)[0];
    let defaultDeck = loadDeck(ctx, defaultNbSurvivors, defaultDeckName);

    return { 
      tokenProportion: 50,
      hordeDeckName: defaultDeckName,
      hordeDeck: defaultDeck,
      hordeBattlefield: [],
      hordeGraveyard: [],
      hordeLife: defaultDeck.length,
      nbInitialSurvivorsTurn: 3,
      currentInitialSurvivorTurn: 0,
      nbSurvivors: defaultNbSurvivors,
      survivorsLife: computeDefaultSurvivorsLife(defaultNbSurvivors)
    };
  },

  moves: {
    startGame: (G, ctx, {nbSurvivors, deckName, nbInitialSurvivorsTurn}) => {
      G.nbSurvivors = nbSurvivors;
      G.nbInitialSurvivorsTurn = nbInitialSurvivorsTurn;
      G.survivorsLife = computeDefaultSurvivorsLife(G.nbSurvivors);

      G.hordeDeckName = deckName;
      G.hordeDeck = loadDeck(ctx, G.nbSurvivors, deckName);
      G.hordeBattlefield = [];
      G.hordeGraveyard = [];
      G.hordeLife = computeHordeLife(G);
      
      ctx.events.setPhase('initialSurvivorsTurns');
    }
  },

  phases: {
    initialSurvivorsTurns: {
      next: 'fightTheHorde',
      
      moves: {
        nextInitialTurn: (G, ctx) => {
          G.currentInitialSurvivorTurn++;
        }
      },

      endIf: (G, ctx) => {
        return G.currentInitialSurvivorTurn >= G.nbInitialSurvivorsTurn;
      },
    },
    fightTheHorde: {
      moves: { 
        hordeDrawCards: hordeDrawCards,
        hordeUntapAllCards: hordeUntapAllCards,
        hordeTapAllCards: hordeTapAllCards,
        addTokenInHordeBattlefield: addTokenInHordeBattlefield,
        putCardsInHordeGraveyardFromDeck: putCardsInHordeGraveyardFromDeck,
        putCardInHordeGraveyardFromBattlefield: putCardInHordeGraveyardFromBattlefield,
        putCardInHordeDeckFromBattlefield: putCardInHordeDeckFromBattlefield,
        putCardInHordeExileFromBattlefield: putCardInHordeExileFromBattlefield,
        putCardInHordeDeckFromGraveyard: putCardInHordeDeckFromGraveyard,
        putCardInHordeBattefieldFromGraveyard: putCardInHordeBattefieldFromGraveyard,
        putCardInHordeExileFromGraveyard: putCardInHordeExileFromGraveyard,
        hordeToggleTapCard: (G, ctx, index) => {
          if (index < 0) return INVALID_MOVE;

          // Tap or untap card from the battlefield
          let battlefield = JSON.parse(JSON.stringify(G.hordeBattlefield));
          battlefield[index].tapped = battlefield[index].hasOwnProperty('tapped') ? !battlefield[index].tapped : true;
          G.hordeBattlefield = battlefield;
        },
        changeCardPowerCounter: changeCardPowerCounter,
        changeCardToughnessCounter: changeCardToughnessCounter,
        changeCardMarkerCounter: changeCardMarkerCounter,
        hordeLosesLife: (G, ctx, n) => {
          if (n <= 0) return INVALID_MOVE;

          // Horde loses N life points
          // put that many cards from the top of its deck into its graveyard.
          putCardsInHordeGraveyardFromDeck(G, ctx, n);
        },
        survivorsLoseLife: (G, ctx, n) => {
          if (n <= 0) return INVALID_MOVE;

          G.survivorsLife -= n;
        },
        survivorsGainLife: (G, ctx, n) => {
          if (n <= 0) return INVALID_MOVE;

          G.survivorsLife += n;
        },
        // Stages moves
        stageHordeUntap: (G, ctx) => {
          hordeUntapAllCards(G, ctx);
          ctx.events.setActivePlayers({ currentPlayer: 'draw' });
        },
        stageHordeDraw: (G, ctx) => {
          hordeDrawCards(G, ctx);
          ctx.events.setActivePlayers({ currentPlayer: 'upkeek' });
        },
        stageHordeDeclareAttack: (G, ctx) => {
          hordeTapAllCards(G, ctx);
          ctx.events.setActivePlayers({ currentPlayer: 'attack' });
        },
        stageHordeAttackEnd: (G, ctx) => {
          ctx.events.endTurn();
          ctx.events.setActivePlayers({ currentPlayer: 'survivorsTurn' });
        },
        stageSurvivorsEndTurn: (G, ctx) => {
          ctx.events.endTurn();
          if (G.hordeBattlefield.length > 0) {
            ctx.events.setActivePlayers({ currentPlayer: 'untap' });
          } else {
            ctx.events.setActivePlayers({ currentPlayer: 'draw' });
          }
        }
      },

      turn: {
        stages: {
          untap: {},
          draw: {},
          upkeek: {},
          attack: {},
          survivorsTurn: {}
        }
      },

      onBegin: (G, ctx) => {
        ctx.events.setActivePlayers({ currentPlayer: 'draw' });
      },
    }
  },

  endIf: (G, ctx) => {
    if (G.hordeLife <= 0) {
      return { winner: 'Survivors win !'};
    } else if (G.survivorsLife <= 0) {
      return { winner: 'Horde win !'};
    }
  },
};