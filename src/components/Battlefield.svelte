<script>
	import { fly } from 'svelte/transition';
	import { DropdownItem } from 'flowbite-svelte';
	import Icon from '@iconify/svelte';
	import Card from './Card.svelte';
	import { game as G } from '../game.svelte';

	const { onCardClick } = $props();

	let state = $derived(G.state);
</script>

<div id="battlefield-container">
	{#each state.G.hordeBattlefield as card, index (card.uid)}
		<div class="battlefield-card" in:fly={{ x: 100, duration: 500 }} out:fly>
			<Card {card} {index} canChangeMarker onclick={() => onCardClick(card)}>
				{#snippet actions()}
					{#if card.tapped}
						<DropdownItem onclick={() => G.client.moves.hordeToggleTapCard(index)}
							><Icon icon="mdi:arrow-u-left-top" class="inline-block" width="16" /> Untap</DropdownItem
						>
					{:else}
						<DropdownItem onclick={() => G.client.moves.hordeToggleTapCard(index)}
							><Icon icon="mdi:arrow-u-right-top" class="inline-block" width="16" /> Tap</DropdownItem
						>
					{/if}
					<DropdownItem
						class="w-48"
						onclick={() => G.client.moves.putCardInHordeDeckFromBattlefield(index)}
						><Icon icon="mdi:close" width="16" class="inline-block" /> To the top library</DropdownItem
					>
					<DropdownItem onclick={() => G.client.moves.putCardInHordeGraveyardFromBattlefield(index)}
						><Icon icon="mdi:close" width="16" class="inline-block" /> To the graveyard</DropdownItem
					>
					<DropdownItem onclick={() => G.client.moves.putCardInHordeExileFromBattlefield(index)}
						><Icon icon="mdi:close" width="16" class="inline-block" /> To the exile</DropdownItem
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
