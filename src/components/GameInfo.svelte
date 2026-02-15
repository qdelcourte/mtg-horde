<script>
	import Icon from '@iconify/svelte';
	import { Badge, Drawer } from 'flowbite-svelte';

	import { game as G } from '../game';

	const { placement = 'left' } = $props();

	let open = $state(false);
	export const show = () => (open = true);
</script>

<Drawer bind:open {placement}>
	<h5
		id="drawer-label"
		class="mb-4 inline-flex items-center text-base font-semibold text-gray-500 dark:text-gray-400"
	>
		<Icon icon="mdi:information-slab-circle" width="24" class="mr-2" /> Game Info
	</h5>
	<div>Nb cards remaining: <Badge>{G.hordeLife}</Badge></div>
	<div>Nb cards in deck: <Badge>{G.state.horde.deck.length}</Badge></div>
	<div>Nb cards on battlefield: <Badge>{G.state.horde.battlefield.length}</Badge></div>
	<div>Nb cards in graveyard: <Badge>{G.state.horde.graveyard.length}</Badge></div>
	<div>Phase: {G.state.turn.phase}</div>
	<div>Initial Survivor Turn (curr): {G.state.turn.currentInitialSurvivorTurn}</div>
	<div>Turn (curr): {G.state.turn.current}</div>
</Drawer>
