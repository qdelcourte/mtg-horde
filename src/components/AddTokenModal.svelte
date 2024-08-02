<script>
	import { CloseButton, Drawer, Button, Label, Input } from 'flowbite-svelte';
	import Icon from '@iconify/svelte';
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
			<Icon icon="mdi:information-slab-circle" width="24" class="mr-2"/> Add Token
		</h5>
		<CloseButton onclick={() => (hidden = true)} class="mb-4 dark:text-white" />
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
