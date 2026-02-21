<script>
	import Icon from '@iconify/svelte';
	import { Badge } from 'flowbite-svelte';
	import { fly } from 'svelte/transition';

	import { game as G } from '../game';
	import { PHASES } from '../game/phases';
	import { modals } from '../lib/modals.svelte.js';
	import { toast } from '../lib/toast.svelte.js';
	import AddTokenModal from './AddTokenModal.svelte';
	import AlertToast from './AlertToast.svelte';
	import Battlefield from './Battlefield.svelte';
	import GameInfo from './GameInfo.svelte';
	import GithubLink from './GithubLink.svelte';
	import GraveyardModal from './GraveyardModal.svelte';
	import OffCardDetails from './OffCardDetails.svelte';
	import Pulse from './Pulse.svelte';
	import Score from './Score.svelte';
	import SettingsModal from './SettingsModal.svelte';
	import ThemeColorPicker from './ThemeColorPicker.svelte';
	import Toolbar from './Toolbar.svelte';
	import TurnHistory from './TurnHistory.svelte';

	const inGame = $derived(G.state.turn.phase === PHASES.fightTheHorde);
	const gameover = $derived(G.state.turn.gameover);
	const survivorsWin = $derived(gameover?.winner?.includes('Survivors'));

	$effect(() => {
		if (!G.state.turn.phase) modals.settings = true;
	});

	function onSave() {
		G.savepointInLocalStorage();
		toast.show('Savepoint !');
	}

	function onRestore() {
		try {
			G.restoreSavepointFromLocalStorage();
			toast.show('Savepoint restored !');
		} catch (e) {
			toast.show(e.message);
		}
	}
</script>

<GameInfo />
<OffCardDetails />
<GraveyardModal />
<SettingsModal permanent={!G.state.turn.phase} />
<AlertToast />
<AddTokenModal />

<div id="game" class="grid h-full grid-cols-[max-content_1fr] overflow-hidden">
	<div class="flex h-full flex-col gap-2 overflow-y-auto bg-white/6 p-3 backdrop-blur-sm">
		<div class="zone-row" class:disabled={!inGame}>
			<Icon icon="mdi:cards" color="white" width="20" />
			<span class="flex-1 text-sm font-medium tracking-[0.5px] uppercase">Horde</span>
			<Badge large><Pulse value={G.state.horde.deck.length} /></Badge>
		</div>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="zone-row"
			class:clickable={inGame && G.state.horde.graveyard.length > 0}
			class:disabled={!inGame || G.state.horde.graveyard.length === 0}
			onclick={() => inGame && G.state.horde.graveyard.length > 0 && (modals.graveyard = true)}
		>
			<Icon icon="mdi:grave-stone" color="white" width="20" />
			<span class="flex-1 text-sm font-medium tracking-[0.5px] uppercase">Graveyard</span>
			<Badge large><Pulse value={G.state.horde.graveyard.length} /></Badge>
		</div>
		<div class="zone-row damage" class:disabled={!inGame}>
			<Icon icon="mdi:sword-cross" color="white" width="20" />
			<span class="flex-1 text-sm font-medium tracking-[0.5px] uppercase">Damage</span>
			<Pulse
				value={G.hordeDamage}
				class="text-danger text-xl font-bold text-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
			/>
		</div>
		<div class="flex flex-col rounded-lg border-t border-white/15 pt-2">
			<div class="flex items-center gap-1.5 rounded-lg px-2 py-1">
				<span class="legend-dot sorcery h-2.5 w-2.5 rounded-full"></span>
				<span class="text-xs text-white/70">Sorcery</span>
			</div>
			<div class="flex items-center gap-1.5 rounded-lg px-2 py-1">
				<span class="legend-dot instant h-2.5 w-2.5 rounded-full"></span>
				<span class="text-xs text-white/70">Instant</span>
			</div>
			<div class="flex items-center gap-1.5 rounded-lg px-2 py-1">
				<span class="legend-dot enchantment h-2.5 w-2.5 rounded-full"></span>
				<span class="text-xs text-white/70">Enchantment</span>
			</div>
		</div>
		<Toolbar {onRestore} {onSave} />
		<div class="rounded-lg border-t border-white/15 pt-2">
			<ThemeColorPicker />
		</div>
		<a
			href="#distribution"
			class="mt-1 flex items-center gap-2 rounded-lg border-t border-white/15 px-2 pt-2.5 pb-1.5 text-sm font-medium text-white/60 no-underline transition-colors duration-200 hover:bg-white/10 hover:text-white"
		>
			<Icon icon="mdi:chart-bell-curve-cumulative" color="white" width="20" />
			<span class="leading-normal">Shuffle Analysis</span>
		</a>
		<GithubLink />
	</div>

	<div class="relative flex h-full flex-col overflow-hidden">
		{#if G.state.turn.phase === PHASES.initialSurvivorsTurns}
			<div
				class="flex flex-1 flex-col items-center justify-center gap-6 bg-black/40 text-center text-white"
				in:fly={{ y: 100, duration: 700 }}
				out:fly={{ y: -100, duration: 500 }}
			>
				<Icon icon="mdi:shield-sword" color="rgba(255,255,255,0.15)" width="80" />
				<div class="text-xl font-semibold tracking-[2px] text-white/60 uppercase">
					Survivors turn
				</div>
				<div class="flex items-baseline gap-1">
					<span class="survivors-current text-4xl leading-none font-bold text-white"
						>{G.state.turn.currentInitialSurvivorTurn}</span
					>
					<span class="mx-0.5 text-4xl font-light text-white/30">/</span>
					<span class="text-xl font-medium text-white/50"
						>{G.state.config.nbInitialSurvivorsTurn}</span
					>
				</div>
				<button
					class="bg-primary-500 flex cursor-pointer items-center gap-2 rounded-lg border-none px-6 py-2.5 text-base font-semibold text-white transition-[filter] duration-200 hover:brightness-[1.15]"
					onclick={() => G.moves.nextInitialTurn()}
				>
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
			<TurnHistory />

			<div class="min-h-0 flex-1 overflow-x-clip overflow-y-auto">
				<Battlefield
					onCardClick={(card) => {
						modals.cardDetails.card = card;
						modals.cardDetails.open = true;
					}}
				/>
			</div>

			<div class="flex justify-center p-2" in:fly={{ y: 50, duration: 500 }}>
				<Score />
			</div>
		{/if}
	</div>

	{#if gameover}
		<div
			class="gameover-overlay absolute inset-0 z-50 flex items-center justify-center"
			class:win={survivorsWin}
			class:lose={!survivorsWin}
		>
			<div class="gameover-flash absolute inset-0"></div>
			<div class="gameover-content flex flex-col items-center gap-4">
				<Icon
					icon={survivorsWin ? 'mdi:trophy' : 'mdi:skull'}
					width="64"
					color={survivorsWin ? 'var(--color-warning)' : 'var(--color-danger)'}
				/>
				<div class="gameover-title text-5xl font-extrabold tracking-[4px] text-white uppercase">
					{survivorsWin ? 'Victory' : 'Defeat'}
				</div>
				<div class="text-base font-medium text-white/60">{gameover.winner}</div>
				<button
					class="bg-primary-500 mt-4 flex cursor-pointer items-center gap-2 rounded-lg border-none px-6 py-2.5 text-base font-semibold text-white transition-[filter] duration-200 hover:brightness-[1.15]"
					onclick={() => (modals.settings = true)}
				>
					<Icon icon="mdi:restart" width="20" />
					New Game
				</button>
				<TurnHistory />
			</div>
		</div>
	{/if}
</div>

<style>
	#game {
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
			),
			radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.02) 0%, transparent 80%);
	}

	.survivors-current {
		text-shadow: 0 0 20px color-mix(in srgb, var(--color-primary-500) 50%, transparent);
	}

	/* Game Over overlay */
	.gameover-overlay {
		animation: overlayIn 0.8s ease-out forwards;
	}

	.gameover-overlay.win {
		background: radial-gradient(
			ellipse at center,
			color-mix(in srgb, var(--color-warning) 15%, transparent),
			rgba(0, 0, 0, 0.85) 70%
		);
	}

	.gameover-overlay.lose {
		background: radial-gradient(
			ellipse at center,
			color-mix(in srgb, var(--color-danger) 20%, transparent),
			rgba(0, 0, 0, 0.85) 70%
		);
	}

	.gameover-flash {
		animation: gameoverFlash 1s ease-out forwards;
	}

	.gameover-overlay.win .gameover-flash {
		background: radial-gradient(
			ellipse at center,
			color-mix(in srgb, var(--color-warning) 40%, transparent),
			transparent 60%
		);
	}

	.gameover-overlay.lose .gameover-flash {
		background: radial-gradient(
			ellipse at center,
			color-mix(in srgb, var(--color-danger) 40%, transparent),
			transparent 60%
		);
	}

	.gameover-content {
		animation: contentIn 0.6s 0.3s ease-out both;
	}

	.gameover-title {
		text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
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

	/* Zone row modifiers */
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

	.zone-row.damage {
		border-top: 1px solid rgba(255, 255, 255, 0.15);
		padding-top: 0.6rem;
	}

	/* Legend dot variants */
	.legend-dot.sorcery {
		background: var(--color-sorcery);
		box-shadow: 0 0 6px color-mix(in srgb, var(--color-sorcery) 60%, transparent);
	}

	.legend-dot.instant {
		background: var(--color-instant);
		box-shadow: 0 0 6px color-mix(in srgb, var(--color-instant) 60%, transparent);
	}

	.legend-dot.enchantment {
		background: var(--color-enchantment);
		box-shadow: 0 0 6px color-mix(in srgb, var(--color-enchantment) 60%, transparent);
	}
</style>
