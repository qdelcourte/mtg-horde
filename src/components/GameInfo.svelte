<script>
	import Icon from '@iconify/svelte';
	import { Badge, Drawer } from 'flowbite-svelte';

	import { game as G } from '../game.svelte';

	const { placement = 'left' } = $props();

	let state = $derived(G.state);

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
	<div>Nb cards remaining: <Badge>{state.G.hordeLife}</Badge></div>
	<div>Nb cards in deck: <Badge>{state.G.hordeDeck.length}</Badge></div>
	<div>Nb cards on battlefield: <Badge>{state.G.hordeBattlefield.length}</Badge></div>
	<div>Nb cards in graveyard: <Badge>{state.G.hordeGraveyard.length}</Badge></div>
	<div>Phase: {state.ctx.phase}</div>
	<div>Turn (ctx): {state.ctx.turn}</div>
	<div>Turn (curr): {state.G.currentTurn}</div>
</Drawer>
