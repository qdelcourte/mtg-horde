/**
 * Save and Restore
 *
 * See: boardgame.io/src/client/debug/main/Controls.svelte
 */

function generateJSONSavepoint(client) {
	// get state to persist and overwrite deltalog, _undo, and _redo
	const state = client.getState();
	const json = {
		...state,
		_undo: [],
		_redo: [],
		deltalog: []
	};

	return json;
}

export function savepointInLocalStorage(client) {
	const json = generateJSONSavepoint(client);
	localStorage.setItem('gamestate', JSON.stringify(json));
	localStorage.setItem('initialState', JSON.stringify(client.initialState));
}

export function savepointInFile(client) {
	const json = generateJSONSavepoint(client);

	return {
		gamestate: json,
		initialState: client.initialState
	};
}

// SEE: import { sync } from 'boardgame.io/core/action-creators';
const sync = (info) => ({
	type: 'SYNC',
	state: info.state,
	log: info.log,
	initialState: info.initialState,
	clientOnly: true
});

function restoreSavepoint(client, gamestateJSON, initialStateJSON) {
	if (gamestateJSON !== null && initialStateJSON !== null) {
		client.store.dispatch(sync({ state: gamestateJSON, initialState: initialStateJSON }));
	}
}

export function restoreSavepointFromLocalStorage(client) {
	const gamestateJSON = localStorage.getItem('gamestate');
	const initialStateJSON = localStorage.getItem('initialState');
	restoreSavepoint(client, JSON.parse(gamestateJSON), JSON.parse(initialStateJSON));
}

export function restoreSavepointFromFile(client, fileContent) {
	const savepointJSON = JSON.parse(fileContent);
	const gamestateJSON = savepointJSON.gamestate;
	const initialStateJSON = savepointJSON.initialState;
	restoreSavepoint(client, gamestateJSON, initialStateJSON);
}
