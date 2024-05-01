<script>
	import { CloseButton, Drawer, Button, Label, Input } from 'flowbite-svelte';
	import { game as G } from '../game.svelte';
	import zombieTokenCard from 'decks/cards/zombie_token.json';

	const { placement = 'left' } = $props();

	let inputPowerValue = $state(zombieTokenCard.power);
	let inputToughness = $state(zombieTokenCard.toughness);

	let hidden = $state(true);
	export const show = () => (hidden = false);
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
			>Add Token
		</h5>
		<CloseButton on:click={() => (hidden = true)} class="mb-4 dark:text-white" />
	</div>
	<div>
		<img src={zombieTokenCard.images.normal} alt="zombie token card" class="mb-2" height="500px" />
	</div>
	<Label for="power">Power</Label>
	<Input bind:value={inputPowerValue} type="number" name="power" id="power" placeholder="power" />
	<Label for="toughness">Toughness</Label>
	<Input
		bind:value={inputToughness}
		type="number"
		name="toughness"
		id="toughness"
		placeholder="toughness"
	/>
	<Button
		class="mt-2"
		onclick={() =>
			G.client.moves.addTokenInHordeBattlefield(zombieTokenCard, inputPowerValue, inputToughness)}
		>Add token</Button
	>
</Drawer>
