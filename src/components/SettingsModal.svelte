<script>
	import { Modal } from 'flowbite-svelte';
	import Settings from './Settings.svelte';

	let open = false;
	export const toggle = () => (open = !open);
</script>

<Modal {open} {toggle} size="xl" title="Settings" {...$$restProps}>
	<Settings on:startGame={() => toggle()} />
</Modal>
