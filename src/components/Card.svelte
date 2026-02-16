<script>
	import Icon from '@iconify/svelte';
	import cardBack from '$assets/card-back.jpg';
	import { Button, Dropdown } from 'flowbite-svelte';

	import { game as G } from '../game';
	import { isEnchantmentCard, isInstantCard, isSorceryCard } from '../game/helpers';

	const { card, index, canChangeMarker = false, actions, onclick } = $props();

	let actionsOpen = $state(false);
	let markerOpen = $state(false);
	let markerPower = $state(1);
	let markerToughness = $state(1);
	let loaded = $state(false);
	let imgSrc = $derived(card.images?.normal);

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
		src={loaded ? imgSrc : cardBack}
		alt={card.name}
		class:tapped={card.tapped}
		class:sorcery={isSorceryCard(card)}
		class:instant={isInstantCard(card)}
		class:enchantment={isEnchantmentCard(card)}
		{onclick}
	/>
	{#if imgSrc && !loaded}
		<img class="preload" src={imgSrc} alt="" loading="lazy" onload={() => (loaded = true)} />
	{/if}
	<div class="card-over">
		<div class="card-name">{card.name}</div>

		<div class="card-bottom">
			{#if actions}
				<Button id="action-{card.uid}" class="card-btn pointer-events-auto px-1.5! py-1!" size="xs"
					><Icon icon="mdi:chevron-down" class="mx-1!" width="16" />
				</Button>
				<Dropdown
					simple
					size="xs"
					class="pointer-events-auto"
					triggeredBy="#action-{card.uid}"
					placement="right"
					bind:isOpen={actionsOpen}
				>
					<div onclickcapture={() => (actionsOpen = false)}>
						{@render actions()}
					</div>
				</Dropdown>
			{/if}
			{#if card.power || card.powerMarker || card.toughness || card.toughnessMarker}
				<Button
					id="power-{card.uid}"
					class="card-btn pointer-events-auto px-1.5! py-1! text-xs!"
					size="xs">{cardMarkerRepr(card)}</Button
				>
				{#if canChangeMarker}
					<Dropdown
						simple
						size="xs"
						class="pointer-events-auto"
						triggeredBy="#power-{card.uid}"
						placement="right"
						bind:isOpen={markerOpen}
					>
						<div class="marker-form">
							<div class="marker-row">
								<span class="marker-label">Power</span>
								<input
									id="marker-power-{card.uid}"
									type="number"
									class="marker-input"
									bind:value={markerPower}
								/>
							</div>
							<div class="marker-row">
								<span class="marker-label">Toughness</span>
								<input
									id="marker-tough-{card.uid}"
									type="number"
									class="marker-input"
									bind:value={markerToughness}
								/>
							</div>
							<button
								class="marker-apply"
								onclick={(e) => {
									e.stopPropagation();
									G.moves.changeCardMarkerCounter(index, markerPower, markerToughness);
									markerPower = 1;
									markerToughness = 1;
									markerOpen = false;
								}}>Apply</button
							>
						</div>
					</Dropdown>
				{/if}
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
		width: 100%;
		height: min-content;
		position: relative;
		padding: 5px;
	}

	img {
		width: 100%;
		max-width: 14rem;
		transition: transform 0.5s ease-in-out;
		border-radius: 4.75% / 3.5%;
	}

	img.preload {
		position: absolute;
		width: 0;
		height: 0;
		opacity: 0;
		pointer-events: none;
	}

	img.tapped {
		transform: rotate(90deg) scale(0.85);
		opacity: 0.7;
	}

	img.sorcery {
		box-shadow:
			0 0 0 3px #e879f9,
			0 0 10px rgba(232, 121, 249, 0.5);
	}

	img.instant {
		box-shadow:
			0 0 0 3px #60a5fa,
			0 0 10px rgba(96, 165, 250, 0.5);
	}

	img.enchantment {
		box-shadow:
			0 0 0 3px #4ade80,
			0 0 10px rgba(74, 222, 128, 0.5);
	}

	img:hover {
		cursor: pointer;
		box-shadow:
			0 0 0 3px #eee,
			0 0 10px rgba(255, 255, 255, 0.4);
	}

	.card-name {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.75);
		color: white;
		font-size: 0.65rem;
		font-weight: 600;
		padding: 3px 6px;
		text-align: center;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.card-over {
		position: absolute;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	.card-bottom {
		position: absolute;
		bottom: 5px;
		left: 5px;
		right: 5px;
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		pointer-events: none;
	}

	.marker-form {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		padding: 0.5rem;
		min-width: 10rem;
	}

	.marker-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.marker-label {
		font-size: 0.75rem;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.7);
		flex: 1;
	}

	.marker-input {
		width: 4rem;
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 4px;
		color: white;
		padding: 0.2rem 0.4rem;
		font-size: 0.8rem;
		text-align: center;
		outline: none;
	}

	.marker-input:focus {
		border-color: cornflowerblue;
	}

	.marker-apply {
		background: cornflowerblue;
		color: white;
		border: none;
		border-radius: 4px;
		padding: 0.3rem 0.5rem;
		font-size: 0.75rem;
		font-weight: 600;
		cursor: pointer;
		transition: filter 0.2s;
	}

	.marker-apply:hover {
		filter: brightness(1.15);
	}

	:global(.card-btn) {
		background: rgba(0, 0, 0, 0.65) !important;
		backdrop-filter: blur(4px);
		color: rgba(255, 255, 255, 0.9) !important;
		border: 1px solid rgba(255, 255, 255, 0.15) !important;
	}

	:global(.card-btn:hover) {
		background: rgba(0, 0, 0, 0.8) !important;
		color: white !important;
	}
</style>
