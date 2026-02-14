<script>
	import { Badge, DropdownItem, Modal, Span } from 'flowbite-svelte';
	import { game as G } from '../game.svelte';
	import CardDetails from './CardDetails.svelte';
	import Card from './Card.svelte';

	let state = $derived(G.state);

	let open = $state(false);
	export const show = () => (open = true);

	let currentCard = $state();
</script>

<Modal bind:open size="xl">
	{#snippet header()}
		<div>
			<Span class="mr-3">Horde graveyard</Span>
			<Badge>{state.G.hordeGraveyard.length}</Badge>
		</div>
	{/snippet}
	<div id="graveyard-body" data-autofocus tabindex="-1">
		<div id="graveyard">
			{#each state.G.hordeGraveyard as card, index (card.uid)}
				<div class="graveyard-card">
					<Card {card} {index} onclick={() => (currentCard = card)} canChangeMarker={false}>
						{#snippet actions()}
							<div>
								<DropdownItem
									onclick={() => G.client.moves.putCardInHordeDeckFromGraveyard(index, true)}
									>To the top library</DropdownItem
								>
								<DropdownItem
									onclick={() => G.client.moves.putCardInHordeDeckFromGraveyard(index, false)}
									>To the bottom library</DropdownItem
								>
								<DropdownItem
									onclick={() => G.client.moves.putCardInHordeBattefieldFromGraveyard(index, false)}
									>To the battlefield</DropdownItem
								>
								<DropdownItem
									onclick={() => G.client.moves.putCardInHordeBattefieldFromGraveyard(index, true)}
									>To the battlefield (tapped)</DropdownItem
								>
								<DropdownItem onclick={() => G.client.moves.putCardInHordeExileFromGraveyard(index)}
									>To the exile</DropdownItem
								>
							</div>
						{/snippet}
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
