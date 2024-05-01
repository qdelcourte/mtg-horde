<script>
	import { fly } from 'svelte/transition';
	import { ArrowUturnLeft, ArrowUturnRight, XMark } from 'svelte-heros-v2';
	import { DropdownItem } from 'flowbite-svelte';
	import Card from './Card.svelte';
	import { game as G } from '../game.svelte';

	const { onCardClick } = $props();

	let state = $derived(G.state);
</script>

<div id="battlefield-container">
	{#each state.G.hordeBattlefield as card, index (card.uid)}
		<div class="battlefield-card" in:fly={{ x: 100, duration: 500 }} out:fly>
			<Card {card} {index} canChangeMarker onclick={onCardClick(card)}>
				{#snippet actions()}
					{#if card.tapped}
						<DropdownItem on:click={() => G.client.moves.hordeToggleTapCard(index)}
							><ArrowUturnLeft size="16" class="inline-block" /> Untap</DropdownItem
						>
					{:else}
						<DropdownItem on:click={() => G.client.moves.hordeToggleTapCard(index)}
							><ArrowUturnRight size="16" class="inline-block" /> Tap</DropdownItem
						>
					{/if}
					<DropdownItem
						class="w-48"
						on:click={() => G.client.moves.putCardInHordeDeckFromBattlefield(index)}
						><XMark size="16" class="inline-block" /> To the top library</DropdownItem
					>
					<DropdownItem
						on:click={() => G.client.moves.putCardInHordeGraveyardFromBattlefield(index)}
						><XMark size="16" class="inline-block" /> To the graveyard</DropdownItem
					>
					<DropdownItem on:click={() => G.client.moves.putCardInHordeExileFromBattlefield(index)}
						><XMark size="16" class="inline-block" /> To the exile</DropdownItem
					>
				{/snippet}
			</Card>
		</div>
	{/each}
</div>

<style>
	#battlefield-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-evenly;
		align-content: space-evenly;
		align-items: stretch;
		padding: 10px;
		box-sizing: border-box;
		height: 100%;
		overflow: auto;
		overflow-x: hidden;
	}
</style>
