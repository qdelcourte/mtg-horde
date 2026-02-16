<script>
	import ToolbarButton from './ToolbarButton.svelte';

	let fullscreen = $state(false);
</script>

<svelte:window on:fullscreenchange={() => (fullscreen = document.fullscreenElement !== null)} />

<ToolbarButton
	label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
	icon={fullscreen ? 'mdi:fullscreen-exit' : 'mdi:fullscreen'}
	onclick={() => {
		fullscreen ? document.exitFullscreen() : document.documentElement.requestFullscreen();
	}}
/>
