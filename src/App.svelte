<script>
	import './app.postcss';
	import Board from './components/Board.svelte';
	import GithubCorner from './components/GithubCorner.svelte';
	import { game as G } from './game.svelte';

	$effect(() => {
		if (G.state.ctx.gameover) alert(G.state.ctx.gameover.winner);
	});
</script>

<GithubCorner />

<div id="app" class="h-full">
	<Board />
</div>
