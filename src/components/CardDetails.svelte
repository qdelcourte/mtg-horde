<script>
	import { Heading, P } from 'flowbite-svelte';

	const { card } = $props();
</script>

<Heading tag="h2">{card.name}</Heading>

{#if card.text}
	<P>{card.text}</P>
{/if}

<div class="flex justify-center">
	<img class="w-72" src={card.images.normal} alt="explain card" />
</div>
