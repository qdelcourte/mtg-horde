<script>
	import { Modal } from 'flowbite-svelte';
	import Settings from './Settings.svelte';

	let open = false;
	export const show = () => (open = true);
</script>

<Modal bind:open size="xs" title="Settings" {...$$restProps}>
	<Settings on:startGame={() => (open = false)} />
</Modal>
