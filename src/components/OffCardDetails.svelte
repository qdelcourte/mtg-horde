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

<Drawer bind:open {placement}>
	<h5
		id="drawer-label"
		class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400"
	>
		<Icon icon="mdi:information-slab-circle" width="24" class="mr-2" /> Card Details
	</h5>
	{#if card}
		<CardDetails {card} />
	{/if}
</Drawer>
