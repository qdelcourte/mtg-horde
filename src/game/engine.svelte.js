import decks from 'decks';

import { INVALID_MOVE, loadDeck } from './helpers';
import { PHASES, PHASES_CONFIG } from './phases';

const LOCALSTORAGE_SAVEPOINT_KEY = 'mtghorde.state';
const MAX_UNDO_STACK_SIZE = 50;

const INITIAL_STATE = {
	config: {
		nbSurvivors: 1,
		tokenProportion: 0.6,
		nbInitialSurvivorsTurn: 3
	},
	horde: {
		deck: [],
		battlefield: [],
		graveyard: []
	},
	survivors: {
		life: 0
	},
	turn: {
		current: 0,
		currentInitialSurvivorTurn: 0,
		phase: null,
		stage: null,
		activePlayer: 0,
		gameover: null
	}
};

class EventEmitter extends EventTarget {
	emit(name, detail = null) {
		this.dispatchEvent(new CustomEvent(name, { detail }));
	}

	on(name, callback) {
		this.addEventListener(name, callback);

		return () => {
			this.removeEventListener(name, callback);
		};
	}
}

class Engine extends EventEmitter {
	state = $state(INITIAL_STATE);

	hordeLife = $derived(
		this.state.horde.deck.length +
			this.state.horde.battlefield.filter((card) => !card.isExtraToken).length
	);

	hordeDamage = $derived(
		this.state.horde.battlefield.reduce((a, b) => a + (parseInt(b?.power) || 0), 0)
	);

	#undoStack = [];
	#redoStack = [];

	start({ deckName, nbSurvivors, tokenProportion, nbInitialSurvivorsTurn }) {
		this.#reset();
		this.state.config.nbSurvivors = nbSurvivors;
		this.state.config.tokenProportion = tokenProportion;
		this.state.config.nbInitialSurvivorsTurn = nbInitialSurvivorsTurn;

		this.state.survivors.life = this.state.config.nbSurvivors * 20;
		this.state.horde.deck = loadDeck(decks[deckName], {
			nbSurvivors: this.state.config.nbSurvivors,
			tokenPercentage: this.state.config.tokenProportion
		});
		this.state.turn.currentInitialSurvivorTurn++;
		this.setPhase(PHASES.initialSurvivorsTurns);
	}

	setPhase(name) {
		this.state.turn.phase = name;
		const phaseConf = PHASES_CONFIG?.[name];
		if (phaseConf?.stages?.initial) {
			this.setCurrentPlayerStage(phaseConf.stages.initial);
		}
	}

	setCurrentPlayerStage(stage) {
		const phaseConf = PHASES_CONFIG?.[this.state.turn.phase];
		if (phaseConf?.stages && !phaseConf.stages?.[stage]) {
			throw new Error(`Stage '${stage}' not found in phase '${this.state.turn.phase}'`);
		}

		this.state.turn.stage = stage;
	}

	endTurn() {
		this.state.turn.activePlayer = this.state.turn.activePlayer === 0 ? 1 : 0;
	}

	#checkGameOver() {
		let result = null;
		if (this.state.turn.phase === PHASES.fightTheHorde) {
			if (this.hordeLife <= 0) {
				result = { winner: 'Survivors win !' };
			} else if (this.state.survivors.life <= 0) {
				result = { winner: 'Horde wins !' };
			}
		}
		this.state.turn.gameover = result;
		if (result) {
			this.emit('gameover', result);
		}
	}

	// Moves
	moves = new Proxy(
		{},
		{
			get:
				(_, name) =>
				(...args) =>
					this.#executeMove(name, ...args)
		}
	);

	#resolveMove(name) {
		return PHASES_CONFIG?.[this.state.turn.phase]?.moves?.[name] ?? null;
	}

	#executeMove(name, ...args) {
		const fn = this.#resolveMove(name);
		if (!fn) return;

		this.#undoStack.push(this.#snap());
		if (this.#undoStack.length > MAX_UNDO_STACK_SIZE) this.#undoStack.shift();
		this.#redoStack = [];

		const result = fn(this, ...args);
		if (result === INVALID_MOVE) {
			this.#restoreSnapshot(this.#undoStack.pop());
			return;
		}

		this.#checkPhaseEnd();
		this.#checkGameOver();
	}

	#checkPhaseEnd() {
		if (!this.state.turn.phase) return;
		const conf = PHASES_CONFIG?.[this.state.turn.phase];
		if (conf?.endIf?.(this)) {
			if (conf.next) this.setPhase(conf.next);
		}
	}

	// Undo/Redo + Savepoint

	#restoreSnapshot(snap) {
		this.state = structuredClone(snap);
	}

	#snap() {
		return $state.snapshot(this.state);
	}

	undo() {
		if (!this.#undoStack.length) return;
		this.#redoStack.push(this.#snap());
		this.#restoreSnapshot(this.#undoStack.pop());
	}

	redo() {
		if (!this.#redoStack.length) return;
		this.#undoStack.push(this.#snap());
		this.#restoreSnapshot(this.#redoStack.pop());
	}

	savepointInLocalStorage() {
		localStorage.setItem(LOCALSTORAGE_SAVEPOINT_KEY, JSON.stringify(this.#snap()));
	}

	restoreSavepointFromLocalStorage() {
		const gamestateJSON = localStorage.getItem(LOCALSTORAGE_SAVEPOINT_KEY);
		if (!gamestateJSON) throw new Error('No savepoint found');

		const parsed = JSON.parse(gamestateJSON);
		const requiredKeys = Object.keys(INITIAL_STATE);
		const hasValidShape = requiredKeys.every((key) => key in parsed);
		if (!hasValidShape) throw new Error('Savepoint is incompatible with current version');

		this.#restoreSnapshot(parsed);
		this.#undoStack = [];
		this.#redoStack = [];
	}

	#reset() {
		this.#restoreSnapshot(INITIAL_STATE);
		this.#undoStack = [];
		this.#redoStack = [];
	}
}

export default Engine;
