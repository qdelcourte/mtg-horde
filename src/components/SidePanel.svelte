<script>
	import Icon from '@iconify/svelte';
	import { Badge } from 'flowbite-svelte';

	import { game as G } from '../game';
	import { PHASES } from '../game/phases';
	import { modals } from '../lib/modals.svelte.js';
	import { toast } from '../lib/toast.svelte.js';
	import FullscreenToggle from './FullscreenToggle.svelte';
	import GithubLink from './GithubLink.svelte';
	import Pulse from './Pulse.svelte';
	import ThemeColorPicker from './ThemeColorPicker.svelte';
	import ToolbarButton from './ToolbarButton.svelte';

	const inGame = $derived(G.state.turn.phase === PHASES.fightTheHorde);

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
		onclick={() => inGame && G.state.horde.graveyard.length > 0 && modals.graveyard.open()}
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
	<div class="flex flex-col gap-0.5 rounded-lg border-t border-white/15 pt-2">
		<ToolbarButton
			label="Add token"
			icon="mdi:plus-circle"
			disabled={!inGame}
			onclick={() => modals.addToken.open()}
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
			onclick={() => modals.settings.open()}
		/>
		<ToolbarButton
			label="Info"
			icon="mdi:information-slab-circle"
			onclick={() => modals.gameInfo.open()}
		/>
		<FullscreenToggle />
	</div>
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

<style>
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
