<script>
	import { Modal } from 'flowbite-svelte';

	import Settings from './Settings.svelte';

	let { permanent = false } = $props();
	let open = $state(false);
	export const show = () => (open = true);
</script>

<Modal bind:open size="sm" {permanent}>
	<Settings onGameStart={() => (open = false)} />
</Modal>
