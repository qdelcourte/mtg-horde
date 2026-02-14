import { INVALID_MOVE } from 'boardgame.io/core';
import { current } from 'immer';
import { Rarity } from 'scryfall-sdk';

/**
 * Load and generate Horde's deck
 *
 * @param {Array} deck
 * @param {Object} options - Configuration options
 * @param {'geometric'|'geometric_boosted'|'random'} options.distributionMode - Specify the token distribution method in deck
 * @returns {Array}
 */
export function loadDeck(deck, options) {
	switch (options.distributionMode ?? 'geometric_boosted') {
		case 'geometric':
			return geometricDistributionHordeDeck(deck, options);
		case 'geometric_boosted':
			return geometricDistributionHordeDeck(deck, { ...options, limitSuccessiveTokenDraw: true });
		case 'random':
			return randomDistributionHordeDeck(deck, options);
		default:
			throw Error(`Distribution mode is not supported`);
	}
}

/**
 * Load and generate Horde's deck
 *
 * Try to distribute evenly tokens in deck following the target proportion.
 * Apply an opinioned geometric distribution
 *
 * @param {Array} deck
 * @returns {Array}
 */
function geometricDistributionHordeDeck(deck, options) {
	// Limit successive token draw, can grow during distribution (default: no limit)
	const {
		nbSurvivors,
		tokenPercentage,
		limitSuccessiveTokenDraw = false,
		shuffleBiasFactor = null
	} = options;

	const totalCards = getNbCardsFromNbSurvivors(nbSurvivors);
	const numberOfTokens = Math.round(totalCards * tokenPercentage);

	// Create the list of tokens - keep the token's proportion
	const tokenCards = deck.filter((card) => isTokenCard(card.card));
	const totalTokens = tokenCards.reduce((acc, card) => acc + card.qty, 0);
	const tokens = tokenCards.flatMap((card) =>
		Array.from({ length: Math.floor((card.qty / totalTokens) * numberOfTokens) }, () =>
			getCardFace(card.card)
		)
	);

	// Create the list of non-tokens
	const nonTokens = deck.flatMap((card) =>
		!isTokenCard(card.card) ? Array.from({ length: card.qty }, () => getCardFace(card.card)) : []
	);

	// Shuffle token and non-token lists
	const shuffledTokens = shuffle(tokens, shuffleBiasFactor);
	const shuffledNonTokens = shuffle(nonTokens, shuffleBiasFactor);

	// Apply geometric distribution to assign tokens progressively
	//   - Consider being able to draw a token from the first draw
	//   - Consider that the maximum number of successive draws of a token increases according to the distribution
	const reducedDeck = [];
	let tokenIndex = 0;
	let nonTokenIndex = 0;

	let MAX_TOKEN_IN_A_ROW = limitSuccessiveTokenDraw ? 1 : Infinity;
	let nbTokenInARow = 0;

	for (let i = 0; i < totalCards; i++) {
		// Adjust the parameter (0.2) to control the steepness
		// Consider being able to draw a token from the first draw => i+1
		const probability = 1 - Math.exp(-0.2 * (i + 1));

		// Follow the distribution
		const shouldAddToken = Math.random() < probability;

		if (
			shouldAddToken &&
			tokenIndex < shuffledTokens.length &&
			nbTokenInARow + 1 <= MAX_TOKEN_IN_A_ROW
		) {
			reducedDeck.push(shuffledTokens[tokenIndex++]);
			nbTokenInARow++;
		} else if (nonTokenIndex < shuffledNonTokens.length) {
			reducedDeck.push(shuffledNonTokens[nonTokenIndex++]);
			nbTokenInARow = 0;
		}

		// Adjust the maximum number of successive token draws according to the distribution of non-tokens
		// And add 10% of probability to increase the limit
		if (!shouldAddToken && Math.random() < 0.1) {
			MAX_TOKEN_IN_A_ROW += 1;
		}
	}

	// Fill any remaining spots in case tokens or non-tokens are exhausted
	reducedDeck.push(...shuffledTokens.slice(tokenIndex, totalCards - reducedDeck.length));
	reducedDeck.push(...shuffledNonTokens.slice(nonTokenIndex, totalCards - reducedDeck.length));

	return reducedDeck;
}

/**
 * Load and generate Horde's deck (in the basic way)
 *
 * Distribute randomly tokens in deck following the target proportion.
 *
 * @param {Array} deck
 * @returns {Array}
 */
function randomDistributionHordeDeck(deck, options) {
	const { nbSurvivors, tokenPercentage, shuffleBiasFactor = null } = options;

	const expectedNbCardsInDeck = getNbCardsFromNbSurvivors(nbSurvivors);
	const expectedNbTokenCardsInDeck = Math.floor(expectedNbCardsInDeck * tokenPercentage);
	const expectedNbNonTokenCardsInDeck = expectedNbCardsInDeck - expectedNbTokenCardsInDeck;

	const tokenCards = deck.filter((card) => isTokenCard(card.card));
	const totalTokens = tokenCards.reduce((acc, card) => acc + card.qty, 0);

	// Prepare tokens
	const tokenDeck = tokenCards.flatMap((card) =>
		Array.from({ length: Math.floor((card.qty / totalTokens) * expectedNbTokenCardsInDeck) }, () =>
			getCardFace(card.card)
		)
	);

	// Prepare non tokens
	const nonTokenDeck = shuffle(
		deck.flatMap((card) =>
			!isTokenCard(card.card) ? Array.from({ length: card.qty }, () => getCardFace(card.card)) : []
		)
	);
	const restNonTokens = nonTokenDeck.splice(expectedNbNonTokenCardsInDeck);

	// Fill any remaining spots in case tokens or non-tokens are exhausted
	let reducedDeck = shuffle([...tokenDeck, ...nonTokenDeck]);
	while (reducedDeck.length < expectedNbCardsInDeck) {
		const card = restNonTokens.splice(Math.floor(Math.random() * restNonTokens.length), 1)[0];
		if (!card) break;
		reducedDeck.push(card);
	}

	// Return deck shuffled
	return shuffle(reducedDeck, shuffleBiasFactor);
}

function getNbCardsFromNbSurvivors(nbSurvivors) {
	return [NaN, 45, 60, 75, 100][nbSurvivors] || 100;
}

/**
 * Basic shuffle
 *
 * @param {Array} array
 * @param {number} biasFactor - Applying a bias shuffle if non null
 * @returns
 */
function shuffle(array, biasFactor = 0) {
	if (biasFactor) return biaisedShuffle(array, biasFactor);
	return array.sort(() => 0.5 - Math.random());
}

/**
 * Shuffle the array with a Fisher-Yates Shuffle
 *
 * @param {Array} array
 * @param {number} biasFactor - Applying a bias factor, 80% chance of pushing the element to the end of the array
 * @returns {Array}
 */
function biaisedShuffle(array, biasFactor = 0.8) {
	for (let i = array.length - 1; i > 0; i--) {
		// Apply a malus according to rarity + cmc => (rarity sort index * 1%) + 0.5% per mana_cost
		const rarityValue = Rarity[array[i].rarity] ?? 0;
		const cmcValue = array[i].cmc ?? 0;
		const biasMalus = rarityValue * 0.02 + (cmcValue * 0.5) / 100;

		const randomIndex =
			isLategameCard(array[i]) && Math.random() < biasFactor + biasMalus
				? Math.floor(Math.random() * (array.length - i) + i) // Biaised selection
				: Math.floor(Math.random() * (i + 1)); // Normal

		// Exchanging elements
		[array[i], array[randomIndex]] = [array[randomIndex], array[i]];
	}

	return array;
}

/**
 * If double faced card then choose a face at random
 *
 * @param {object} card
 * @returns
 */
function getCardFace(card) {
	const cardFace = isDoubleFacedCard(card)
		? card.card_faces[Math.floor(Math.random() * card.card_faces.length)]
		: {};

	return {
		...card,
		...cardFace,
		uid: generateCardRandomId()
	};
}

export function generateCardRandomId() {
	return crypto.randomUUID();
}

export function computeHordeLife(G) {
	return G.hordeDeck.length + G.hordeBattlefield.filter((card) => !card.isExtraToken).length;
}

export function computeDefaultSurvivorsLife(nbSurvivors) {
	return nbSurvivors * 20;
}

export function computeHordeDamage(G) {
	return G.hordeBattlefield.reduce((a, b) => a + (parseInt(b?.power) || 0), 0);
}

export function isDoubleFacedCard(card) {
	return card.layout.includes('double_faced');
}

export function isLategameCard(card) {
	return card?.custom_tags.includes('#lategame');
}

export function isTokenCard(card) {
	return card.layout.includes('token');
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

export function clearCardState(card) {
	return {
		...card,
		tapped: false,
		powerMarker: 0,
		toughnessMarker: 0,
		isExtraToken: false
	};
}

export function haveSorceryNorInstantOnBattelfield(G) {
	return G.hordeBattlefield.find((card) => isInstantCard(card) || isSorceryCard(card)) != undefined;
}

// Game phases
export const PHASES = {
	initialSurvivorsTurns: 'initialSurvivorsTurns',
	fightTheHorde: 'fightTheHorde'
};

// Game stages
export const STAGES = {
	draw: 'draw',
	attack: 'attack'
};

// Game Moves
export default {
	hordeDrawCards: ({ G }) => {
		// Draw cards in horde deck until the first token
		let deck = current(G.hordeDeck);
		const indexOfFirstNonToken = deck.findIndex((card) => !isTokenCard(card));
		let hordeBattlefield = current(G.hordeBattlefield);
		if (indexOfFirstNonToken === -1) {
			G.hordeDeck = [];
			G.hordeBattlefield = hordeBattlefield.concat(deck);
		} else {
			G.hordeDeck = deck.slice(indexOfFirstNonToken + 1);
			G.hordeBattlefield = hordeBattlefield.concat(deck.slice(0, indexOfFirstNonToken + 1));
		}
		G.hordeLife = computeHordeLife(G);
	},
	hordeToggleTapAllCards: ({ G }, tapped = true) => {
		G.hordeBattlefield = current(G.hordeBattlefield).map((card) => {
			if (isInstantCard(card) || isSorceryCard(card) || isEnchantmentCard(card)) {
				return card;
			}
			return { ...card, tapped };
		});
	},
	hordeToggleTapCard: ({ G }, index) => {
		if (index < 0) return INVALID_MOVE;

		// Tap or untap card from the battlefield
		let battlefield = [...current(G.hordeBattlefield)];
		battlefield[index] = { ...battlefield[index], tapped: !(battlefield[index].tapped ?? false) };
		G.hordeBattlefield = battlefield;
	},
	addTokenInHordeBattlefield: ({ G }, card, power, toughness) => {
		G.hordeBattlefield = [
			...current(G.hordeBattlefield),
			{
				...card,
				power: power,
				toughness: toughness,
				isExtraToken: true,
				uid: generateCardRandomId()
			}
		];
		G.hordeLife = computeHordeLife(G);
	},
	putCardsInHordeGraveyardFromDeck: ({ G }, n) => {
		if (n <= 0) return INVALID_MOVE;

		// Put first N cards in the graveyard from the top of the library
		let deck = [...current(G.hordeDeck)];
		G.hordeDeck = deck.slice(n);
		G.hordeGraveyard = current(G.hordeGraveyard).concat(
			deck
				.slice(0, n)
				.filter((card) => !isTokenCard(card))
				.map(clearCardState)
		);
		G.hordeLife = computeHordeLife(G);
	},
	putCardInHordeGraveyardFromBattlefield: ({ G }, index) => {
		if (index < 0) return INVALID_MOVE;

		let battlefield = [...current(G.hordeBattlefield)];
		battlefield[index] = clearCardState(battlefield[index]);
		G.hordeGraveyard = current(G.hordeGraveyard).concat(
			battlefield.splice(index, 1).filter((card) => !isTokenCard(card))
		);
		G.hordeBattlefield = battlefield;
		G.hordeLife = computeHordeLife(G);
	},
	putCardInHordeDeckFromBattlefield: ({ G }, index) => {
		if (index < 0) return INVALID_MOVE;

		let battlefield = [...current(G.hordeBattlefield)];
		battlefield[index] = clearCardState(battlefield[index]);
		G.hordeDeck = battlefield.splice(index, 1).concat(current(G.hordeDeck));
		G.hordeBattlefield = battlefield;
		G.hordeLife = computeHordeLife(G);
	},
	putCardInHordeExileFromBattlefield: ({ G }, index) => {
		if (index < 0) return INVALID_MOVE;

		let battlefield = [...current(G.hordeBattlefield)];
		battlefield[index] = clearCardState(battlefield[index]);
		battlefield.splice(index, 1);
		G.hordeBattlefield = battlefield;
		G.hordeLife = computeHordeLife(G);
	},
	putCardInHordeDeckFromGraveyard: ({ G }, index, top = true) => {
		if (index < 0) return INVALID_MOVE;

		let graveyard = [...current(G.hordeGraveyard)];
		let card = graveyard.splice(index, 1)[0];
		let deck = [...current(G.hordeDeck)];
		if (top) {
			deck.unshift(card);
		} else {
			deck.push(card);
		}
		G.hordeDeck = deck;
		G.hordeGraveyard = graveyard;
		G.hordeLife = computeHordeLife(G);
	},
	putCardInHordeBattefieldFromGraveyard: ({ G }, index, tapped = false) => {
		if (index < 0) return INVALID_MOVE;

		let graveyard = [...current(G.hordeGraveyard)];
		const card = graveyard.splice(index, 1)[0];
		G.hordeBattlefield = [...current(G.hordeBattlefield), { ...card, tapped }];
		G.hordeGraveyard = graveyard;
		G.hordeLife = computeHordeLife(G);
	},
	putCardInHordeExileFromGraveyard: ({ G }, index) => {
		if (index < 0) return INVALID_MOVE;

		let graveyard = [...current(G.hordeGraveyard)];
		graveyard.splice(index, 1)[0];
		G.hordeGraveyard = graveyard;
		G.hordeLife = computeHordeLife(G);
	},
	changeCardMarkerCounter: ({ G }, index, powerMarker, toughnessMarker) => {
		if (index < 0) return INVALID_MOVE;

		let battlefield = [...current(G.hordeBattlefield)];
		battlefield[index] = {
			...battlefield[index],
			powerMarker: (battlefield[index]?.powerMarker || 0) + powerMarker,
			toughnessMarker: (battlefield[index]?.toughnessMarker || 0) + toughnessMarker
		};
		G.hordeBattlefield = battlefield;
	},
	survivorsChangeLife: ({ G }, n) => {
		G.survivorsLife += n;
	}
};
