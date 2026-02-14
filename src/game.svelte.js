import { Client } from 'boardgame.io/client';
import { INVALID_MOVE } from 'boardgame.io/core';
import decks from 'decks';

import moves, * as helpers from './gameHelpers';

const [STAGES, PHASES] = [helpers.STAGES, helpers.PHASES];

const MTGHorde = {
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
			tokenProportion: 0.6
		};
	},

	moves: {
		startGame: (
			{ G, events },
			{ nbSurvivors, deckName, nbInitialSurvivorsTurn, tokenProportion }
		) => {
			G.nbSurvivors = nbSurvivors;
			G.nbInitialSurvivorsTurn = nbInitialSurvivorsTurn;
			G.survivorsLife = helpers.computeDefaultSurvivorsLife(G.nbSurvivors);
			G.tokenProportion = tokenProportion;

			G.hordeDeckName = deckName;
			G.hordeDeck = helpers.loadDeck(decks[deckName], {
				nbSurvivors: G.nbSurvivors,
				tokenPercentage: G.tokenProportion
			});
			G.hordeBattlefield = [];
			G.hordeGraveyard = [];
			G.hordeLife = helpers.computeHordeLife(G);
			G.currentTurn = 0;

			events.setPhase(PHASES.initialSurvivorsTurns);
		}
	},

	phases: {
		[PHASES.initialSurvivorsTurns]: {
			next: PHASES.fightTheHorde,

			moves: {
				nextInitialTurn: ({ G }) => {
					G.currentInitialSurvivorTurn++;
				}
			},

			endIf: ({ G }) => {
				return G.currentInitialSurvivorTurn >= G.nbInitialSurvivorsTurn;
			}
		},
		[PHASES.fightTheHorde]: {
			moves: {
				...moves,
				// Stages moves
				stageHordeDraw: ({ G, events }) => {
					G.currentTurn++;
					moves.hordeDrawCards({ G });
					events.setActivePlayers({ currentPlayer: STAGES.attack });
				},
				stageHordeAttackEnd: ({ G, events }) => {
					if (helpers.haveSorceryNorInstantOnBattelfield(G)) {
						alert(`Please remove sorcery and instant from the horde battlefield`);
						return INVALID_MOVE;
					}
					events.endTurn();
				},
				stageSurvivorsEndTurn: ({ events }) => {
					events.endTurn();
					events.setActivePlayers({ currentPlayer: STAGES.draw });
				}
			},

			turn: {
				activePlayers: { currentPlayer: STAGES.draw },
				stages: {
					[STAGES.draw]: {},
					[STAGES.attack]: {}
				}
			}
		}
	},

	endIf: ({ G, ctx }) => {
		if (ctx.phase === PHASES.fightTheHorde) {
			if (G.hordeLife <= 0) {
				return { winner: 'Survivors win !' };
			} else if (G.survivorsLife <= 0) {
				return { winner: 'Horde wins !' };
			}
		}
	}
};

function createGame(options) {
	let state = $state();
	let client = Client(options);
	client.subscribe((newState) => (state = newState));

	return {
		get state() {
			return state;
		},
		client,
		helpers
	};
}

const game = createGame({ game: MTGHorde, numPlayers: 2, debug: { collapseOnLoad: true } });

export { game };
