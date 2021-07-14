<script>
    import { 
        Dropdown,
        DropdownItem,
        DropdownMenu,
        DropdownToggle,
        Icon, 
    } from 'sveltestrap';

    import { getContext } from 'svelte';
    import { key } from '../context';
    import { isSorceryCard, isInstantCard, isEnchantmentCard } from '../game';

    let client = getContext(key);

    export let card;
    export let index;

    export let canChangeMarker = false;
</script>

<img src="/assets/card-back.png" alt="a card" 
    class:tapped={card.tapped}
    class:sorcery={isSorceryCard(card)}
    class:instant={isInstantCard(card)}
    class:enchantment={isEnchantmentCard(card)}
    on:click>
<span class="card-name">{card.name}</span>
{#if $$slots.actions}
    <div class="card-actions">
        <Dropdown size="sm">
            <DropdownToggle><Icon name="caret-down-fill"/></DropdownToggle>
            <DropdownMenu dark>
                <slot name="actions"/>
            </DropdownMenu>
        </Dropdown>
    </div>
{/if}
{#if card.power || card.powerMarker || card.toughness || card.toughnessMarker}
    <div class="card-power">
        <Dropdown size="sm">
            <DropdownToggle>{(parseInt(card.power) || 0) + (parseInt(card.powerMarker) || 0)} / {(parseInt(card.toughness) || 0) + (parseInt(card.toughnessMarker) || 0)}</DropdownToggle>
            {#if canChangeMarker}
                <DropdownMenu dark>
                    <DropdownItem on:click={() => client.moves.changeCardMarkerCounter(index, 1)}>Add marker +1 / +1</DropdownItem>
                    <DropdownItem on:click={() => client.moves.changeCardMarkerCounter(index, -1)}>Add marker -1 / -1</DropdownItem>
                    <DropdownItem on:click={() => client.moves.changeCardPowerCounter(index, 1)}>Add marker +1 / 0</DropdownItem>
                    <DropdownItem on:click={() => client.moves.changeCardPowerCounter(index, -1)}>Add marker -1 / 0</DropdownItem>
                    <DropdownItem on:click={() => client.moves.changeCardToughnessCounter(index, 1)}>Add marker 0 / +1</DropdownItem>
                    <DropdownItem on:click={() => client.moves.changeCardToughnessCounter(index, -1)}>Add marker 0 / -1</DropdownItem>
                </DropdownMenu>
            {/if}
        </Dropdown>
    </div>
{/if}

<style>
    img {
        transition-duration: 0.5s;
        height: 15rem;
        margin: 15px;
    }

    img.tapped {
        transform: rotate(15deg);
    }

    img.sorcery {
        box-shadow: 0 0 0 5px darkmagenta;
    }

    img.instant {
        box-shadow: 0 0 0 5px blue;
    }

    img.enchantment {
        box-shadow: 0 0 0 5px green;
    }

    img:hover {
        cursor: pointer;
        box-shadow: 0 0 0 5px #eee;
    }

    .card-name {
        background-color: black;
        color: white;
        padding: 5px;
        position: absolute;
        top: 15px;
        left: 15px;
        width: calc(100% - 30px);
    }

    .card-power {
        padding: 5px;
        position: absolute;
        right: 0;
        bottom: 0;
    }

    .card-actions {
        padding: 5px;
        position: absolute;
        left: 0;
        bottom: 0;
    }
</style>