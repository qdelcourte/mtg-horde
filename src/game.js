import decks from 'decks';
import moves, {
  computeDefaultSurvivorsLife,
  computeHordeLife,
  loadDeck
} from './gameHelpers';


export const MTGHorde = {
  name: 'mtg-horde',

  setup: () => {
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
    startGame: ({G, events}, { nbSurvivors, deckName, nbInitialSurvivorsTurn, tokenProportion }) => {
      G.nbSurvivors = nbSurvivors;
      G.nbInitialSurvivorsTurn = nbInitialSurvivorsTurn;
      G.survivorsLife = computeDefaultSurvivorsLife(G.nbSurvivors);
      G.tokenProportion = tokenProportion;

      G.hordeDeckName = deckName;
      G.hordeDeck = loadDeck(deckName, G.nbSurvivors, G.tokenProportion);
      G.hordeBattlefield = [];
      G.hordeGraveyard = [];
      G.hordeLife = computeHordeLife(G);

      events.setPhase('initialSurvivorsTurns');
    }
  },

  phases: {
    initialSurvivorsTurns: {
      next: 'fightTheHorde',

      moves: {
        nextInitialTurn: ({G}) => {
          G.currentInitialSurvivorTurn++;
        }
      },

      endIf: ({G}) => {
        return G.currentInitialSurvivorTurn >= G.nbInitialSurvivorsTurn;
      },
    },
    fightTheHorde: {
      onBegin: ({G}) => {
        G.isPhaseBeginning = true;
      },

      moves: {
        ...moves,
        // Stages moves
        stageHordeUntap: ({G, events}) => {
          moves.hordeUntapAllCards({G});
          events.setActivePlayers({ currentPlayer: 'draw' });
        },
        stageHordeDraw: ({G, events}) => {
          moves.hordeDrawCards({G});
          events.setActivePlayers({ currentPlayer: 'upkeek' });
        },
        stageHordeDeclareAttack: ({G, events}) => {
          moves.hordeTapAllCards({G});
          events.setActivePlayers({ currentPlayer: 'attack' });
        },
        stageHordeAttackEnd: ({events}) => {
          events.endTurn();
        },
        stageSurvivorsEndTurn: ({G, events}) => {
          events.endTurn();
          if (G.hordeBattlefield.length > 0) {
            events.setActivePlayers({ currentPlayer: 'untap' });
          } else {
            events.setActivePlayers({ currentPlayer: 'draw' });
          }
        }
      },

      turn: {
        activePlayers: { currentPlayer: 'untap' },
        onBegin: ({G, events}) => {
          if (G.isPhaseBeginning) {
            events.setActivePlayers({ currentPlayer: 'draw'});
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

  endIf: ({G, ctx}) => {
    if (ctx.phase === 'fightTheHorde') {
      if (G.hordeLife <= 0) {
        return { winner: 'Survivors win !' };
      } else if (G.survivorsLife <= 0) {
        return { winner: 'Horde wins !' };
      }
    }
  },
};