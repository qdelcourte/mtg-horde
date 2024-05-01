<script>
	import { Drawer, CloseButton } from 'flowbite-svelte';
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
			<svg
				class="w-5 h-5 mr-2"
				aria-hidden="true"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				><path
					fill-rule="evenodd"
					d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
					clip-rule="evenodd"
				/></svg
			>Card Details
		</h5>
		<CloseButton on:click={() => (hidden = true)} class="mb-4 dark:text-white" />
	</div>
	{#if card}
		<CardDetails {card} />
	{/if}
</Drawer>
