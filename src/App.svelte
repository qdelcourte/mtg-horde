<script>
	import './app.css';
	import CompareDistribution from './CompareDistribution.svelte';
	import Game from './components/Game.svelte';
	let page = $state(document.location.hash);
</script>

<svelte:window on:hashchange={() => (page = document.location.hash)} />

{#if page === '#distribution'}
	<CompareDistribution />
{:else}
	<Game />
{/if}
