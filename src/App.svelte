<script>
	import './app.postcss';
	import { onMount, setContext } from 'svelte';
	import { Client } from 'boardgame.io/client';
	import Board from './components/Board.svelte';
	import GithubCorner from './components/GithubCorner.svelte';
	import { MTGHorde } from './game';
	import { key } from './context';

	let client = Client({ game: MTGHorde, numPlayers: 2, debug: { collapseOnLoad: true } });
	setContext(key, client);

	onMount(() => {
		client.start();
		client.subscribe((state) => update(state));
	});

	function update(state) {
		// Update the element to show a winner if any.
		if (state.ctx.gameover) {
			alert(state.ctx.gameover.winner);
		}
	}
</script>

<GithubCorner />

<div id="app">
	<Board />
</div>

<style>
	#app {
		height: 100%;
	}
</style>
