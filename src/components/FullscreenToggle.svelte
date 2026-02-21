<script>
	import ToolbarButton from './ToolbarButton.svelte';

	let fullscreen = $state(false);
</script>

<svelte:window onfullscreenchange={() => (fullscreen = document.fullscreenElement !== null)} />

{#if document.fullscreenEnabled}
	<ToolbarButton
		label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
		icon={fullscreen ? 'mdi:fullscreen-exit' : 'mdi:fullscreen'}
		onclick={() => {
			const action = fullscreen
				? document.exitFullscreen()
				: document.documentElement.requestFullscreen();
			action.catch(() => {});
		}}
	/>
{/if}
