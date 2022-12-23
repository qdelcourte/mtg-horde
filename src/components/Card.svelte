<script>
	import { Button, Dropdown, DropdownItem, Chevron } from 'flowbite-svelte';

	import { getContext } from 'svelte';
	import { key } from '../context';
	import { isSorceryCard, isInstantCard, isEnchantmentCard, isTokenCard } from '../gameHelpers';

	let client = getContext(key);

	export let card;
	export let index;

	export let canChangeMarker = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<img
	src={'/assets/card-back.jpg'}
	alt="a card"
	class:tapped={card.tapped}
	class:sorcery={isSorceryCard(card)}
	class:instant={isInstantCard(card)}
	class:enchantment={isEnchantmentCard(card)}
	on:click
/>
<span class="card-name">{card.name}</span>
{#if $$slots.actions}
	<div class="card-actions">
		<Button id="action-{card.uid}" class="!px-1" color="dark"><Chevron /></Button>
		<Dropdown size="xs" triggeredBy=".card-actions #action-{card.uid}">
			<slot name="actions" />
		</Dropdown>
	</div>
{/if}
{#if card.power || card.powerMarker || card.toughness || card.toughnessMarker}
	<div class="card-power">
		<Button id="power-{card.uid}" class="!px-1" color="dark"
			>{(parseInt(card.power) || 0) + (parseInt(card.powerMarker) || 0)} / {(parseInt(
				card.toughness
			) || 0) + (parseInt(card.toughnessMarker) || 0)}</Button
		>
		<Dropdown size="xs" triggeredBy=".card-power #power-{card.uid}">
			{#if canChangeMarker}
				<DropdownItem on:click={() => client.moves.changeCardMarkerCounter(index, 1, 1)}
					>Add marker +1 / +1</DropdownItem
				>
				<DropdownItem on:click={() => client.moves.changeCardMarkerCounter(index, -1, -1)}
					>Add marker -1 / -1</DropdownItem
				>
				<DropdownItem on:click={() => client.moves.changeCardMarkerCounter(index, 1, 0)}
					>Add marker +1 / 0</DropdownItem
				>
				<DropdownItem on:click={() => client.moves.changeCardMarkerCounter(index, -1, 0)}
					>Add marker -1 / 0</DropdownItem
				>
				<DropdownItem on:click={() => client.moves.changeCardMarkerCounter(index, 0, 1)}
					>Add marker 0 / +1</DropdownItem
				>
				<DropdownItem on:click={() => client.moves.changeCardMarkerCounter(index, 0, -1)}
					>Add marker 0 / -1</DropdownItem
				>
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
