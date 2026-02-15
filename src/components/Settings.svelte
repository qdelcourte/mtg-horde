<script>
	import decks from 'decks';
	import { Button, Input, Label, Select } from 'flowbite-svelte';

	import { game as G } from '../game';

	let { onGameStart } = $props();

	const deckItems = Object.keys(decks).map((d) => ({ value: d, name: d }));

	let inputDeckValue = $state(deckItems[0].value);
	let inputNbSurvivorsValue = $state(1);
	let inputNbInitialSurvivorsTurnValue = $state(3);
	let inputTokenProportionValue = $state(60);

	function startOrRestartGame(event) {
		event.preventDefault();
		G.start({
			nbSurvivors: inputNbSurvivorsValue,
			deckName: inputDeckValue,
			nbInitialSurvivorsTurn: inputNbInitialSurvivorsTurnValue,
			tokenProportion: inputTokenProportionValue / 100
		});
		onGameStart();
	}
</script>

<form onsubmit={startOrRestartGame}>
	<div class="mb-6">
		<Label for="deckName"
			>Choose the horde
			<Select
				name="deckName"
				id="deckName"
				items={deckItems}
				bind:value={inputDeckValue}
				required
			/>
		</Label>
	</div>

	<div class="mb-6">
		<Label for="nbSurvivors">Number of survivors</Label>
		<Input
			bind:value={inputNbSurvivorsValue}
			min="1"
			step="1"
			type="number"
			name="nbSurvivors"
			id="nbSurvivors"
			placeholder="number of survivors"
			required
		/>
	</div>

	<div class="mb-6">
		<Label for="numInitialSurvivorsTurn">Number of initial survivors turn</Label>
		<Input
			bind:value={inputNbInitialSurvivorsTurnValue}
			min="1"
			step="1"
			type="number"
			name="numInitialSurvivorsTurn"
			id="numInitialSurvivorsTurn"
			placeholder="number of initial survivors turn"
			required
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
			required
		/>
	</div>

	<Button type="submit">
		{#if G.state.turn.currentInitialSurvivorTurn > 0}
			Restart
		{:else}
			Start
		{/if}
		Game
	</Button>
</form>
