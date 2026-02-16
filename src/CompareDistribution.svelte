<script>
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	import decks from '../decks/index.js';
	import { isLategameCard, isTokenCard, loadDeck } from './game/helpers.js';

	const distributionModes = ['geometric', 'geometric_boosted', 'escalation', 'random'];
	const modeDescriptions = {
		geometric: {
			text: 'Even token distribution using geometric probability.',
			pros: 'Consistent pacing, tokens spread evenly across the game',
			cons: 'Can still produce occasional long token streaks with no real spells'
		},
		geometric_boosted: {
			text: 'Geometric distribution with limits on consecutive token draws. Used by default in-game.',
			pros: 'Best pacing — always mixes spells between tokens, keeps tension every turn',
			cons: 'Less surprising, experienced players may find it slightly predictable'
		},
		random: {
			text: 'Fully random token placement.',
			pros: 'High variance — some turns feel easy, some are overwhelming',
			cons: 'Can flip 10+ tokens in a row (boring) or stack all spells together (instant death)'
		},
		escalation: {
			text: 'Progressive difficulty — token density decreases across the deck. Early game is calm, late game is intense.',
			pros: 'Natural difficulty curve, survivors have time to set up before facing the real threats',
			cons: 'Early game can feel too easy, less surprise factor'
		}
	};
	const deckNames = Object.keys(decks);

	let selectedDeck = $state(deckNames[0]);
	let tokenPercent = $state(60);
	let shuffleBias = $state(80);

	let options = $derived({
		nbSurvivors: 4,
		tokenPercentage: tokenPercent / 100,
		shuffleBiasFactor: shuffleBias / 100
	});

	let nbGeneration = $state(6);
	let generations = $state({});
	let stats = $state({});

	let showGeneration = $state();

	function longestTokenStreak(cards) {
		let max = 0;
		let maxStart = 0;
		let current = 0;
		let currentStart = 0;
		for (let i = 0; i < cards.length; i++) {
			if (isTokenCard(cards[i])) {
				if (current === 0) currentStart = i;
				current++;
				if (current > max) {
					max = current;
					maxStart = currentStart;
				}
			} else {
				current = 0;
			}
		}
		return { length: max, start: maxStart };
	}

	function avgLategamePosition(cards) {
		const positions = [];
		for (let i = 0; i < cards.length; i++) {
			if (isLategameCard(cards[i])) positions.push(i / cards.length);
		}
		return positions.length ? positions.reduce((a, b) => a + b, 0) / positions.length : 0;
	}

	function computeStats(mode) {
		const gens = generations[mode];
		if (!gens?.length) return { avgStreak: 0, avgLategamePos: 0 };
		const streaks = gens.map((cards) => longestTokenStreak(cards).length);
		const latePos = gens.map((cards) => avgLategamePosition(cards));
		return {
			avgStreak: (streaks.reduce((a, b) => a + b, 0) / streaks.length).toFixed(1),
			avgLategamePos: ((latePos.reduce((a, b) => a + b, 0) / latePos.length) * 100).toFixed(0)
		};
	}

	function generate() {
		distributionModes.forEach((m) => {
			generations[m] = Array.from({ length: nbGeneration }, () =>
				loadDeck(decks[selectedDeck], { ...options, distributionMode: m })
			);
			stats[m] = computeStats(m);
		});
	}

	function isInLongestStreak(cards, index) {
		const { length, start } = longestTokenStreak(cards);
		return index >= start && index < start + length && isTokenCard(cards[index]);
	}

	onMount(generate);
</script>

<div class="page">
	<header>
		<a href="/" class="back-link">
			<Icon icon="mdi:home" color="white" width="20" />
		</a>
		<h1>Compare distribution modes</h1>
	</header>

	<div class="controls">
		<div class="controls-inputs">
			<div class="field">
				<label for="deck-select">Deck</label>
				<select id="deck-select" bind:value={selectedDeck}>
					{#each deckNames as name (name)}
						<option value={name}>{name.replaceAll('_', ' ')}</option>
					{/each}
				</select>
			</div>
			<div class="field">
				<label for="nb-generations">Generations</label>
				<input id="nb-generations" bind:value={nbGeneration} type="number" />
			</div>
			<div class="field range-field">
				<label for="token-proportion">Token %</label>
				<div class="range-row">
					<input
						id="token-proportion"
						type="range"
						bind:value={tokenPercent}
						min="10"
						max="90"
						step="5"
					/>
					<span class="range-value">{tokenPercent}%</span>
				</div>
			</div>
			<div class="field range-field">
				<label for="biaised-shuffle">Shuffle bias</label>
				<div class="range-row">
					<input
						id="biaised-shuffle"
						type="range"
						bind:value={shuffleBias}
						min="0"
						max="100"
						step="10"
					/>
					<span class="range-value">{shuffleBias}%</span>
				</div>
			</div>
			<button class="refresh-btn" onclick={generate} type="button">
				<Icon icon="mdi:refresh" width="20" />
			</button>
		</div>
		<div class="legend">
			<span class="legend-title">Legend</span>
			<div class="legend-items">
				<div class="legend-item">
					<div class="card token"></div>
					<span>Token</span>
				</div>
				<div class="legend-item">
					<div class="card"></div>
					<span>Non-token</span>
				</div>
				<div class="legend-item">
					<div class="card lategame"></div>
					<span>Lategame (powerful cards, biased toward end)</span>
				</div>
				<div class="legend-item">
					<div class="card token longest-streak"></div>
					<span>Longest streak (longest sequence of consecutive tokens)</span>
				</div>
			</div>
		</div>
	</div>

	<div class="modes-grid">
		{#each distributionModes as mode (mode)}
			<div class="mode-panel">
				<h2>{@render chip(mode)}</h2>
				<p class="mode-description">{modeDescriptions[mode].text}</p>
				<div class="mode-pros-cons">
					<span class="pro">+ {modeDescriptions[mode].pros}</span>
					<span class="con">- {modeDescriptions[mode].cons}</span>
				</div>
				{#if stats[mode]}
					<div class="mode-stats">
						<span>Avg longest streak: <strong>{stats[mode].avgStreak}</strong></span>
						<span>Avg lategame pos: <strong>{stats[mode].avgLategamePos}%</strong></span>
					</div>
				{/if}
				{#each generations[mode] as cards, n (`${mode}_${n}`)}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div class="generation" onclick={() => (showGeneration = { mode, n })}>
						<span class="generation-label">Gen {n + 1}</span>
						<div class="card-row">
							{#each cards as card, i (i)}
								<div
									class="card"
									class:token={isTokenCard(card)}
									class:lategame={isLategameCard(card)}
									class:longest-streak={isInLongestStreak(cards, i)}
								></div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		{/each}
	</div>

	{#if showGeneration}
		{@const cards = generations[showGeneration.mode][showGeneration.n]}
		<div class="detail-panel">
			<div class="detail-header">
				<h2>{@render chip(showGeneration.mode)}</h2>
				<span class="detail-gen">Generation {showGeneration.n + 1}</span>
				<button class="close-btn" onclick={() => (showGeneration = undefined)}>
					<Icon icon="mdi:close" width="18" />
				</button>
			</div>
			<div class="detail-list">
				{#each cards as card, i (i)}
					<div class="detail-row" class:token-row={isTokenCard(card)}>
						<div
							class="card"
							class:token={isTokenCard(card)}
							class:lategame={isLategameCard(card)}
						></div>
						<span>{card.name}</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

{#snippet chip(mode)}
	<span class="chip">
		{mode.replaceAll('_', ' ')}
		{#if mode === 'geometric_boosted'}
			<Icon icon="mdi:star" width="14" />
		{/if}
	</span>
{/snippet}

<style>
	.page {
		min-height: 100%;
		background: #0a0a0f;
		background-image:
			radial-gradient(ellipse at 30% 20%, rgba(88, 28, 135, 0.15) 0%, transparent 60%),
			radial-gradient(ellipse at 70% 80%, rgba(30, 58, 138, 0.12) 0%, transparent 60%);
		color: white;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	header {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	header h1 {
		font-size: 1.25rem;
		font-weight: 700;
		letter-spacing: 0.5px;
	}

	.back-link {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 36px;
		min-height: 36px;
		border-radius: 8px;
		color: rgba(255, 255, 255, 0.6);
		transition:
			background 0.2s,
			color 0.2s;
	}

	.back-link:hover {
		background: rgba(255, 255, 255, 0.1);
		color: white;
	}

	/* Controls */
	.controls {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1.5rem;
		padding: 0.75rem;
		background: rgba(255, 255, 255, 0.06);
		backdrop-filter: blur(8px);
		border-radius: 8px;
	}

	.controls-inputs {
		display: flex;
		align-items: flex-end;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.field label {
		font-size: 0.7rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: rgba(255, 255, 255, 0.5);
	}

	.field input[type='number'],
	.field select {
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 6px;
		color: white;
		padding: 0.4rem 0.5rem;
		font-size: 0.85rem;
		width: 5rem;
		transition: border-color 0.2s;
	}

	.field select {
		width: auto;
		text-transform: capitalize;
		cursor: pointer;
	}

	.field select option {
		background: #1a1a2e;
		color: white;
	}

	.field input[type='number']:focus,
	.field select:focus {
		outline: none;
		border-color: cornflowerblue;
	}

	.range-field {
		min-width: 10rem;
	}

	.range-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.range-row input[type='range'] {
		flex: 1;
		accent-color: cornflowerblue;
	}

	.range-value {
		font-size: 0.8rem;
		font-weight: 600;
		color: white;
		min-width: 2.5rem;
		text-align: right;
	}

	.refresh-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		background: cornflowerblue;
		border: none;
		border-radius: 8px;
		color: white;
		cursor: pointer;
		transition: filter 0.2s;
	}

	.refresh-btn:hover {
		filter: brightness(1.15);
	}

	/* Legend */
	.legend {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.legend-title {
		font-size: 0.7rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: rgba(255, 255, 255, 0.5);
	}

	.legend-items {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.7);
	}

	/* Modes grid */
	.modes-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.75rem;
	}

	.mode-panel {
		background: rgba(255, 255, 255, 0.06);
		backdrop-filter: blur(8px);
		border-radius: 8px;
		padding: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		min-width: 0;
	}

	.mode-panel h2 {
		margin-bottom: 0.25rem;
	}

	.mode-description {
		font-size: 0.7rem;
		color: rgba(255, 255, 255, 0.4);
		line-height: 1.4;
		margin-bottom: 0.15rem;
	}

	.mode-pros-cons {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		font-size: 0.7rem;
		margin-bottom: 0.15rem;
	}

	.pro {
		color: #4ade80;
	}

	.con {
		color: #ef4444;
	}

	.mode-stats {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		font-size: 0.7rem;
		color: rgba(255, 255, 255, 0.5);
		padding-bottom: 0.35rem;
		margin-bottom: 0.1rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.mode-stats strong {
		color: rgba(255, 255, 255, 0.8);
	}

	.chip {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		background: rgba(100, 149, 237, 0.2);
		border: 1px solid rgba(100, 149, 237, 0.4);
		color: cornflowerblue;
		padding: 0.2rem 0.6rem;
		border-radius: 6px;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.generation {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		cursor: pointer;
		padding: 0.2rem 0.3rem;
		border-radius: 4px;
		transition: background 0.2s;
	}

	.generation:hover {
		background: rgba(255, 255, 255, 0.08);
	}

	.generation-label {
		font-size: 0.65rem;
		color: rgba(255, 255, 255, 0.4);
		font-weight: 500;
	}

	.card-row {
		display: flex;
		overflow-x: auto;
	}

	/* Cards */
	.card {
		width: 1rem;
		height: 1.5rem;
		margin: 1px;
		background: #22996e;
		border-radius: 2px;
	}

	.card.token {
		width: 0.5rem;
		background: #ef4444;
	}

	.card.token.longest-streak {
		background: #fbbf24;
		box-shadow: 0 0 4px rgba(251, 191, 36, 0.6);
	}

	.card.lategame::after {
		content: '💀';
		font-size: 0.85rem;
	}

	/* Detail panel */
	.detail-panel {
		background: rgba(255, 255, 255, 0.06);
		backdrop-filter: blur(8px);
		border-radius: 8px;
		padding: 0.75rem;
		margin-top: 0.5rem;
	}

	.detail-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.5rem;
	}

	.detail-gen {
		font-size: 0.85rem;
		color: rgba(255, 255, 255, 0.6);
		font-weight: 500;
	}

	.close-btn {
		margin-left: auto;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 6px;
		color: rgba(255, 255, 255, 0.6);
		cursor: pointer;
		transition:
			background 0.2s,
			color 0.2s;
	}

	.close-btn:hover {
		background: rgba(255, 255, 255, 0.15);
		color: white;
	}

	.detail-list {
		display: flex;
		flex-direction: column;
	}

	.detail-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.15rem 0;
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.8);
	}

	.detail-row.token-row:not(:has(+ .token-row)) {
		border-bottom: 1px solid rgba(255, 255, 255, 0.15);
		padding-bottom: 0.35rem;
		margin-bottom: 0.2rem;
	}
</style>
