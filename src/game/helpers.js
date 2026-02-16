import { Rarity } from 'scryfall-sdk';

export const INVALID_MOVE = 'INVALID_MOVE';

/**
 * Load and generate Horde's deck
 *
 * @param {Array} deck
 * @param {Object} options - Configuration options
 * @param {'geometric'|'geometric_boosted'|'random'|'escalation'} options.distributionMode - Specify the token distribution method in deck
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
		case 'escalation':
			return escalationDistributionHordeDeck(deck, options);
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

/**
 * Load and generate Horde's deck with escalating difficulty
 *
 * Splits the deck into 3 segments (early/mid/late) with decreasing token density.
 * Each segment uses geometric_boosted logic to avoid long token streaks.
 *
 * @param {Array} deck
 * @param {Object} options
 * @returns {Array}
 */
function escalationDistributionHordeDeck(deck, options) {
	const { nbSurvivors, tokenPercentage, shuffleBiasFactor = null } = options;

	const totalCards = getNbCardsFromNbSurvivors(nbSurvivors);
	const segmentSize = Math.floor(totalCards / 3);
	const lastSegmentSize = totalCards - segmentSize * 2;

	// Token ratios per segment: high early, normal mid, low late
	const earlyRatio = Math.min(tokenPercentage + 0.15, 0.9);
	const midRatio = tokenPercentage;
	const lateRatio = Math.max(tokenPercentage - 0.15, 0.1);

	// Prepare token and non-token pools
	const tokenCards = deck.filter((card) => isTokenCard(card.card));
	const totalTokens = tokenCards.reduce((acc, card) => acc + card.qty, 0);
	const totalNeededTokens = Math.round(totalCards * tokenPercentage);

	const allTokens = shuffle(
		tokenCards.flatMap((card) =>
			Array.from({ length: Math.floor((card.qty / totalTokens) * totalNeededTokens) }, () =>
				getCardFace(card.card)
			)
		),
		shuffleBiasFactor
	);

	const allNonTokens = shuffle(
		deck.flatMap((card) =>
			!isTokenCard(card.card) ? Array.from({ length: card.qty }, () => getCardFace(card.card)) : []
		),
		shuffleBiasFactor
	);

	let tokenIndex = 0;
	let nonTokenIndex = 0;
	const reducedDeck = [];

	// Build each segment with its own token ratio
	const segments = [
		{ size: segmentSize, ratio: earlyRatio },
		{ size: segmentSize, ratio: midRatio },
		{ size: lastSegmentSize, ratio: lateRatio }
	];

	for (const segment of segments) {
		const segmentTokenCount = Math.round(segment.size * segment.ratio);
		let tokensPlaced = 0;
		let nbTokenInARow = 0;
		let MAX_TOKEN_IN_A_ROW = 1;

		for (let i = 0; i < segment.size; i++) {
			const probability = 1 - Math.exp(-0.2 * (i + 1));
			const shouldAddToken = Math.random() < probability;
			const needMoreTokens = tokensPlaced < segmentTokenCount;

			if (
				shouldAddToken &&
				needMoreTokens &&
				tokenIndex < allTokens.length &&
				nbTokenInARow + 1 <= MAX_TOKEN_IN_A_ROW
			) {
				reducedDeck.push(allTokens[tokenIndex++]);
				tokensPlaced++;
				nbTokenInARow++;
			} else if (nonTokenIndex < allNonTokens.length) {
				reducedDeck.push(allNonTokens[nonTokenIndex++]);
				nbTokenInARow = 0;
			} else if (tokenIndex < allTokens.length) {
				reducedDeck.push(allTokens[tokenIndex++]);
				tokensPlaced++;
				nbTokenInARow++;
			}

			if (!shouldAddToken && Math.random() < 0.1) {
				MAX_TOKEN_IN_A_ROW += 1;
			}
		}
	}

	// Fill remaining spots
	reducedDeck.push(...allTokens.slice(tokenIndex, totalCards - reducedDeck.length));
	reducedDeck.push(...allNonTokens.slice(nonTokenIndex, totalCards - reducedDeck.length));

	return reducedDeck;
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

	const merged = { ...card, ...cardFace };

	return {
		name: merged.name,
		text: merged.text,
		images: { normal: merged.images?.normal },
		power: merged.power,
		toughness: merged.toughness,
		type: merged.type,
		layout: merged.layout,
		cmc: merged.cmc,
		rarity: merged.rarity,
		custom_tags: merged.custom_tags,
		uid: generateCardRandomId()
	};
}

export function generateCardRandomId() {
	return crypto.randomUUID();
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

export function hasSorceryOrInstantOnBattlefield(G) {
	return (
		G.state.horde.battlefield.find((card) => isInstantCard(card) || isSorceryCard(card)) !=
		undefined
	);
}
