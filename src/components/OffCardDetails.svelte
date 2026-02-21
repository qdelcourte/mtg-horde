<script>
	import Icon from '@iconify/svelte';
	import { Drawer } from 'flowbite-svelte';

	import { modals } from '../lib/modals.svelte.js';
	import CardDetails from './CardDetails.svelte';

	const { placement = 'right' } = $props();
</script>

<Drawer
	bind:open={modals.cardDetails.isOpen}
	{placement}
	class="overflow-y-auto! bg-gray-900! p-4! text-white!"
>
	<div class="drawer-title mb-4">
		<Icon icon="mdi:information-slab-circle" width="18" />
		<span>Card Details</span>
	</div>
	{#if modals.cardDetails.card}
		<CardDetails card={modals.cardDetails.card} />
	{/if}
</Drawer>

<style>
	.drawer-title {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 0.8rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 1px;
		color: rgba(255, 255, 255, 0.5);
	}
</style>
