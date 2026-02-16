<script>
	import './app.css';
	import CompareDistribution from './CompareDistribution.svelte';
	import Board from './components/Board.svelte';
	let page = $state(document.location.hash);
</script>

<svelte:window on:hashchange={() => (page = document.location.hash)} />

{#if page === '#distribution'}
	<CompareDistribution />
{:else}
	<div id="app" class="h-full">
		<Board />
	</div>
{/if}
