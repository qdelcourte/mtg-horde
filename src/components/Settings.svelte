<script>
	import Icon from '@iconify/svelte';
	import decks from 'decks';

	import { game as G } from '../game';

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

<form onsubmit={startOrRestartGame} class="settings-form">
	<h2 class="settings-title">
		<Icon icon="mdi:sword-cross" width="24" />
		{isRestart ? 'Restart' : 'New'} Game
	</h2>

	<div class="field">
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

	<div class="field">
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

	<div class="field-row">
		<div class="field">
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
		<div class="field">
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

	<div class="field">
		<label for="tokenProportion">
			<Icon icon="mdi:percent" width="16" />
			Token proportion
		</label>
		<div class="range-row">
			<input
				id="tokenProportion"
				type="range"
				bind:value={inputTokenProportionValue}
				min="1"
				max="100"
				step="1"
			/>
			<span class="range-value">{inputTokenProportionValue}%</span>
		</div>
	</div>

	<button type="submit" class="submit-btn">
		<Icon icon={isRestart ? 'mdi:restart' : 'mdi:play'} width="20" />
		{isRestart ? 'Restart' : 'Start'} Game
	</button>
</form>

<style>
	.settings-form {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.settings-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 1.25rem;
		font-weight: 700;
		color: white;
		margin: 0;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		flex: 1;
	}

	.field-row {
		display: flex;
		gap: 1rem;
	}

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
		border-color: cornflowerblue;
	}

	select option {
		background: #1a1a2e;
		color: white;
	}

	input[type='range'] {
		flex: 1;
		accent-color: cornflowerblue;
	}

	.range-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.range-value {
		font-size: 0.9rem;
		font-weight: 600;
		color: white;
		min-width: 3rem;
		text-align: right;
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
		color: cornflowerblue;
	}

	.submit-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		background: cornflowerblue;
		color: white;
		border: none;
		border-radius: 8px;
		padding: 0.65rem 1rem;
		font-size: 0.95rem;
		font-weight: 600;
		cursor: pointer;
		transition: filter 0.2s;
		margin-top: 0.5rem;
	}

	.submit-btn:hover {
		filter: brightness(1.15);
	}
</style>
