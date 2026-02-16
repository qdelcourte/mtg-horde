<script>
	import Icon from '@iconify/svelte';
	import { Drawer } from 'flowbite-svelte';

	import CardDetails from './CardDetails.svelte';

	const { placement = 'right' } = $props();

	let card = $state();
	let open = $state(false);

	export const show = (_card) => {
		card = _card;
		open = true;
	};
</script>

<Drawer bind:open {placement} class="bg-gray-900! text-white!">
	<h5 id="drawer-label" class="mb-4 inline-flex items-center text-base font-semibold text-gray-300">
		<Icon icon="mdi:information-slab-circle" width="24" class="mr-2" /> Card Details
	</h5>
	{#if card}
		<CardDetails {card} />
	{/if}
</Drawer>
