<script>
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	import Icon from '@iconify/svelte';
	import { game as G } from '../game.svelte';

	const { card, index, canChangeMarker = false, actions, onclick } = $props();

	function cardMarkerRepr(card) {
		let power = card.power;
		if (card.powerMarker) {
			power = (parseInt(power) || 0) + (parseInt(card.powerMarker) || 0);
		}
		let toughness = card.toughness;
		if (card.toughnessMarker) {
			toughness = (parseInt(toughness) || 0) + (parseInt(card.toughnessMarker) || 0);
		}

		return `${power} / ${toughness}`;
	}
</script>

<div class="card-container">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<img
		src={'/assets/card-back.jpg'}
		alt="a card"
		class:tapped={card.tapped}
		class:sorcery={G.helpers.isSorceryCard(card)}
		class:instant={G.helpers.isInstantCard(card)}
		class:enchantment={G.helpers.isEnchantmentCard(card)}
		{onclick}
	/>
	<div class="card-over">
		<div class="card-name">{card.name}</div>

		<div>
			{#if actions}
				<div class="card-actions">
					<Button id="action-{card.uid}" class="!px-1" color="dark"
						><Icon icon="mdi:chevron-down" class="!mx-2" width="18" /></Button
					>
					<Dropdown size="xs" triggeredBy=".card-actions #action-{card.uid}" placement="right">
						{@render actions()}
					</Dropdown>
				</div>
			{/if}
			{#if card.power || card.powerMarker || card.toughness || card.toughnessMarker}
				<div class="card-power">
					<Button id="power-{card.uid}" class="!px-2" color="dark">{cardMarkerRepr(card)}</Button>
					{#if canChangeMarker}
						<Dropdown size="xs" triggeredBy=".card-power #power-{card.uid}" placement="right">
							<DropdownItem
								class="w-48"
								onclick={() => G.client.moves.changeCardMarkerCounter(index, 1, 1)}
								>Add marker +1 / +1</DropdownItem
							>
							<DropdownItem onclick={() => G.client.moves.changeCardMarkerCounter(index, -1, -1)}
								>Add marker -1 / -1</DropdownItem
							>
							<DropdownItem onclick={() => G.client.moves.changeCardMarkerCounter(index, 1, 0)}
								>Add marker +1 / 0</DropdownItem
							>
							<DropdownItem onclick={() => G.client.moves.changeCardMarkerCounter(index, -1, 0)}
								>Add marker -1 / 0</DropdownItem
							>
							<DropdownItem onclick={() => G.client.moves.changeCardMarkerCounter(index, 0, 1)}
								>Add marker 0 / +1</DropdownItem
							>
							<DropdownItem onclick={() => G.client.moves.changeCardMarkerCounter(index, 0, -1)}
								>Add marker 0 / -1</DropdownItem
							>
						</Dropdown>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.card-container {
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: visible;
		width: min-content;
		height: min-content;
		position: relative;
		padding: 5px;
	}

	img {
		max-width: 10rem;
		transition: transform 0.5s ease-in-out;
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
		position: absolute;
		background-color: black;
		color: white;
		font-size: 70%;
		padding: 5px;
	}

	.card-over {
		position: absolute;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	.card-actions,
	.card-power {
		padding: 5px;
		position: absolute;
		bottom: 0;
		pointer-events: all;
	}

	.card-power {
		right: 0;
	}
</style>
