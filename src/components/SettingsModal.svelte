<script>
	import { Modal } from 'flowbite-svelte';

	import { modals } from '../lib/modals.svelte.js';
	import Settings from './Settings.svelte';

	let { permanent = false } = $props();
</script>

<Modal bind:open={modals.settings} size="sm" {permanent}>
	<Settings onGameStart={() => (modals.settings = false)} />
</Modal>
