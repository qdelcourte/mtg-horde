import { Client } from 'boardgame.io/client';
import { INVALID_MOVE } from 'boardgame.io/core';
import moves, * as helpers from './gameHelpers';
import decks from 'decks';

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
			onBegin: ({ G }) => {
				G.isPhaseBeginning = true;
			},

			moves: {
				...moves,
				// Stages moves
				stageHordeUntap: ({ G, events }) => {
					moves.hordeToggleTapAllCards({ G }, false);
					events.setActivePlayers({ currentPlayer: STAGES.draw });
				},
				stageHordeDraw: ({ G, events }) => {
					moves.hordeDrawCards({ G });
					events.setActivePlayers({ currentPlayer: STAGES.upkeek });
				},
				stageHordeDeclareAttack: ({ G, events }) => {
					moves.hordeToggleTapAllCards({ G }, true);
					events.setActivePlayers({ currentPlayer: STAGES.attack });
				},
				stageHordeAttackEnd: ({ G, events }) => {
					if (helpers.haveSorceryNorInstantOnBattelfield(G)) {
						alert(`Please remove sorcery and instant from the horde battlefield`);
						return INVALID_MOVE;
					}
					events.endTurn();
				},
				stageSurvivorsEndTurn: ({ G, events }) => {
					events.endTurn();
					if (G.hordeBattlefield.length > 0) {
						events.setActivePlayers({ currentPlayer: STAGES.untap });
					} else {
						events.setActivePlayers({ currentPlayer: STAGES.draw });
					}
				}
			},

			turn: {
				activePlayers: { currentPlayer: STAGES.untap },
				onBegin: ({ G, events }) => {
					if (G.isPhaseBeginning) {
						events.setActivePlayers({ currentPlayer: STAGES.draw });
						G.isPhaseBeginning = false;
					}
				},
				stages: {
					[STAGES.untap]: {},
					[STAGES.draw]: {},
					[STAGES.upkeek]: {},
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
