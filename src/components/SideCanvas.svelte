<script>
	import { Offcanvas } from 'sveltestrap';

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
		<h1>{card.name}</h1>
		{#if card.text}
			<p>{card.text}</p>
		{/if}
		<div><img src={card.images.normal} alt="explain card" height="500px" /></div>
	{/if}
</Offcanvas>
