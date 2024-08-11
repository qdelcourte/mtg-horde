import scryfall from 'scryfall-sdk';
import fs from 'fs';

const regex = /^(\d+)\s+([A-Za-z'\s]+)(\s+\(.*?\))?((\s+#\w+)+)?$/;

new Promise(async (resolve) => {
	let deckJSON = [];
	const lines = fs.readFileSync(process.argv[2], 'utf8').split(/\n/);
	for (const idx in lines) {
		const match = regex.exec(lines[idx]);
		if (!match) continue;

		const nbCards = parseInt(match[1]);
		const cardName = match[2].trim();
		const setTag = match[3] ? match[3].replaceAll(/[\(\)\s]/g, '').trim() : '';
		const customTags = match[4] ? match[4].trim().split(/\s+/) : [];

		let card;
		if (cardName.match(/^id:.+/)) {
			card = await scryfall.Cards.byMultiverseId(cardName.split(':')[1]);
		} else {
			card = await scryfall.Cards.byName(cardName, setTag);
		}

		if (!card || card.not_found) {
			console.error(`${cardName} not found`);
			continue;
		}

		deckJSON.push({
			qty: nbCards,
			card: {
				id: card.id,
				multiverse_ids: card.multiverse_ids,
				name: card.name,
				lang: card.lang,
				uri: card.uri,
				scryfall_uri: card.scryfall_uri,
				layout: card.layout,
				images: card.image_uris,
				mana_cost: card.mana_cost,
				cmc: card.cmc,
				type: card.type_line,
				text: card.oracle_text,
				color_identity: card.color_identity,
				card_faces: card.card_faces,
				colors: card.colors,
				power: card.power,
				toughness: card.toughness,
				rulings: card.rulings_uri,
				rarity: card.rarity,
				custom_tags: customTags
			}
		});

		console.log(card.name, nbCards);
	}
	resolve(deckJSON);
}).then((deckJSON) => {
	fs.writeFile(
		process.argv[2].replace('.txt', '.json'),
		JSON.stringify(deckJSON),
		'utf8',
		function (err) {
			if (err) {
				console.log('An error occured while writing JSON Object to File.');
				return console.log(err);
			}

			console.log('JSON file has been saved.');
			process.exit();
		}
	);
});
