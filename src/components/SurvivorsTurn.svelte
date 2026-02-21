<script>
	import Icon from '@iconify/svelte';
	import { fly } from 'svelte/transition';

	import { game as G } from '../game';

	const isLast = $derived(
		G.state.turn.currentInitialSurvivorTurn === G.state.config.nbInitialSurvivorsTurn
	);
</script>

<div
	class="flex flex-1 flex-col items-center justify-center gap-6 bg-black/40 text-center text-white"
	in:fly={{ y: 100, duration: 700 }}
	out:fly={{ y: -100, duration: 500 }}
>
	<Icon icon="mdi:shield-sword" color="rgba(255,255,255,0.15)" width="80" />
	<div class="text-xl font-semibold tracking-[2px] text-white/60 uppercase">Survivors turn</div>
	<div class="flex items-baseline gap-1">
		<span class="current text-4xl leading-none font-bold text-white"
			>{G.state.turn.currentInitialSurvivorTurn}</span
		>
		<span class="mx-0.5 text-4xl font-light text-white/30">/</span>
		<span class="text-xl font-medium text-white/50">{G.state.config.nbInitialSurvivorsTurn}</span>
	</div>
	<button
		class="bg-primary-500 flex cursor-pointer items-center gap-2 rounded-lg border-none px-6 py-2.5 text-base font-semibold text-white transition-[filter] duration-200 hover:brightness-[1.15]"
		onclick={() => G.moves.nextInitialTurn()}
	>
		<Icon icon={isLast ? 'mdi:sword-cross' : 'mdi:arrow-right'} width="20" />
		{isLast ? 'Fight !' : 'Next turn'}
	</button>
</div>

<style>
	.current {
		text-shadow: 0 0 20px color-mix(in srgb, var(--color-primary-500) 50%, transparent);
	}
</style>
