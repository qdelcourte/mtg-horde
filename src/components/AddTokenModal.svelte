<script>
	import Icon from '@iconify/svelte';
	import zombieTokenCard from 'decks/cards/zombie_token.json';
	import { Button, Drawer, Input, Label } from 'flowbite-svelte';

	import { game as G } from '../game.svelte';

	const { placement = 'left' } = $props();

	let inputPowerValue = $state(zombieTokenCard.power);
	let inputToughness = $state(zombieTokenCard.toughness);

	let open = $state(false);
	export const show = () => (open = true);
</script>

<Drawer bind:open {placement}>
	<h5
		id="drawer-label"
		class="mb-4 inline-flex items-center text-base font-semibold text-gray-500 dark:text-gray-400"
	>
		<Icon icon="mdi:information-slab-circle" width="24" class="mr-2" /> Add Token
	</h5>
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
