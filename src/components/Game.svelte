<script>
	import { game as G } from '../game';
	import { PHASES } from '../game/phases';
	import { modals } from '../lib/modals.svelte.js';
	import AddTokenModal from './AddTokenModal.svelte';
	import AlertToast from './AlertToast.svelte';
	import Battlefield from './Battlefield.svelte';
	import GameInfo from './GameInfo.svelte';
	import GameOverOverlay from './GameOverOverlay.svelte';
	import GraveyardModal from './GraveyardModal.svelte';
	import OffCardDetails from './OffCardDetails.svelte';
	import Score from './Score.svelte';
	import SettingsModal from './SettingsModal.svelte';
	import SidePanel from './SidePanel.svelte';
	import SurvivorsTurn from './SurvivorsTurn.svelte';
	import TurnHistory from './TurnHistory.svelte';

	$effect(() => {
		if (!G.state.turn.phase) modals.settings.open();
	});
</script>

<GameInfo />
<OffCardDetails />
<GraveyardModal />
<AlertToast />
<AddTokenModal />
<GameOverOverlay />
<SettingsModal permanent={!G.state.turn.phase} />

<div id="game" class="grid h-full grid-cols-[max-content_1fr] overflow-hidden">
	<SidePanel />

	<div class="relative flex h-full flex-col overflow-hidden">
		{#if G.state.turn.phase === PHASES.initialSurvivorsTurns}
			<SurvivorsTurn />
		{:else if G.state.turn.phase === PHASES.fightTheHorde}
			<TurnHistory />

			<Battlefield
				onCardClick={(card) => {
					modals.cardDetails.open(card);
				}}
			/>

			<Score />
		{/if}
	</div>
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
</style>
