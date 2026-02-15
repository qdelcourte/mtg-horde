import {
	clearCardState,
	generateCardRandomId,
	hasSorceryOrInstantOnBattlefield,
	INVALID_MOVE,
	isEnchantmentCard,
	isInstantCard,
	isSorceryCard,
	isTokenCard
} from './helpers';

export const PHASES = {
	initialSurvivorsTurns: 'initialSurvivorsTurns',
	fightTheHorde: 'fightTheHorde'
};

export const STAGES = {
	draw: 'draw',
	attack: 'attack'
};

function guardIndex(index) {
	if (index < 0) return INVALID_MOVE;
}

const moves = {
	hordeDrawCards: (G) => {
		// Draw cards in horde deck until the first token
		const { deck, battlefield } = G.state.horde;
		const indexOfFirstNonToken = deck.findIndex((card) => !isTokenCard(card));
		if (indexOfFirstNonToken === -1) {
			G.state.horde.deck = [];
			G.state.horde.battlefield = battlefield.concat(deck);
		} else {
			G.state.horde.deck = deck.slice(indexOfFirstNonToken + 1);
			G.state.horde.battlefield = battlefield.concat(deck.slice(0, indexOfFirstNonToken + 1));
		}
	},
	hordeToggleTapAllCards: (G, tapped = true) => {
		G.state.horde.battlefield = G.state.horde.battlefield.map((card) => {
			if (isInstantCard(card) || isSorceryCard(card) || isEnchantmentCard(card)) {
				return card;
			}
			return { ...card, tapped };
		});
	},
	hordeToggleTapCard: (G, index) => {
		const guard = guardIndex(index);
		if (guard) return guard;

		const card = G.state.horde.battlefield[index];
		card.tapped = !card.tapped;
	},
	addTokenInHordeBattlefield: (G, card, power, toughness) => {
		G.state.horde.battlefield.push({
			...card,
			power,
			toughness,
			isExtraToken: true,
			uid: generateCardRandomId()
		});
	},
	putCardsInHordeGraveyardFromDeck: (G, n) => {
		if (n <= 0) return INVALID_MOVE;

		const { horde } = G.state;
		const deck = horde.deck;
		horde.deck = deck.slice(n);
		horde.graveyard = horde.graveyard.concat(
			deck
				.slice(0, n)
				.filter((card) => !isTokenCard(card))
				.map(clearCardState)
		);
	},
	putCardInHordeGraveyardFromBattlefield: (G, index) => {
		const guard = guardIndex(index);
		if (guard) return guard;

		const { horde } = G.state;
		horde.battlefield[index] = clearCardState(horde.battlefield[index]);
		horde.graveyard = horde.graveyard.concat(
			horde.battlefield.splice(index, 1).filter((card) => !isTokenCard(card))
		);
	},
	putCardInHordeDeckFromBattlefield: (G, index) => {
		const guard = guardIndex(index);
		if (guard) return guard;

		const { horde } = G.state;
		horde.battlefield[index] = clearCardState(horde.battlefield[index]);
		horde.deck.push(horde.battlefield.splice(index, 1)[0]);
	},
	putCardInHordeExileFromBattlefield: (G, index) => {
		const guard = guardIndex(index);
		if (guard) return guard;

		G.state.horde.battlefield.splice(index, 1);
	},
	putCardInHordeDeckFromGraveyard: (G, index, top = true) => {
		const guard = guardIndex(index);
		if (guard) return guard;

		const { horde } = G.state;
		const card = horde.graveyard.splice(index, 1)[0];
		if (top) {
			horde.deck.unshift(card);
		} else {
			horde.deck.push(card);
		}
	},
	putCardInHordeBattlefieldFromGraveyard: (G, index, tapped = false) => {
		const guard = guardIndex(index);
		if (guard) return guard;

		const { horde } = G.state;
		const card = horde.graveyard.splice(index, 1)[0];
		horde.battlefield.push({ ...card, tapped });
	},
	putCardInHordeExileFromGraveyard: (G, index) => {
		const guard = guardIndex(index);
		if (guard) return guard;

		G.state.horde.graveyard.splice(index, 1);
	},
	changeCardMarkerCounter: (G, index, powerMarker, toughnessMarker) => {
		const guard = guardIndex(index);
		if (guard) return guard;

		const card = G.state.horde.battlefield[index];
		G.state.horde.battlefield[index] = {
			...card,
			powerMarker: (card?.powerMarker || 0) + powerMarker,
			toughnessMarker: (card?.toughnessMarker || 0) + toughnessMarker
		};
	},
	survivorsChangeLife: (G, n) => {
		G.state.survivors.life += n;
	}
};

export const PHASES_CONFIG = {
	[PHASES.initialSurvivorsTurns]: {
		next: PHASES.fightTheHorde,

		moves: {
			nextInitialTurn: (G) => G.state.turn.currentInitialSurvivorTurn++
		},

		endIf: (G) => G.state.turn.currentInitialSurvivorTurn > G.state.config.nbInitialSurvivorsTurn
	},
	[PHASES.fightTheHorde]: {
		stages: { ...STAGES, initial: STAGES.draw },

		moves: {
			...moves,
			// Stages moves
			stageHordeDraw: (G) => {
				G.state.turn.current++;
				moves.hordeDrawCards(G);
				G.setCurrentPlayerStage(STAGES.attack);
			},
			stageHordeAttackEnd: (G) => {
				if (hasSorceryOrInstantOnBattlefield(G)) {
					// TODO: UI responsability to display this error
					alert(`Please remove sorcery and instant from the horde battlefield`);
					return INVALID_MOVE;
				}
				G.endTurn();
			},
			stageSurvivorsEndTurn: (G) => {
				G.endTurn();
				G.setCurrentPlayerStage(STAGES.draw);
			}
		}
	}
};
