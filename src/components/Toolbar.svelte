<script>
	import { game as G } from '../game';
	import { PHASES } from '../game/phases';
	import { modals } from '../lib/modals.svelte.js';
	import FullscreenToggle from './FullscreenToggle.svelte';
	import ToolbarButton from './ToolbarButton.svelte';

	const { onSave, onRestore } = $props();

	const inGame = $derived(G.state.turn.phase === PHASES.fightTheHorde);
</script>

<div class="flex flex-col gap-0.5 rounded-lg border-t border-white/15 pt-2">
	<ToolbarButton
		label="Add token"
		icon="mdi:plus-circle"
		disabled={!inGame}
		onclick={() => (modals.addToken = true)}
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
		onclick={() => (modals.settings = true)}
	/>
	<ToolbarButton
		label="Info"
		icon="mdi:information-slab-circle"
		onclick={() => (modals.gameInfo = true)}
	/>
	<FullscreenToggle />
</div>
