<script>
	import { Badge, DropdownItem, Modal, Span } from 'flowbite-svelte';
	import { getContext } from 'svelte';
	import { key } from '../context';
	import CardDetails from './CardDetails.svelte';
	import Card from './Card.svelte';

	let state;
	let client = getContext(key);
	client.subscribe((s) => (state = s));

	let open = false;
	export const show = () => (open = true);

	let currentCard;
</script>

<Modal bind:open size="xl">
	<svelte:fragment slot="header">
		<Span class="mr-3">Horde graveyard</Span>
		<Badge>{state.G.hordeGraveyard.length}</Badge></svelte:fragment
	>
	<div id="graveyard-body">
		<div id="graveyard">
			{#each state.G.hordeGraveyard as card, index (card.uid)}
				<div class="graveyard-card">
					<Card {card} {index} on:click={() => (currentCard = card)} canChangeMarker={false}>
						<div slot="actions">
							<DropdownItem
								on:click={() => client.moves.putCardInHordeDeckFromGraveyard(index, true)}
								>To the top library</DropdownItem
							>
							<DropdownItem
								on:click={() => client.moves.putCardInHordeDeckFromGraveyard(index, false)}
								>To the bottom library</DropdownItem
							>
							<DropdownItem
								on:click={() => client.moves.putCardInHordeBattefieldFromGraveyard(index, false)}
								>To the battlefield</DropdownItem
							>
							<DropdownItem
								on:click={() => client.moves.putCardInHordeBattefieldFromGraveyard(index, true)}
								>To the battlefield (tapped)</DropdownItem
							>
							<DropdownItem on:click={() => client.moves.putCardInHordeExileFromGraveyard(index)}
								>To the exile</DropdownItem
							>
						</div>
					</Card>
				</div>
			{/each}
		</div>
		<div id="current-card">
			{#if currentCard}
				<CardDetails card={currentCard} />
			{/if}
		</div>
	</div>
</Modal>

<style>
	#graveyard-body {
		display: grid;
		grid-template-columns: 70% 1fr;
	}

	#graveyard {
		display: grid;
		grid-template-columns: repeat(auto-fill, 203px);
	}

	.graveyard-card {
		position: relative;
		height: min-content;
	}
</style>
