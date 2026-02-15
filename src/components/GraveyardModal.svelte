<script>
	import { Badge, DropdownItem, Modal, Span } from 'flowbite-svelte';

	import { game as G } from '../game';
	import Card from './Card.svelte';
	import CardDetails from './CardDetails.svelte';
	import CardGrid from './CardGrid.svelte';

	let open = $state(false);
	export const show = () => (open = true);

	let currentCard = $state();
</script>

<Modal bind:open size="xl">
	{#snippet header()}
		<div class="flex items-center gap-3">
			<Span>Horde graveyard</Span>
			<Badge>{G.state.horde.graveyard.length}</Badge>
			<button
				class="restore-all-btn"
				onclick={() => {
					G.moves.putAllCardsInHordeBattlefieldFromGraveyard();
					open = false;
				}}>All to battlefield</button
			>
		</div>
	{/snippet}
	<div id="graveyard-body" data-autofocus tabindex="-1">
		<CardGrid count={G.state.horde.graveyard.length}>
			{#each G.state.horde.graveyard as card, index (card.uid)}
				<Card {card} {index} onclick={() => (currentCard = card)} canChangeMarker={false}>
					{#snippet actions()}
						<div>
							<DropdownItem onclick={() => G.moves.putCardInHordeDeckFromGraveyard(index, true)}
								>To the top library</DropdownItem
							>
							<DropdownItem onclick={() => G.moves.putCardInHordeDeckFromGraveyard(index, false)}
								>To the bottom library</DropdownItem
							>
							<DropdownItem
								onclick={() => G.moves.putCardInHordeBattlefieldFromGraveyard(index, false)}
								>To the battlefield</DropdownItem
							>
							<DropdownItem
								onclick={() => G.moves.putCardInHordeBattlefieldFromGraveyard(index, true)}
								>To the battlefield (tapped)</DropdownItem
							>
							<DropdownItem onclick={() => G.moves.putCardInHordeExileFromGraveyard(index)}
								>To the exile</DropdownItem
							>
						</div>
					{/snippet}
				</Card>
			{/each}
		</CardGrid>
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

	.restore-all-btn {
		background: cornflowerblue;
		color: white;
		border: none;
		border-radius: 6px;
		padding: 0.3rem 0.75rem;
		font-size: 0.75rem;
		font-weight: 600;
		cursor: pointer;
		transition: filter 0.2s;
	}

	.restore-all-btn:hover {
		filter: brightness(1.15);
	}
</style>
