<script>
	import Icon from '@iconify/svelte';
	import { Tooltip } from 'flowbite-svelte';

	let fullscreen = $state(false);
</script>

<svelte:window on:fullscreenchange={() => (fullscreen = document.fullscreenElement !== null)} />

{#if fullscreen}
	<Icon
		id="exit-fullscreen"
		onclick={() => document.exitFullscreen()}
		icon="mdi:fullscreen-exit"
		color="white"
		width="32"
	/>
	<Tooltip triggeredBy="#exit-fullscreen">Exit fullscreen</Tooltip>
{:else}
	<Icon
		id="enter-fullscreen"
		onclick={() => document.documentElement.requestFullscreen()}
		icon="mdi:fullscreen"
		color="white"
		width="32"
	/>
	<Tooltip triggeredBy="#enter-fullscreen">Enter fullscreen</Tooltip>
{/if}
