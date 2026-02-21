<script>
	import Icon from '@iconify/svelte';
	import { untrack } from 'svelte';

	import decks from '../decks/index.js';
	import RangeInput from './components/RangeInput.svelte';
	import { isLategameCard, isTokenCard, loadDeck } from './game/helpers.js';

	const distributionModes = ['geometric', 'geometric_boosted', 'random'];
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
		}
	};
	const deckNames = Object.keys(decks);

	let selectedDeck = $state(deckNames[0]);
	let tokenPercent = $state(60);
	let shuffleBias = $state(80);
	let nbSurvivors = $state(4);
	let nbGeneration = $state(6);
	let generations = $state({});
	let showGeneration = $state();
	let stats = $state({});

	const options = $derived({
		nbSurvivors,
		tokenPercentage: tokenPercent / 100,
		shuffleBiasFactor: shuffleBias / 100
	});

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

	function isInLongestStreak(cards, index) {
		const { length, start } = longestTokenStreak(cards);
		return index >= start && index < start + length && isTokenCard(cards[index]);
	}

	$effect(() => {
		if (selectedDeck && nbGeneration && nbSurvivors && shuffleBias && tokenPercent) {
			untrack(() => {
				showGeneration = undefined;
				distributionModes.forEach((m) => {
					generations[m] = Array.from({ length: nbGeneration }, () =>
						loadDeck(decks[selectedDeck], { ...options, distributionMode: m })
					);
					stats[m] = computeStats(m);
				});
			});
		}
	});
</script>

<div class="page flex min-h-full flex-col gap-4 p-6 text-white">
	<header class="flex items-center gap-4">
		<a
			href="/"
			class="flex min-h-9 min-w-9 items-center justify-center rounded-lg text-white/60 transition-colors duration-200 hover:bg-white/10 hover:text-white"
		>
			<Icon icon="mdi:home" color="white" width="20" />
		</a>
		<h1 class="text-xl font-bold tracking-[0.5px]">Compare distribution modes</h1>
	</header>

	<div class="flex items-start justify-between gap-6 rounded-lg bg-white/6 p-3 backdrop-blur-sm">
		<div class="flex flex-wrap items-end gap-3">
			<div class="field flex flex-col gap-1">
				<label for="deck-select">Deck</label>
				<select id="deck-select" bind:value={selectedDeck}>
					{#each deckNames as name (name)}
						<option value={name}>{name.replaceAll('_', ' ')}</option>
					{/each}
				</select>
			</div>
			<div class="field flex flex-col gap-1">
				<label for="nb-survivors">Survivors</label>
				<input id="nb-survivors" bind:value={nbSurvivors} type="number" min="1" max="10" />
			</div>
			<div class="field flex flex-col gap-1">
				<label for="nb-generations">Generations</label>
				<input id="nb-generations" bind:value={nbGeneration} type="number" min="1" max="20" />
			</div>
			<div class="field flex min-w-40 flex-col gap-1">
				<label for="token-proportion">Token %</label>
				<div class="flex items-center gap-3">
					<RangeInput id="token-proportion" bind:value={tokenPercent} min={10} max={90} step={5} />
					<span class="min-w-10 text-right text-sm font-semibold text-white">{tokenPercent}%</span>
				</div>
			</div>
			<div class="field flex min-w-40 flex-col gap-1">
				<label for="biaised-shuffle">Shuffle bias</label>
				<div class="flex items-center gap-3">
					<RangeInput id="biaised-shuffle" bind:value={shuffleBias} max={100} step={10} />
					<span class="min-w-10 text-right text-sm font-semibold text-white">{shuffleBias}%</span>
				</div>
			</div>
		</div>
		<div class="flex flex-col gap-1.5">
			<span class="text-xs font-medium tracking-[0.5px] text-white/50 uppercase">Legend</span>
			<div class="flex flex-col gap-1">
				<div class="flex items-center gap-1.5 text-xs text-white/70">
					<div class="card token"></div>
					<span>Token</span>
				</div>
				<div class="flex items-center gap-1.5 text-xs text-white/70">
					<div class="card"></div>
					<span>Non-token</span>
				</div>
				<div class="flex items-center gap-1.5 text-xs text-white/70">
					<div class="card lategame"></div>
					<span>Lategame</span>
				</div>
				<div class="flex items-center gap-1.5 text-xs text-white/70">
					<div class="card token longest-streak"></div>
					<span>Longest streak (longest sequence of consecutive tokens)</span>
				</div>
			</div>
		</div>
	</div>

	<div class="grid grid-cols-3 gap-3">
		{#each distributionModes as mode (mode)}
			<div class="flex min-w-0 flex-col gap-1.5 rounded-lg bg-white/6 p-3 backdrop-blur-sm">
				<h2 class="mb-1">{@render chip(mode)}</h2>
				<p class="mb-0.5 text-xs leading-[1.4] text-white/40">
					{modeDescriptions[mode].text}
				</p>
				<div class="mb-0.5 flex flex-col gap-0.5 text-xs">
					<span class="text-(--color-enchantment)">+ {modeDescriptions[mode].pros}</span>
					<span class="text-danger">- {modeDescriptions[mode].cons}</span>
				</div>
				{#if stats[mode]}
					<div
						class="mode-stats mb-0.5 flex flex-col gap-0.5 border-b border-white/10 pb-1.5 text-xs text-white/50"
					>
						<span>Avg longest streak: <strong>{stats[mode].avgStreak}</strong></span>
						<span>Avg lategame pos: <strong>{stats[mode].avgLategamePos}%</strong></span>
					</div>
				{/if}
				{#each generations[mode] as cards, n (`${mode}_${n}`)}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						class="flex cursor-pointer flex-col gap-0.5 rounded px-1 py-0.5 transition-colors duration-200 hover:bg-white/8"
						onclick={() => (showGeneration = { mode, n })}
					>
						<span class="text-xs font-medium text-white/40">Gen {n + 1}</span>
						<div class="flex overflow-x-auto">
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
		<div class="mt-2 rounded-lg bg-white/6 p-3 backdrop-blur-sm">
			<div class="mb-2 flex items-center gap-3">
				<h2 class="mb-0">{@render chip(showGeneration.mode)}</h2>
				<span class="text-sm font-medium text-white/60">Generation {showGeneration.n + 1}</span>
				<button
					class="ml-auto flex size-7 cursor-pointer items-center justify-center rounded-md border border-white/15 bg-white/8 text-white/60 transition-colors duration-200 hover:bg-white/15 hover:text-white"
					onclick={() => (showGeneration = undefined)}
				>
					<Icon icon="mdi:close" width="18" />
				</button>
			</div>
			<div class="flex flex-col">
				{#each cards as card, i (i)}
					<div
						class="detail-row flex items-center gap-2 py-0.5 text-sm text-white/80"
						class:token-row={isTokenCard(card)}
					>
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
		background: var(--color-bg-base);
		background-image:
			radial-gradient(
				ellipse at 30% 20%,
				color-mix(in srgb, var(--color-primary-800) 15%, transparent) 0%,
				transparent 60%
			),
			radial-gradient(
				ellipse at 70% 80%,
				color-mix(in srgb, var(--color-primary-900) 12%, transparent) 0%,
				transparent 60%
			);
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
		background: var(--color-bg-dropdown);
		color: white;
	}

	.field input[type='number']:focus,
	.field select:focus {
		outline: none;
		border-color: var(--color-primary-500);
	}

	.chip {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		background: color-mix(in srgb, var(--color-primary-500) 20%, transparent);
		border: 1px solid color-mix(in srgb, var(--color-primary-500) 40%, transparent);
		color: var(--color-primary-500);
		padding: 0.2rem 0.6rem;
		border-radius: 6px;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	/* Card visualizations */
	.card {
		width: 1rem;
		height: 1.5rem;
		margin: 1px;
		background: #22996e;
		border-radius: 2px;
	}

	.card.token {
		width: 0.5rem;
		background: var(--color-danger);
	}

	.card.token.longest-streak {
		background: var(--color-warning);
		box-shadow: 0 0 4px color-mix(in srgb, var(--color-warning) 60%, transparent);
	}

	.card.lategame::after {
		content: '💀';
		font-size: 0.85rem;
	}

	.mode-stats strong {
		color: rgba(255, 255, 255, 0.8);
	}

	.detail-row.token-row:not(:has(+ .token-row)) {
		border-bottom: 1px solid rgba(255, 255, 255, 0.15);
		padding-bottom: 0.35rem;
		margin-bottom: 0.2rem;
	}
</style>
