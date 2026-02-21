<script>
	import { Badge, DropdownItem, Modal, Span } from 'flowbite-svelte';

	import { game as G } from '../game';
	import { modals } from '../lib/modals.svelte.js';
	import Card from './Card.svelte';
	import CardDetails from './CardDetails.svelte';
	import CardGrid from './CardGrid.svelte';

	let currentCard = $state();
</script>

<Modal bind:open={modals.graveyard.isOpen} size="xl">
	{#snippet header()}
		<div class="flex items-center gap-3">
			<Span>Horde graveyard</Span>
			<Badge>{G.state.horde.graveyard.length}</Badge>
			<button
				class="bg-primary-500 cursor-pointer rounded-md border-none px-3 py-1 text-xs font-semibold text-white transition-[filter] duration-200 hover:brightness-[1.15]"
				onclick={() => {
					G.moves.putAllCardsInHordeBattlefieldFromGraveyard();
					modals.graveyard.close();
				}}>All to battlefield</button
			>
		</div>
	{/snippet}
	<div class="grid grid-cols-[70%_1fr]" data-autofocus tabindex="-1">
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
