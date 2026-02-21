<script>
	import { game as G } from '../game';

	const TYPE_META = {
		token: { color: 'var(--color-danger)', height: 6, width: 3 },
		creature: { color: 'var(--color-primary-500)', height: 14, width: 5 },
		sorcery: { color: 'var(--color-sorcery)', height: 20, width: 5 },
		instant: { color: 'var(--color-instant)', height: 16, width: 5 },
		enchantment: { color: 'var(--color-enchantment)', height: 18, width: 5 },
		other: { color: 'rgba(255,255,255,0.35)', height: 10, width: 5 }
	};

	const history = $derived(G.state.horde.drawHistory);

	let scrollEl = $state(null);

	$effect(() => {
		if (history.length && scrollEl) {
			requestAnimationFrame(() => {
				scrollEl.scrollLeft = scrollEl.scrollWidth;
			});
		}
	});
</script>

{#if history.length > 0}
	<div class="turn-history">
		<span class="label">Turn history</span>
		<div class="scroll-area" bind:this={scrollEl}>
			{#each history as turn, i (i)}
				<div
					class="turn-group"
					title="Turn {i + 1} — {turn.length} card{turn.length > 1 ? 's' : ''}"
				>
					<div class="bars">
						{#each turn as type, j (`${i}-${j}`)}
							{@const meta = TYPE_META[type] ?? TYPE_META.other}
							<div
								class="bar"
								style="height:{meta.height}px;width:{meta.width}px;background:{meta.color};box-shadow:0 0 3px color-mix(in srgb,{meta.color} 40%,transparent)"
							></div>
						{/each}
					</div>
					<span class="turn-num">{i + 1}</span>
				</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	.turn-history {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 0.75rem 0.3rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
		background: rgba(0, 0, 0, 0.35);
		backdrop-filter: blur(8px);
	}

	.label {
		font-size: 0.6rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 1.5px;
		color: rgba(255, 255, 255, 0.25);
		white-space: nowrap;
	}

	.scroll-area {
		display: flex;
		align-items: flex-end;
		gap: 3px;
		overflow-x: auto;
		flex: 1;
		scrollbar-width: none;
	}

	.scroll-area::-webkit-scrollbar {
		display: none;
	}

	.turn-group {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		flex-shrink: 0;
		cursor: default;
	}

	.bars {
		display: flex;
		align-items: flex-end;
		gap: 1px;
	}

	.bar {
		border-radius: 1px 1px 0 0;
		transition: filter 0.15s;
	}

	.turn-group:hover .bar {
		filter: brightness(1.3);
	}

	.turn-num {
		font-size: 0.5rem;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.2);
		line-height: 1;
		letter-spacing: 0.5px;
	}
</style>
