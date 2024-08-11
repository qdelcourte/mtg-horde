<script>
	import './app.postcss';
	import Board from './components/Board.svelte';
	import GithubCorner from './components/GithubCorner.svelte';
	import CompareDistribution from './CompareDistribution.svelte';
	import { game as G } from './game.svelte';

	$effect(() => {
		if (G.state.ctx.gameover) alert(G.state.ctx.gameover.winner);
	});

	let page = $state(document.location.hash);
</script>

<svelte:window on:hashchange={() => page = document.location.hash}/>
	
<GithubCorner />

{#if page === '#distribution'}
	<CompareDistribution/>
{:else}
	<div id="app" class="h-full">
		<Board />
	</div>
{/if}