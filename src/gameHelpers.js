import { INVALID_MOVE } from 'boardgame.io/core';
import decks from 'decks';


export function loadDeck(deckName, nbSurvivors, tokenProportion) {
    const expectedNbCardsInDeck = [NaN, 45, 60, 75, 100][nbSurvivors] || Infinity;
    const expectedNbTokenCardsInDeck = Math.floor(expectedNbCardsInDeck * tokenProportion);
    const expectedNbNonTokenCardsInDeck = expectedNbCardsInDeck - expectedNbTokenCardsInDeck;

    const tokenCards = decks[deckName].filter(card => isTokenCard(card.card));
    const totalTokens = tokenCards.reduce((acc, card) => acc + card.qty, 0);

    // Prepare tokens
    const tokenDeck = tokenCards.reduce((acc, card) => {
        const proportion = totalTokens / card.qty;
        card.qty = Math.floor(proportion * expectedNbTokenCardsInDeck);
        return acc.concat(Array(card.qty).fill(card.card));  
    }, []);

    // Prepare non tokens
    const nonTokenDeck = decks[deckName]
            .filter(card => !isTokenCard(card.card))
            .reduce((acc, card) => acc.concat(Array(card.qty).fill(card.card)), [])
            .sort(() => 0.5 - Math.random())
            .slice(0, expectedNbNonTokenCardsInDeck);

    // Return deck shuffled
    return tokenDeck.concat(nonTokenDeck).sort(() => 0.5 - Math.random());
}

export function computeHordeLife(G) {
    return G.hordeDeck.length + G.hordeBattlefield.filter(card => !card.is_extra_token).length;
}

export function computeDefaultSurvivorsLife(nbSurvivors) {
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

export function clearCardState(card) {
    card.tapped = false;
    card.powerMarker = 0;
    card.toughnessMarker = 0;
    card.is_extra_token = false;

    return card;
}

// Game Moves
export default {
    hordeDrawCards: ({G}) => {
        // Draw cards in horde deck until the first token
        let deck = JSON.parse(JSON.stringify(G.hordeDeck));
        const indexOfFirstNonToken = deck.findIndex(card => !isTokenCard(card));
        if (indexOfFirstNonToken === -1) {
            G.hordeDeck = [];
            G.hordeBattlefield = JSON.parse(JSON.stringify(G.hordeBattlefield)).concat(deck);
        } else {
            G.hordeDeck = deck.slice(indexOfFirstNonToken + 1);
            G.hordeBattlefield = JSON.parse(JSON.stringify(G.hordeBattlefield)).concat(deck.slice(0, indexOfFirstNonToken + 1));
        }
        G.hordeLife = computeHordeLife(G);
    },
    hordeUntapAllCards: ({G}) => {
        let battlefield = JSON.parse(JSON.stringify(G.hordeBattlefield));
        G.hordeBattlefield = battlefield.map(card => {
            card.tapped = false;
            return card;
        });
    },
    hordeTapAllCards: ({G}) => {
        let battlefield = JSON.parse(JSON.stringify(G.hordeBattlefield));
        G.hordeBattlefield = battlefield.map(card => {
            if (isInstantCard(card) || isSorceryCard(card) || isEnchantmentCard(card)) {
                return card;
            }
            card.tapped = true;
            return card;
        });
    },
    addTokenInHordeBattlefield: ({G}, card, power, toughness) => {
        let battlefield = JSON.parse(JSON.stringify(G.hordeBattlefield));

        card = Object.assign({}, card);
        card.power = power;
        card.toughness = toughness;
        card.is_extra_token = true;

        battlefield.push(card);
        G.hordeBattlefield = battlefield;
        G.hordeLife = computeHordeLife(G);
    },
    putCardsInHordeGraveyardFromDeck: ({G}, n) => {
        if (n <= 0) return INVALID_MOVE;

        // Put first N cards in the graveyard from the top of the library
        let deck = JSON.parse(JSON.stringify(G.hordeDeck));
        G.hordeDeck = deck.slice(n);
        G.hordeGraveyard = JSON.parse(JSON.stringify(G.hordeGraveyard)).concat(deck.slice(0, n).filter(card => !isTokenCard(card)).map(card => clearCardState(card)));
        G.hordeLife = computeHordeLife(G);
    },
    putCardInHordeGraveyardFromBattlefield: ({G}, index) => {
        if (index < 0) return INVALID_MOVE;

        let battlefield = JSON.parse(JSON.stringify(G.hordeBattlefield));
        battlefield[index] = clearCardState(battlefield[index]);
        G.hordeGraveyard = JSON.parse(JSON.stringify(G.hordeGraveyard)).concat(battlefield.splice(index, 1).filter(card => !isTokenCard(card)));
        G.hordeBattlefield = battlefield;
        G.hordeLife = computeHordeLife(G);
    },
    putCardInHordeDeckFromBattlefield: ({G}, index) => {
        if (index < 0) return INVALID_MOVE;

        let battlefield = JSON.parse(JSON.stringify(G.hordeBattlefield));
        battlefield[index] = clearCardState(battlefield[index]);
        G.hordeDeck = battlefield.splice(index, 1).concat(JSON.parse(JSON.stringify(G.hordeDeck)));
        G.hordeBattlefield = battlefield;
        G.hordeLife = computeHordeLife(G);
    },
    putCardInHordeExileFromBattlefield: ({G}, index) => {
        if (index < 0) return INVALID_MOVE;

        let battlefield = JSON.parse(JSON.stringify(G.hordeBattlefield));
        battlefield[index] = clearCardState(battlefield[index]);
        battlefield.splice(index, 1);
        G.hordeBattlefield = battlefield;
        G.hordeLife = computeHordeLife(G);
    },
    putCardInHordeDeckFromGraveyard: ({G}, index, top = true) => {
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
    },
    putCardInHordeBattefieldFromGraveyard: ({G}, index, tapped = false) => {
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
    },
    putCardInHordeExileFromGraveyard: ({G}, index) => {
        if (index < 0) return INVALID_MOVE;

        let graveyard = JSON.parse(JSON.stringify(G.hordeGraveyard));
        graveyard.splice(index, 1)[0];
        G.hordeGraveyard = graveyard;
        G.hordeLife = computeHordeLife(G);
    },
    hordeToggleTapCard: ({G}, index) => {
        if (index < 0) return INVALID_MOVE;

        // Tap or untap card from the battlefield
        let battlefield = JSON.parse(JSON.stringify(G.hordeBattlefield));
        battlefield[index].tapped = battlefield[index].hasOwnProperty('tapped') ? !battlefield[index].tapped : true;
        G.hordeBattlefield = battlefield;
    },
    changeCardPowerCounter: ({G}, index, nbPower) => {
        if (index < 0) return INVALID_MOVE;

        let battlefield = JSON.parse(JSON.stringify(G.hordeBattlefield));
        if (!battlefield[index].hasOwnProperty('powerMarker')) {
            battlefield[index].powerMarker = 0;
        }
        battlefield[index].powerMarker += nbPower;
        G.hordeBattlefield = battlefield;
    },
    changeCardToughnessCounter: ({G}, index, nbToughness) => {
        if (index < 0) return INVALID_MOVE;

        let battlefield = JSON.parse(JSON.stringify(G.hordeBattlefield));
        if (!battlefield[index].hasOwnProperty('toughnessMarker')) {
            battlefield[index].toughnessMarker = 0;
        }
        battlefield[index].toughnessMarker += nbToughness;
        G.hordeBattlefield = battlefield;
    },
    changeCardMarkerCounter: ({G}, index, nbMarker) => {
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
    },
    survivorsLoseLife: ({G}, n) => {
        if (n <= 0) return INVALID_MOVE;

        G.survivorsLife -= n;
    },
    survivorsGainLife: ({G}, n) => {
        if (n <= 0) return INVALID_MOVE;

        G.survivorsLife += n;
    },
};