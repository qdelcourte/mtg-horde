<script>
	import Icon from '@iconify/svelte';

	import { game as G } from '../game';
	import { PHASES, STAGES } from '../game/phases';
	import Pulse from './Pulse.svelte';

	const isHordeTurn = $derived(G.state.turn.activePlayer === 0);
	const isSurvivorsTurn = $derived(G.state.turn.activePlayer === 1);
	const inFight = $derived(G.state.turn.phase === PHASES.fightTheHorde);
	const hordeDeckSize = $derived(G.state.horde.deck.length);
</script>

<div id="score" class="flex items-center justify-center gap-3 px-4 py-2 text-white select-none">
	<!-- Undo -->
	<button class="icon-btn" class:disabled={!G.canUndo} onclick={() => G.undo()} aria-label="undo">
		<Icon icon="mdi:arrow-u-left-top" width="18" />
	</button>

	<!-- Horde -->
	<div class="player-zone" class:active={isHordeTurn}>
		<div class="flex items-center gap-1">
			<Icon icon="mdi:skull" width="14" class="text-white/40" />
			<span class="text-xs font-semibold tracking-[1px] text-white/40 uppercase">Horde</span>
		</div>
		<Pulse class="text-3xl leading-none font-bold tracking-[-0.5px]" value={G.hordeLife} />
		<div class="life-controls">
			{#if hordeDeckSize >= 5}
				<button class="life-btn minus" onclick={() => G.moves.putCardsInHordeGraveyardFromDeck(5)}
					>-5</button
				>
			{/if}
			{#if hordeDeckSize >= 1}
				<button class="life-btn minus" onclick={() => G.moves.putCardsInHordeGraveyardFromDeck(1)}
					>-1</button
				>
			{/if}
		</div>
	</div>

	<!-- Center -->
	<div class="flex w-30 flex-col items-center gap-1.5">
		{#if inFight && G.state.turn.stage}
			{#if G.state.turn.stage === STAGES.draw && isHordeTurn}
				<button class="action-btn draw" onclick={() => G.moves.stageHordeDraw()}>
					<Icon icon="mdi:cards-outline" width="16" />
					Draw
				</button>
			{:else if G.state.turn.stage === STAGES.attack && isHordeTurn}
				<button class="action-btn attack" onclick={() => G.moves.stageHordeAttackEnd()}>
					<Icon icon="mdi:sword" width="16" />
					Attack End
				</button>
			{/if}
		{/if}
		{#if inFight && isSurvivorsTurn}
			<button class="action-btn end-turn" onclick={() => G.moves.stageSurvivorsEndTurn()}>
				<Icon icon="mdi:flag-checkered" width="16" />
				End Turn
			</button>
		{/if}
		<div class="flex items-baseline gap-1.5">
			<span class="text-xs font-semibold tracking-[1px] text-white/35 uppercase">Turn</span>
			<Pulse class="text-sm font-bold text-white/60" value={G.state.turn.current} />
		</div>
	</div>

	<!-- Survivors -->
	<div class="player-zone" class:active={isSurvivorsTurn}>
		<div class="flex items-center gap-1">
			<Icon icon="mdi:shield-account" width="14" class="text-white/40" />
			<span class="text-xs font-semibold tracking-[1px] text-white/40 uppercase">Survivors</span>
		</div>
		<Pulse
			class="text-3xl leading-none font-bold tracking-[-0.5px]"
			value={G.state.survivors.life}
		/>
		<div class="life-controls">
			<button class="life-btn minus" onclick={() => G.moves.survivorsChangeLife(-5)}>-5</button>
			<button class="life-btn minus" onclick={() => G.moves.survivorsChangeLife(-1)}>-1</button>
			<button class="life-btn plus" onclick={() => G.moves.survivorsChangeLife(1)}>+1</button>
			<button class="life-btn plus" onclick={() => G.moves.survivorsChangeLife(5)}>+5</button>
		</div>
	</div>

	<!-- Redo -->
	<button class="icon-btn" class:disabled={!G.canRedo} onclick={() => G.redo()} aria-label="redo">
		<Icon icon="mdi:arrow-u-right-top" width="18" />
	</button>
</div>

<style>
	.icon-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		border: none;
		background: rgba(255, 255, 255, 0.08);
		color: rgba(255, 255, 255, 0.5);
		cursor: pointer;
		transition: all 0.2s;
	}

	.icon-btn:hover:not(.disabled) {
		background: rgba(255, 255, 255, 0.15);
		color: white;
	}

	.icon-btn.disabled {
		opacity: 0.2;
		cursor: default;
		pointer-events: none;
	}

	/* Player zones */
	.player-zone {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.15rem;
		padding: 0.5rem 1rem;
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.06);
		position: relative;
		transition: all 0.3s;
		min-width: 6.5rem;
		width: 6.5rem;
	}

	.player-zone::before {
		content: '';
		position: absolute;
		top: -1.5rem;
		left: 0;
		right: 0;
		height: 1.5rem;
	}

	.player-zone.active {
		background: color-mix(in srgb, var(--color-primary-500) 10%, transparent);
		border-color: color-mix(in srgb, var(--color-primary-500) 40%, transparent);
		box-shadow: 0 0 12px color-mix(in srgb, var(--color-primary-500) 15%, transparent);
	}

	/* Life controls (hover reveal) */
	.life-controls {
		display: flex;
		gap: 2px;
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		opacity: 0;
		pointer-events: none;
		transition:
			opacity 0.2s,
			top 0.2s;
	}

	.player-zone:hover .life-controls {
		opacity: 1;
		top: -0.25rem;
		pointer-events: all;
	}

	.life-btn {
		border: none;
		color: white;
		font-size: 0.7rem;
		font-weight: 700;
		padding: 0.2rem 0.45rem;
		border-radius: 4px;
		cursor: pointer;
		transition: filter 0.2s;
	}

	.life-btn:hover {
		filter: brightness(1.3);
	}

	.life-btn.minus {
		background: color-mix(in srgb, var(--color-danger) 75%, transparent);
	}

	.life-btn.plus {
		background: color-mix(in srgb, var(--color-primary-500) 75%, transparent);
	}

	/* Action buttons */
	.action-btn {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		border: none;
		color: white;
		font-size: 0.8rem;
		font-weight: 600;
		padding: 0.35rem 0.85rem;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s;
		white-space: nowrap;
	}

	.action-btn.draw {
		background: color-mix(in srgb, var(--color-primary-500) 80%, transparent);
	}

	.action-btn.draw:hover {
		background: var(--color-primary-500);
	}

	.action-btn.attack {
		background: color-mix(in srgb, var(--color-danger) 75%, transparent);
	}

	.action-btn.attack:hover {
		background: color-mix(in srgb, var(--color-danger) 95%, transparent);
	}

	.action-btn.end-turn {
		background: color-mix(in srgb, var(--color-turn-end) 70%, transparent);
	}

	.action-btn.end-turn:hover {
		background: color-mix(in srgb, var(--color-turn-end) 90%, transparent);
	}
</style>
