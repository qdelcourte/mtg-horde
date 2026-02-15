<script>
	import Icon from '@iconify/svelte';
	import { Badge, Drawer, P } from 'flowbite-svelte';

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
	<P>Nb cards remaining: <Badge>{G.hordeLife}</Badge></P>
	<P>Nb cards in deck: <Badge>{G.state.horde.deck.length}</Badge></P>
	<P>Nb cards on battlefield: <Badge>{G.state.horde.battlefield.length}</Badge></P>
	<P>Nb cards in graveyard: <Badge>{G.state.horde.graveyard.length}</Badge></P>
	<P>Phase: {G.state.turn.phase}</P>
	<P>Initial Survivor Turn (curr): {G.state.turn.currentInitialSurvivorTurn}</P>
	<P>Turn (curr): {G.state.turn.current}</P>
</Drawer>
