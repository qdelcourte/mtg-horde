<script>
	import { Drawer, CloseButton } from 'flowbite-svelte';
	import Icon from '@iconify/svelte';
	import CardDetails from './CardDetails.svelte';

	const { placement = 'right' } = $props();

	let card = $state();
	let hidden = $state(true);

	export const show = (_card) => {
		card = _card;
		hidden = false;
	};
</script>

<Drawer bind:hidden transitionType="fly" {placement}>
	<div class="flex items-center">
		<h5
			id="drawer-label"
			class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400"
		>
			<Icon icon="mdi:information-slab-circle" width="24" class="mr-2" /> Card Details
		</h5>
		<CloseButton onclick={() => (hidden = true)} class="mb-4 dark:text-white" />
	</div>
	{#if card}
		<CardDetails {card} />
	{/if}
</Drawer>
