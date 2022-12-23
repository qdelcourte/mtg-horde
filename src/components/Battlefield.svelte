<script>
	import { getContext, createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	import { ArrowUturnLeft, ArrowUturnRight, XMark } from 'svelte-heros-v2';
	import { DropdownItem } from 'flowbite-svelte';
	import Card from './Card.svelte';
	import { key } from '../context';

	const dispatch = createEventDispatcher();
	let state;
	let client = getContext(key);
	client.subscribe((s) => (state = s));
</script>

{#each state.G.hordeBattlefield as card, index (card.uid)}
	<div class="battlefield-card" in:fly={{ y: 100, duration: 500 }} out:fly>
		<Card {card} {index} canChangeMarker on:click={() => dispatch('show_card', { card })}>
			<svelte:fragment slot="actions">
				{#if card.tapped}
					<DropdownItem on:click={() => client.moves.hordeToggleTapCard(index)}
						><ArrowUturnLeft /> Untap</DropdownItem
					>
				{:else}
					<DropdownItem on:click={() => client.moves.hordeToggleTapCard(index)}
						><ArrowUturnRight /> Tap</DropdownItem
					>
				{/if}
				<DropdownItem on:click={() => client.moves.putCardInHordeDeckFromBattlefield(index)}
					><XMark /> To the top library</DropdownItem
				>
				<DropdownItem on:click={() => client.moves.putCardInHordeGraveyardFromBattlefield(index)}
					><XMark /> To the graveyard</DropdownItem
				>
				<DropdownItem on:click={() => client.moves.putCardInHordeExileFromBattlefield(index)}
					><XMark /> To the exile</DropdownItem
				>
			</svelte:fragment>
		</Card>
	</div>
{/each}

<style>
	.battlefield-card {
		position: relative;
		height: min-content;
	}
</style>
