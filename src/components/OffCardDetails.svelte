<script>
	import { Offcanvas } from 'sveltestrap';
	import CardDetails from './CardDetails.svelte';

	export let placement = 'end';

	let card;
	let open = false;
	const toggle = () => (open = !open);

	export const show = (_card) => {
		card = _card;
		open = true;
	};
</script>

<Offcanvas isOpen={open} {toggle} {placement}>
	{#if card}
		<CardDetails {card} />
	{/if}
</Offcanvas>
