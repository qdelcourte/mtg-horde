<script>
	import { Button, Input, Select, Label, Spinner } from 'flowbite-svelte';
	import { game as G } from '../game.svelte';

	import decks from 'decks';

	let { onGameStart } = $props();

	let inputDeckValue = $state();
	let inputNbSurvivorsValue = $state(1);
	let inputNbInitialSurvivorsTurnValue = $state(3);
	let inputTokenProportionValue = $state(30);

	async function loadDeckList() {
		const deckList = Object.keys(decks);
		inputDeckValue = deckList[0];
		return deckList;
	}

	function startOrRestartGame() {
		G.client.reset();
		G.client.moves.startGame({
			nbSurvivors: inputNbSurvivorsValue,
			deckName: inputDeckValue,
			nbInitialSurvivorsTurn: inputNbInitialSurvivorsTurnValue,
			tokenProportion: inputTokenProportionValue / 100
		});
		onGameStart();
	}
</script>

<div class="mb-6">
	<Label for="deckName"
		>Choose the horde
		{#await loadDeckList()}
			<Spinner size="6" />
		{:then decks}
			<Select
				name="deckName"
				id="deckName"
				items={decks.map((d) => ({ value: d, name: d }))}
				bind:value={inputDeckValue}
			/>
		{/await}
	</Label>
</div>

<div class="mb-6">
	<Label for="nbSurvivors">Number of survivors</Label>
	<Input
		bind:value={inputNbSurvivorsValue}
		type="number"
		name="nbSurvivors"
		id="nbSurvivors"
		placeholder="number of survivors"
	/>
</div>

<div class="mb-6">
	<Label for="numInitialSurvivorsTurn">Number of initial survivors turn</Label>
	<Input
		bind:value={inputNbInitialSurvivorsTurnValue}
		type="number"
		name="numInitialSurvivorsTurn"
		id="numInitialSurvivorsTurn"
		placeholder="number of initial survivors turn"
	/>
</div>

<div class="mb-6">
	<Label for="tokenProportion">Token proportion in deck (%)</Label>
	<Input
		bind:value={inputTokenProportionValue}
		min="1"
		max="100"
		step="1"
		type="number"
		name="tokenProportion"
		id="tokenProportion"
		placeholder="token proportion in deck"
	/>
</div>

<Button onclick={startOrRestartGame}>Start/Restart Game</Button>
