<script>
	import { Badge, Offcanvas } from 'sveltestrap';
	import { getContext } from 'svelte';
	import { key } from '../context';

	export let placement = 'start';
	export let header = 'Info';

	let state;
	let client = getContext(key);
	client.subscribe((s) => (state = s));

	let open = false;
	export const toggle = () => (open = !open);
</script>

<Offcanvas isOpen={open} {toggle} {placement} {header}>
	<div>Nb cards remaining: <Badge>{state.G.hordeLife}</Badge></div>
	<div>Nb cards in deck: <Badge>{state.G.hordeDeck.length}</Badge></div>
	<div>Nb cards on battlefield: <Badge>{state.G.hordeBattlefield.length}</Badge></div>
	<div>Nb cards in graveyard: <Badge>{state.G.hordeGraveyard.length}</Badge></div>
	<div>Phase: {state.ctx.phase}</div>
</Offcanvas>
