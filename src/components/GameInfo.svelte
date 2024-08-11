<script>
	import { Badge, Drawer, CloseButton } from 'flowbite-svelte';
	import Icon from '@iconify/svelte';
	import { game as G } from '../game.svelte';

	const { placement = 'left', header = 'Info' } = $props();

	let state = $derived(G.state);

	let hidden = $state(true);
	export const show = () => (hidden = false);
</script>

<Drawer bind:hidden transitionType="fly" {placement} {header}>
	<div class="flex items-center">
		<h5
			id="drawer-label"
			class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400"
		>
			<Icon icon="mdi:information-slab-circle" width="24" class="mr-2" /> Game Info
		</h5>
		<CloseButton onclick={() => (hidden = true)} class="mb-4 dark:text-white" />
	</div>
	<div>Nb cards remaining: <Badge>{state.G.hordeLife}</Badge></div>
	<div>Nb cards in deck: <Badge>{state.G.hordeDeck.length}</Badge></div>
	<div>Nb cards on battlefield: <Badge>{state.G.hordeBattlefield.length}</Badge></div>
	<div>Nb cards in graveyard: <Badge>{state.G.hordeGraveyard.length}</Badge></div>
	<div>Phase: {state.ctx.phase}</div>
</Drawer>
