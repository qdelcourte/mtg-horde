<script>
	import { Modal, ModalBody, ModalHeader } from 'sveltestrap';

	import Settings from './Settings.svelte';

	let open = false;
	export const toggle = () => (open = !open);
</script>

<Modal isOpen={open} {toggle} size="xl" backdrop={false}>
	<ModalHeader {toggle}>Settings</ModalHeader>
	<ModalBody>
		<Settings on:startGame={() => toggle()} />
	</ModalBody>
</Modal>
