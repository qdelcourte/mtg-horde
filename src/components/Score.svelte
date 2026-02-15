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

<div id="score" class="select-none">
	<!-- Undo -->
	<button class="icon-btn" class:disabled={!G.canUndo} onclick={() => G.undo()} aria-label="undo">
		<Icon icon="mdi:arrow-u-left-top" width="18" />
	</button>

	<!-- Horde -->
	<div class="player-zone" class:active={isHordeTurn}>
		<div class="player-header">
			<Icon icon="mdi:skull" width="14" class="player-icon" />
			<span class="player-label">Horde</span>
		</div>
		<Pulse class="life-value" value={G.hordeLife} />
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
	<div class="center-zone">
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
		<div class="turn-indicator">
			<span class="turn-label">Turn</span>
			<Pulse class="turn-value" value={G.state.turn.current} />
		</div>
	</div>

	<!-- Survivors -->
	<div class="player-zone" class:active={isSurvivorsTurn}>
		<div class="player-header">
			<Icon icon="mdi:shield-account" width="14" class="player-icon" />
			<span class="player-label">Survivors</span>
		</div>
		<Pulse class="life-value" value={G.state.survivors.life} />
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
	#score {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		padding: 0.5rem 1rem;
		color: white;
	}

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
		background: rgba(100, 149, 237, 0.1);
		border-color: rgba(100, 149, 237, 0.4);
		box-shadow: 0 0 12px rgba(100, 149, 237, 0.15);
	}

	.player-header {
		display: flex;
		align-items: center;
		gap: 0.3rem;
	}

	:global(.player-icon) {
		color: rgba(255, 255, 255, 0.4);
	}

	.player-label {
		font-size: 0.65rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 1px;
		color: rgba(255, 255, 255, 0.4);
	}

	:global(.life-value) {
		font-size: 1.75rem;
		font-weight: 700;
		line-height: 1;
		letter-spacing: -0.5px;
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
		background: rgba(239, 68, 68, 0.75);
	}

	.life-btn.plus {
		background: rgba(34, 197, 94, 0.75);
	}

	/* Center zone */
	.center-zone {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.35rem;
		width: 7.5rem;
	}

	.turn-indicator {
		display: flex;
		align-items: baseline;
		gap: 0.35rem;
	}

	.turn-label {
		font-size: 0.65rem;
		text-transform: uppercase;
		letter-spacing: 1px;
		color: rgba(255, 255, 255, 0.35);
		font-weight: 600;
	}

	:global(.turn-value) {
		font-size: 0.9rem;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.6);
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
		background: rgba(100, 149, 237, 0.8);
	}

	.action-btn.draw:hover {
		background: rgba(100, 149, 237, 1);
	}

	.action-btn.attack {
		background: rgba(239, 68, 68, 0.75);
	}

	.action-btn.attack:hover {
		background: rgba(239, 68, 68, 0.95);
	}

	.action-btn.end-turn {
		background: rgba(168, 139, 250, 0.7);
	}

	.action-btn.end-turn:hover {
		background: rgba(168, 139, 250, 0.9);
	}
</style>
