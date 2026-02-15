<script>
	import Icon from '@iconify/svelte';
	import zombieTokenCard from 'decks/cards/zombie_token.json';
	import { Button, Drawer, Input, Label } from 'flowbite-svelte';

	import { game as G } from '../game';

	const { placement = 'left' } = $props();

	let inputPowerValue = $state(zombieTokenCard.power);
	let inputToughness = $state(zombieTokenCard.toughness);

	let open = $state(false);
	export const show = () => (open = true);
</script>

<Drawer bind:open {placement} class="bg-gray-900! text-white!">
	<h5 id="drawer-label" class="mb-4 inline-flex items-center text-base font-semibold text-gray-300">
		<Icon icon="mdi:plus-circle" width="18" class="mr-2" /> Add Token
	</h5>
	<div>
		<img
			src={zombieTokenCard.images.normal}
			alt="zombie token card"
			class="mb-2 rounded-[4.75%/3.5%]"
			width="488"
			height="680"
		/>
	</div>
	<div class="flex gap-4">
		<div class="flex-1">
			<Label for="power">Power</Label>
			<Input
				bind:value={inputPowerValue}
				type="number"
				name="power"
				id="power"
				placeholder="power"
			/>
		</div>
		<div class="flex-1">
			<Label for="toughness">Toughness</Label>
			<Input
				bind:value={inputToughness}
				type="number"
				name="toughness"
				id="toughness"
				placeholder="toughness"
			/>
		</div>
	</div>
	<Button
		class="mt-2"
		onclick={() =>
			G.moves.addTokenInHordeBattlefield(zombieTokenCard, inputPowerValue, inputToughness)}
		>Add token</Button
	>
</Drawer>
