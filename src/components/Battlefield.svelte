<script>
	import { getContext, createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	import { DropdownItem, Icon } from 'sveltestrap';
    import Card from './Card.svelte';
	import { key } from '../context';

    const dispatch = createEventDispatcher();
    let state;
	let client = getContext(key);
	client.subscribe((s) => (state = s));
</script>


{#each state.G.hordeBattlefield as card, index (card.uid)}
<div class="battlefield-card" in:fly={{ y: 100, duration: 500 }} out:fly>
    <Card {card} {index} canChangeMarker={true} on:click={() => dispatch('show_card', {card})}>
        <div slot="actions">
            {#if card.tapped}
                <DropdownItem on:click={() => client.moves.hordeToggleTapCard(index)}
                    ><Icon name="arrow-counterclockwise" /> Untap</DropdownItem
                >
            {:else}
                <DropdownItem on:click={() => client.moves.hordeToggleTapCard(index)}
                    ><Icon name="arrow-clockwise" /> Tap</DropdownItem
                >
            {/if}
            <DropdownItem on:click={() => client.moves.putCardInHordeDeckFromBattlefield(index)}
                ><Icon name="x" /> To the top library</DropdownItem
            >
            <DropdownItem
                on:click={() => client.moves.putCardInHordeGraveyardFromBattlefield(index)}
                ><Icon name="x" /> To the graveyard</DropdownItem
            >
            <DropdownItem on:click={() => client.moves.putCardInHordeExileFromBattlefield(index)}
                ><Icon name="x" /> To the exile</DropdownItem
            >
        </div>
    </Card>
</div>
{/each}

<style>
	.battlefield-card {
		position: relative;
		height: min-content;
	}
</style>