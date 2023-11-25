const scryfall = require('scryfall-sdk');
const fs = require('fs');

let deckJSON = [];

new Promise((resolve) => {
	const lines = fs.readFileSync(process.argv[2], 'utf8').split(/\n/);
	for (const line in lines) {
		const cardLine = lines[line].split(/ (.+)/);
		const nbCards = parseInt(cardLine[0]);
		const cardName = cardLine[1];

		let card;
		if (cardName.match(/^id:.+/)) {
			card = Promise.resolve(scryfall.Cards.byMultiverseId(cardName.split(':')[1]));
		} else {
			card = Promise.resolve(scryfall.Cards.byName(cardName));
		}

		if (card.not_found) {
			console.error(`${cardName} not found`);
			continue;
		}

		deckJSON.push({
			qty: nbCards,
			card: {
				uri: card.uri,
				scryfall_uri: card.scryfall_uri,
				lang: card.lang,
				name: card.name,
				mana_cost: card.mana_cost,
				cmc: card.cmc,
				colors: card.colors,
				color_identity: card.color_identity,
				type: card.type_line,
				layout: card.layout,
				text: card.oracle_text,
				power: card.power,
				toughness: card.toughness,
				multiverse_ids: card.multiverse_ids,
				images: card.image_uris,
				rulings: card.rulings_uri,
				id: card.id
			}
		});

		console.log(card.name, nbCards);
	}
	resolve();
}).then(() => {
	fs.writeFile(process.argv[3], JSON.stringify(deckJSON), 'utf8', function (err) {
		if (err) {
			console.log('An error occured while writing JSON Object to File.');
			return console.log(err);
		}

		console.log('JSON file has been saved.');
	});
});
