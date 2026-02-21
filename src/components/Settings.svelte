<script>
	import Icon from '@iconify/svelte';
	import decks from 'decks';

	import { game as G } from '../game';
	import RangeInput from './RangeInput.svelte';

	let { onGameStart } = $props();

	const deckLabels = {
		zombie_original: 'Zombie - Original',
		zombie_hard: 'Zombie - Hard',
		zombie_medium: 'Zombie - Medium'
	};

	const deckItems = Object.keys(decks).map((d) => ({
		value: d,
		name: deckLabels[d] || d.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
	}));

	const distributionModeItems = [
		{ value: 'geometric_boosted', name: 'Geometric Boosted' },
		{ value: 'geometric', name: 'Geometric' },
		{ value: 'escalation', name: 'Escalation' },
		{ value: 'random', name: 'Random' }
	];

	let inputDeckValue = $state(deckItems[0].value);
	let inputDistributionMode = $state('geometric_boosted');
	let inputNbSurvivorsValue = $state(1);
	let inputNbInitialSurvivorsTurnValue = $state(3);
	let inputTokenProportionValue = $state(60);

	function startOrRestartGame(event) {
		event.preventDefault();
		G.start({
			nbSurvivors: inputNbSurvivorsValue,
			deckName: inputDeckValue,
			nbInitialSurvivorsTurn: inputNbInitialSurvivorsTurnValue,
			tokenProportion: inputTokenProportionValue / 100,
			distributionMode: inputDistributionMode
		});
		onGameStart();
	}

	const isRestart = $derived(G.state.turn.currentInitialSurvivorTurn > 0);
</script>

<form onsubmit={startOrRestartGame} class="flex flex-col gap-5">
	<h2 class="m-0 flex items-center gap-2 text-xl font-bold text-white">
		<Icon icon="mdi:sword-cross" width="24" />
		{isRestart ? 'Restart' : 'New'} Game
	</h2>

	<div class="flex flex-1 flex-col gap-1.5">
		<label for="deckName">
			<Icon icon="mdi:cards" width="16" />
			Horde deck
		</label>
		<select id="deckName" name="deckName" bind:value={inputDeckValue} required>
			{#each deckItems as item (item.value)}
				<option value={item.value}>{item.name}</option>
			{/each}
		</select>
	</div>

	<div class="flex flex-1 flex-col gap-1.5">
		<label for="distributionMode">
			<Icon icon="mdi:shuffle-variant" width="16" />
			Distribution mode
		</label>
		<select id="distributionMode" name="distributionMode" bind:value={inputDistributionMode}>
			{#each distributionModeItems as item (item.value)}
				<option value={item.value}>{item.name}</option>
			{/each}
		</select>
		<a href="#distribution" class="distribution-hint" target="_blank">
			<Icon icon="mdi:chart-bell-curve-cumulative" width="14" />
			Compare distribution modes
		</a>
	</div>

	<div class="flex gap-4">
		<div class="flex flex-1 flex-col gap-1.5">
			<label for="nbSurvivors">
				<Icon icon="mdi:account-group" width="16" />
				Survivors
			</label>
			<input
				id="nbSurvivors"
				type="number"
				bind:value={inputNbSurvivorsValue}
				min="1"
				step="1"
				required
			/>
		</div>
		<div class="flex flex-1 flex-col gap-1.5">
			<label for="numInitialSurvivorsTurn">
				<Icon icon="mdi:timer-sand" width="16" />
				Setup turns
			</label>
			<input
				id="numInitialSurvivorsTurn"
				type="number"
				bind:value={inputNbInitialSurvivorsTurnValue}
				min="1"
				step="1"
				required
			/>
		</div>
	</div>

	<div class="flex flex-1 flex-col gap-1.5">
		<label for="tokenProportion">
			<Icon icon="mdi:percent" width="16" />
			Token proportion
		</label>
		<div class="flex items-center gap-3">
			<RangeInput id="tokenProportion" bind:value={inputTokenProportionValue} min={1} max={100} />
			<span class="min-w-12 text-right text-sm font-semibold text-white"
				>{inputTokenProportionValue}%</span
			>
		</div>
	</div>

	<button
		type="submit"
		class="bg-primary-500 mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-lg border-none px-4 py-2.5 text-base font-semibold text-white transition-[filter] duration-200 hover:brightness-[1.15]"
	>
		<Icon icon={isRestart ? 'mdi:restart' : 'mdi:play'} width="20" />
		{isRestart ? 'Restart' : 'Start'} Game
	</button>
</form>

<style>
	label {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.8rem;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.7);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	select,
	input[type='number'] {
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 8px;
		color: white;
		padding: 0.5rem 0.75rem;
		font-size: 0.9rem;
		outline: none;
		transition: border-color 0.2s;
	}

	select:focus,
	input[type='number']:focus {
		border-color: var(--color-primary-500);
	}

	select option {
		background: var(--color-bg-dropdown);
		color: white;
	}

	.distribution-hint {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.4);
		text-decoration: none;
		transition: color 0.2s;
	}

	.distribution-hint:hover {
		color: var(--color-primary-500);
	}
</style>
