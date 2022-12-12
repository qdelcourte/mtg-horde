import decks from 'decks';
import moves, {
  computeDefaultSurvivorsLife,
  computeHordeLife,
  loadDeck
} from './gameHelpers';


export const MTGHorde = {
  name: 'mtg-horde',

  setup: (ctx) => {
    let defaultDeckName = Object.keys(decks)[0];

    return {
      hordeDeckName: defaultDeckName,
      hordeDeck: [],
      hordeBattlefield: [],
      hordeGraveyard: [],
      hordeLife: 0,
      nbInitialSurvivorsTurn: 3,
      currentInitialSurvivorTurn: 0,
      nbSurvivors: 1,
      survivorsLife: 0,
      tokenProportion: 0.5
    };
  },

  moves: {
    startGame: (G, ctx, { nbSurvivors, deckName, nbInitialSurvivorsTurn, tokenProportion }) => {
      G.nbSurvivors = nbSurvivors;
      G.nbInitialSurvivorsTurn = nbInitialSurvivorsTurn;
      G.survivorsLife = computeDefaultSurvivorsLife(G.nbSurvivors);
      G.tokenProportion = tokenProportion;

      G.hordeDeckName = deckName;
      G.hordeDeck = loadDeck(deckName, G.nbSurvivors, G.tokenProportion);
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
      onBegin: (G) => {
        G.isPhaseBeginning = true;
      },

      moves: {
        ...moves,
        // Stages moves
        stageHordeUntap: (G, ctx) => {
          moves.hordeUntapAllCards(G, ctx);
          ctx.events.setActivePlayers({ currentPlayer: 'draw' });
        },
        stageHordeDraw: (G, ctx) => {
          moves.hordeDrawCards(G, ctx);
          ctx.events.setActivePlayers({ currentPlayer: 'upkeek' });
        },
        stageHordeDeclareAttack: (G, ctx) => {
          moves.hordeTapAllCards(G, ctx);
          ctx.events.setActivePlayers({ currentPlayer: 'attack' });
        },
        stageHordeAttackEnd: (G, ctx) => {
          ctx.events.endTurn();
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
        activePlayers: { currentPlayer: 'untap' },
        onBegin: (G, ctx) => {
          if (G.isPhaseBeginning) {
            ctx.events.setActivePlayers({ currentPlayer: 'draw'});
            G.isPhaseBeginning = false;
          }
        },
        stages: {
          untap: {},
          draw: {},
          upkeek: {},
          attack: {}
        }
      },
    }
  },

  endIf: (G, ctx) => {
    if (ctx.phase === 'fightTheHorde') {
      if (G.hordeLife <= 0) {
        return { winner: 'Survivors win !' };
      } else if (G.survivorsLife <= 0) {
        return { winner: 'Horde wins !' };
      }
    }
  },
};