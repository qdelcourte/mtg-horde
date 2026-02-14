<script>
	import Icon from '@iconify/svelte';

	import zombie_original from '../decks/zombie_original.json';
	import { isLategameCard, isTokenCard, loadDeck } from './gameHelpers.js';

	const distributionModes = ['geometric', 'geometric_boosted', 'random'];

	let options = $state({
		nbSurvivors: 4,
		tokenPercentage: 0.6,
		shuffleBiasFactor: 0.8
	});

	let nbGeneration = $state(15);
	let generations = $state({});
	let now = $state(Date.now());

	let showGeneration = $state();

	$effect(() => {
		if (now) {
			distributionModes.forEach((m) => {
				generations[m] = Array.from({ length: nbGeneration }, () =>
					loadDeck(zombie_original, { ...options, distributionMode: m })
				);
			});
		}
	});
</script>

<div class="p-4">
	<h1 class="text-center text-2xl font-bold">Compare distribution modes</h1>
	<a href="/"><Icon icon="mdi:home" width="30" /></a>

	<div class="mb-2 flex items-center justify-between">
		<div>
			<label for="nb-generations">Nb generations</label>
			<input id="nb-generations" bind:value={nbGeneration} type="number" />

			<label for="nb-survivors">Nb survivors</label>
			<input id="nb-survivors" bind:value={options.nbSurvivors} type="number" min="1" />

			<label for="token-proportion">Token proportion</label>
			<input
				id="token-proportion"
				bind:value={options.tokenPercentage}
				type="number"
				max="1"
				min="0"
				step="0.1"
			/>

			<label for="biaised-shuffle">Shuffle bias factor</label>
			<input
				id="biaised-shuffle"
				bind:value={options.shuffleBiasFactor}
				type="number"
				min="0"
				max="1"
				step="0.1"
			/>

			<button
				onclick={() => (now = Date.now())}
				class="ml-2 relative align-middle transition-all disabled:opacity-50 w-10 max-w-10 h-10 max-h-10 rounded-lg text-xs border border-gray-900 text-gray-900 hover:opacity-50 focus:ring-3 focus:ring-gray-300 active:opacity-[0.85]"
				type="button"
			>
				<span class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
					><Icon icon="mdi:refresh" width="20" /></span
				>
			</button>
		</div>
		<div>
			<p class="underline">Legend:</p>
			<ul>
				<li class="flex items-center gap-2">
					<div class="card token"></div>
					Token card
				</li>
				<li class="flex items-center gap-2">
					<div class="card"></div>
					Non token card
				</li>
				<li class="flex items-center gap-2">
					<div class="card lategame"></div>
					Lategame card
				</li>
			</ul>
		</div>
	</div>

	<div class="grid grid-cols-3 gap-2">
		{#each distributionModes as mode (mode)}
			<div class="p-4 bg-white shadow-md bg-clip-border rounded-xl">
				<h2 class="m-1">{@render chip(mode)}</h2>
				{#each generations[mode] as cards, n (n)}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
					<h3 class="underline cursor-pointer" onclick={() => (showGeneration = { mode, n })}>
						Generation {n + 1}
					</h3>
					<div class="flex">
						{#each cards as card (card.id)}
							<div
								class="card"
								class:token={isTokenCard(card)}
								class:lategame={isLategameCard(card)}
							></div>
						{/each}
					</div>
				{/each}
			</div>
		{/each}
	</div>

	{#if showGeneration}
		{@const cards = generations[showGeneration.mode][showGeneration.n]}
		<div id="generation-detail" class="p-4 bg-white shadow-md bg-clip-border rounded-xl">
			<h2 class="m-1">{@render chip(showGeneration.mode)}</h2>
			<h3 class="underline">Generation {showGeneration.n + 1}</h3>
			<div>
				{#each cards as card (card.id)}
					<div class="flex gap-2" class:token={isTokenCard(card)}>
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

{#snippet chip(text)}
	<div
		class="relative grid select-none items-center whitespace-nowrap rounded-lg bg-gray-500 py-2 px-2 font-sans text-sm font-bold uppercase text-white"
	>
		<span class="">{text}</span>
	</div>
{/snippet}

<style lang="postcss">
	@reference "./app.css";

	:global(body) {
		@apply bg-slate-100;
	}

	.card {
		width: 1rem;
		height: 1.5rem;
		@apply bg-green-600 m-px;

		&.token {
			width: 0.5rem;
			@apply bg-red-600;
		}

		&.lategame::after {
			content: '💀';
			font-size: 0.85rem;
		}
	}

	#generation-detail {
		.token:not(:has(+ .token)) {
			border-bottom: 2px solid black;
		}
	}
</style>
