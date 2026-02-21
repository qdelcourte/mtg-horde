<script>
	import Icon from '@iconify/svelte';
	import { Drawer } from 'flowbite-svelte';

	import { modals } from '../lib/modals.svelte.js';
	import CardDetails from './CardDetails.svelte';

	const { placement = 'right' } = $props();
</script>

<Drawer bind:open={modals.cardDetails.open} {placement} class="bg-gray-900! text-white!">
	<h5 id="drawer-label" class="mb-4 inline-flex items-center text-base font-semibold text-gray-300">
		<Icon icon="mdi:information-slab-circle" width="24" class="mr-2" /> Card Details
	</h5>
	{#if modals.cardDetails.card}
		<CardDetails card={modals.cardDetails.card} />
	{/if}
</Drawer>
