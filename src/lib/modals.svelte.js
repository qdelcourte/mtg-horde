class Modal {
	isOpen = $state(false);

	open() {
		this.isOpen = true;
	}

	close() {
		this.isOpen = false;
	}
}

class CardDetailsModal extends Modal {
	card = $state(null);

	open(card) {
		this.card = card;
		this.isOpen = true;
	}
}

export const modals = {
	graveyard: new Modal(),
	settings: new Modal(),
	gameInfo: new Modal(),
	addToken: new Modal(),
	cardDetails: new CardDetailsModal()
};
