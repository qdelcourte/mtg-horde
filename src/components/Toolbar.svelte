<script>
	import { game as G } from '../game';
	import { PHASES } from '../game/phases';
	import FullscreenToggle from './FullscreenToggle.svelte';
	import ToolbarButton from './ToolbarButton.svelte';

	const { addTokenModalRef, settingsModalRef, gameInfoRef, onSave, onRestore } = $props();

	const inGame = $derived(G.state.turn.phase === PHASES.fightTheHorde);
</script>

<div class="toolbar">
	<ToolbarButton
		label="Add token"
		icon="mdi:plus-circle"
		disabled={!inGame}
		onclick={() => addTokenModalRef.show()}
	/>
	<ToolbarButton
		label="Wrath"
		icon="mdi:skull-crossbones"
		disabled={!inGame}
		confirm
		onclick={() => G.moves.hordeWrathBattlefield()}
	/>
	<ToolbarButton
		label="Tap all"
		icon="mdi:arrow-u-right-top"
		disabled={!inGame}
		confirm
		onclick={() => G.moves.hordeToggleTapAllCards(true)}
	/>
	<ToolbarButton
		label="Untap all"
		icon="mdi:arrow-u-left-top"
		disabled={!inGame}
		confirm
		onclick={() => G.moves.hordeToggleTapAllCards(false)}
	/>
	<ToolbarButton label="Save" icon="mdi:content-save" disabled={!inGame} onclick={onSave} />
	<ToolbarButton label="Restore" icon="mdi:file-restore" disabled={!inGame} onclick={onRestore} />
	<ToolbarButton
		label="Restart"
		icon="mdi:mixer-settings"
		onclick={() => settingsModalRef.show()}
	/>
	<ToolbarButton
		label="Info"
		icon="mdi:information-slab-circle"
		onclick={() => gameInfoRef.show()}
	/>
	<FullscreenToggle />
</div>

<style>
	.toolbar {
		border-top: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 8px;
		padding-top: 0.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}
</style>
