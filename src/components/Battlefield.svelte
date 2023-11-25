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

<div id="battlefield-container">
	{#each state.G.hordeBattlefield as card, index (card.uid)}
		<div class="battlefield-card" in:fly={{ x: 100, duration: 500 }} out:fly>
			<Card {card} {index} canChangeMarker on:click={() => dispatch('show_card', { card })}>
				<svelte:fragment slot="actions">
					{#if card.tapped}
						<DropdownItem on:click={() => client.moves.hordeToggleTapCard(index)}
							><ArrowUturnLeft size="16" class="inline-block" /> Untap</DropdownItem
						>
					{:else}
						<DropdownItem on:click={() => client.moves.hordeToggleTapCard(index)}
							><ArrowUturnRight size="16" class="inline-block" /> Tap</DropdownItem
						>
					{/if}
					<DropdownItem on:click={() => client.moves.putCardInHordeDeckFromBattlefield(index)}
						><XMark size="16" class="inline-block" /> To the top library</DropdownItem
					>
					<DropdownItem on:click={() => client.moves.putCardInHordeGraveyardFromBattlefield(index)}
						><XMark size="16" class="inline-block" /> To the graveyard</DropdownItem
					>
					<DropdownItem on:click={() => client.moves.putCardInHordeExileFromBattlefield(index)}
						><XMark size="16" class="inline-block" /> To the exile</DropdownItem
					>
				</svelte:fragment>
			</Card>
		</div>
	{/each}
</div>

<style>
	#battlefield-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		align-items: stretch;
		padding: 10px;
		box-sizing: border-box;
		height: 100%;
		overflow: auto;
		overflow-x: hidden;
	}
</style>
