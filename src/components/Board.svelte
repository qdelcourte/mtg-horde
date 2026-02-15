<script>
	import Icon from '@iconify/svelte';
	import { Badge } from 'flowbite-svelte';
	import { fly } from 'svelte/transition';

	import { game as G } from '../game';
	import { PHASES } from '../game/phases';
	import AddTokenModal from './AddTokenModal.svelte';
	import AlertToast from './AlertToast.svelte';
	import Battlefield from './Battlefield.svelte';
	import GameInfo from './GameInfo.svelte';
	import GraveyardModal from './GraveyardModal.svelte';
	import OffCardDetails from './OffCardDetails.svelte';
	import Pulse from './Pulse.svelte';
	import Score from './Score.svelte';
	import SettingsModal from './SettingsModal.svelte';
	import Toolbar from './Toolbar.svelte';

	let cardDetailsRef;
	let graveyardModalRef;
	let alertToastRef;
	let gameInfoRef = $state();
	let settingsModalRef = $state();
	let addTokenModalRef = $state();

	const inGame = $derived(G.state.turn.phase === PHASES.fightTheHorde);
	const gameover = $derived(G.state.turn.gameover);
	const survivorsWin = $derived(gameover?.winner?.includes('Survivors'));

	$effect(() => {
		if (settingsModalRef && !G.state.turn.phase) settingsModalRef.show();
	});

	function onSave() {
		G.savepointInLocalStorage();
		alertToastRef.alert('Savepoint !');
	}

	function onRestore() {
		try {
			G.restoreSavepointFromLocalStorage();
			alertToastRef.alert('Savepoint restored !');
		} catch (e) {
			alertToastRef.alert(e.message);
		}
	}
</script>

<GameInfo bind:this={gameInfoRef} />
<OffCardDetails bind:this={cardDetailsRef} />
<GraveyardModal bind:this={graveyardModalRef} />
<SettingsModal bind:this={settingsModalRef} permanent={!G.state.turn.phase} />
<AlertToast bind:this={alertToastRef} />
<AddTokenModal bind:this={addTokenModalRef} />

<div id="game" class="h-full overflow-hidden">
	<div id="side-panel">
		<div class="zone-row" class:disabled={!inGame}>
			<Icon icon="mdi:cards" color="white" width="20" />
			<span class="zone-label">Horde</span>
			<Badge large><Pulse value={G.state.horde.deck.length} /></Badge>
		</div>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="zone-row"
			class:clickable={inGame && G.state.horde.graveyard.length > 0}
			class:disabled={!inGame || G.state.horde.graveyard.length === 0}
			onclick={() => inGame && G.state.horde.graveyard.length > 0 && graveyardModalRef.show()}
		>
			<Icon icon="mdi:grave-stone" color="white" width="20" />
			<span class="zone-label">Graveyard</span>
			<Badge large><Pulse value={G.state.horde.graveyard.length} /></Badge>
		</div>
		<div class="zone-row damage" class:disabled={!inGame}>
			<Icon icon="mdi:sword-cross" color="white" width="20" />
			<span class="zone-label">Damage</span>
			<Pulse
				value={G.hordeDamage}
				class="text-xl font-bold text-[#ef4444] text-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
			/>
		</div>
		<div class="legend">
			<div class="legend-item">
				<span class="legend-dot sorcery"></span>
				<span class="legend-text">Sorcery</span>
			</div>
			<div class="legend-item">
				<span class="legend-dot instant"></span>
				<span class="legend-text">Instant</span>
			</div>
			<div class="legend-item">
				<span class="legend-dot enchantment"></span>
				<span class="legend-text">Enchantment</span>
			</div>
		</div>
		<Toolbar {gameInfoRef} {onRestore} {onSave} {addTokenModalRef} {settingsModalRef} />
	</div>

	<div id="main-content">
		{#if G.state.turn.phase === PHASES.initialSurvivorsTurns}
			<div id="survivors-turns" in:fly={{ y: 100, duration: 700 }}>
				<Icon icon="mdi:shield-sword" color="rgba(255,255,255,0.15)" width="80" />
				<div class="survivors-label">Survivors turn</div>
				<div class="survivors-counter">
					<span class="survivors-current">{G.state.turn.currentInitialSurvivorTurn}</span>
					<span class="survivors-separator">/</span>
					<span class="survivors-total">{G.state.config.nbInitialSurvivorsTurn}</span>
				</div>
				<button class="survivors-btn" onclick={() => G.moves.nextInitialTurn()}>
					<Icon
						icon={G.state.turn.currentInitialSurvivorTurn === G.state.config.nbInitialSurvivorsTurn
							? 'mdi:sword-cross'
							: 'mdi:arrow-right'}
						width="20"
					/>
					{G.state.turn.currentInitialSurvivorTurn === G.state.config.nbInitialSurvivorsTurn
						? 'Fight !'
						: 'Next turn'}
				</button>
			</div>
		{:else if G.state.turn.phase === PHASES.fightTheHorde}
			<div id="battlefield">
				<Battlefield onCardClick={(card) => cardDetailsRef.show(card)} />
			</div>

			<div id="footer" in:fly={{ y: 50, duration: 500 }}>
				<Score />
			</div>
		{/if}
	</div>

	{#if gameover}
		<div class="gameover-overlay" class:win={survivorsWin} class:lose={!survivorsWin}>
			<div class="gameover-flash"></div>
			<div class="gameover-content">
				<Icon
					icon={survivorsWin ? 'mdi:trophy' : 'mdi:skull'}
					width="64"
					color={survivorsWin ? '#fbbf24' : '#ef4444'}
				/>
				<div class="gameover-title">{survivorsWin ? 'Victory' : 'Defeat'}</div>
				<div class="gameover-subtitle">{gameover.winner}</div>
				<button class="gameover-btn" onclick={() => settingsModalRef.show()}>
					<Icon icon="mdi:restart" width="20" />
					New Game
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	#game {
		display: grid;
		grid-template-columns: max-content 1fr;
		background: #0a0a0f;
		background-image:
			radial-gradient(ellipse at 30% 20%, rgba(88, 28, 135, 0.15) 0%, transparent 60%),
			radial-gradient(ellipse at 70% 80%, rgba(30, 58, 138, 0.12) 0%, transparent 60%),
			radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.02) 0%, transparent 80%);
	}

	#side-panel {
		background: rgba(255, 255, 255, 0.06);
		backdrop-filter: blur(8px);
		padding: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		height: 100%;
		overflow-y: auto;
	}

	#main-content {
		position: relative;
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
	}

	#survivors-turns {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1.5rem;
		flex: 1;
		color: white;
		text-align: center;
		background: rgba(0, 0, 0, 0.4);
	}

	.survivors-label {
		font-size: 1.1rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 2px;
		color: rgba(255, 255, 255, 0.6);
	}

	.survivors-counter {
		display: flex;
		align-items: baseline;
		gap: 0.25rem;
	}

	.survivors-current {
		font-size: 3.5rem;
		font-weight: 700;
		line-height: 1;
		color: white;
		text-shadow: 0 0 20px rgba(100, 149, 237, 0.5);
	}

	.survivors-separator {
		font-size: 2rem;
		font-weight: 300;
		color: rgba(255, 255, 255, 0.3);
		margin: 0 0.15rem;
	}

	.survivors-total {
		font-size: 1.5rem;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.5);
	}

	.survivors-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: cornflowerblue;
		color: white;
		border: none;
		border-radius: 8px;
		padding: 0.65rem 1.5rem;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: filter 0.2s;
	}

	.survivors-btn:hover {
		filter: brightness(1.15);
	}

	/* Game Over overlay */
	.gameover-overlay {
		position: absolute;
		inset: 0;
		z-index: 50;
		display: flex;
		align-items: center;
		justify-content: center;
		animation: overlayIn 0.8s ease-out forwards;
	}

	.gameover-overlay.win {
		background: radial-gradient(
			ellipse at center,
			rgba(251, 191, 36, 0.15),
			rgba(0, 0, 0, 0.85) 70%
		);
	}

	.gameover-overlay.lose {
		background: radial-gradient(ellipse at center, rgba(239, 68, 68, 0.2), rgba(0, 0, 0, 0.85) 70%);
	}

	.gameover-flash {
		position: absolute;
		inset: 0;
		animation: gameoverFlash 1s ease-out forwards;
	}

	.gameover-overlay.win .gameover-flash {
		background: radial-gradient(ellipse at center, rgba(251, 191, 36, 0.4), transparent 60%);
	}

	.gameover-overlay.lose .gameover-flash {
		background: radial-gradient(ellipse at center, rgba(239, 68, 68, 0.4), transparent 60%);
	}

	.gameover-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		animation: contentIn 0.6s 0.3s ease-out both;
	}

	.gameover-title {
		font-size: 3rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 4px;
		color: white;
		text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
	}

	.gameover-subtitle {
		font-size: 1rem;
		color: rgba(255, 255, 255, 0.6);
		font-weight: 500;
	}

	.gameover-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: cornflowerblue;
		color: white;
		border: none;
		border-radius: 8px;
		padding: 0.65rem 1.5rem;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: filter 0.2s;
		margin-top: 1rem;
	}

	.gameover-btn:hover {
		filter: brightness(1.15);
	}

	@keyframes overlayIn {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	@keyframes gameoverFlash {
		0% {
			opacity: 0;
		}
		20% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}

	@keyframes contentIn {
		0% {
			opacity: 0;
			transform: scale(0.8) translateY(20px);
		}
		100% {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	#battlefield {
		flex: 1;
		overflow: clip;
	}

	#footer {
		padding: 0.5rem;
		display: flex;
		justify-content: center;
	}

	.zone-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.4rem 0.5rem;
		border-radius: 8px;
		color: white;
	}

	.zone-row.clickable {
		cursor: pointer;
		transition: background 0.2s;
	}

	.zone-row.clickable:hover {
		background: rgba(255, 255, 255, 0.15);
	}

	.zone-row.disabled {
		opacity: 0.35;
		pointer-events: none;
	}

	.zone-label {
		font-size: 0.8rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		flex: 1;
	}

	.zone-row.damage {
		border-top: 1px solid rgba(255, 255, 255, 0.15);
		padding-top: 0.6rem;
	}

	.legend {
		border-top: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 8px;
		padding-top: 0.5rem;
		display: flex;
		flex-direction: column;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.2rem 0.5rem;
		border-radius: 8px;
	}

	.legend-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
	}

	.legend-dot.sorcery {
		background: #e879f9;
		box-shadow: 0 0 6px rgba(232, 121, 249, 0.6);
	}

	.legend-dot.instant {
		background: #60a5fa;
		box-shadow: 0 0 6px rgba(96, 165, 250, 0.6);
	}

	.legend-dot.enchantment {
		background: #4ade80;
		box-shadow: 0 0 6px rgba(74, 222, 128, 0.6);
	}

	.legend-text {
		font-size: 0.7rem;
		color: rgba(255, 255, 255, 0.7);
	}
</style>
