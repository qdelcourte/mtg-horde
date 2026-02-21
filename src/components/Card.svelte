<script>
	import Icon from '@iconify/svelte';
	import cardBack from '$assets/card-back.jpg';
	import { Dropdown } from 'flowbite-svelte';

	import { game as G } from '../game';
	import { isEnchantmentCard, isInstantCard, isSorceryCard } from '../game/helpers';
	import Pulse from './Pulse.svelte';

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

<div class="relative flex h-min w-full items-center justify-center overflow-visible p-1">
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
	<div class="pointer-events-none absolute h-full w-full">
		<div
			class="py absolute top-0 right-0 left-0 overflow-hidden bg-black/75 px-1.5 text-center text-xs font-semibold text-ellipsis whitespace-nowrap text-white text-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
		>
			{card.name}
		</div>

		<div
			class="pointer-events-none absolute right-1 bottom-1 left-1 flex items-end justify-between"
		>
			{#if actions}
				<button id="action-{card.uid}" class="card-btn pointer-events-auto">
					<Icon icon="mdi:chevron-down" width="16" />
				</button>
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
				<button id="power-{card.uid}" class="card-btn pointer-events-auto text-xs">
					<Pulse value={cardMarkerRepr(card)}></Pulse>
				</button>
				{#if canChangeMarker}
					<Dropdown
						simple
						size="xs"
						class="pointer-events-auto"
						triggeredBy="#power-{card.uid}"
						placement="right"
						bind:isOpen={markerOpen}
					>
						<div class="flex min-w-40 flex-col gap-1.5 p-2">
							<div class="flex items-center gap-2">
								<span class="flex-1 text-xs font-medium text-white/70">Power</span>
								<input
									id="marker-power-{card.uid}"
									type="number"
									class="marker-input"
									bind:value={markerPower}
								/>
							</div>
							<div class="flex items-center gap-2">
								<span class="flex-1 text-xs font-medium text-white/70">Toughness</span>
								<input
									id="marker-tough-{card.uid}"
									type="number"
									class="marker-input"
									bind:value={markerToughness}
								/>
							</div>
							<button
								class="bg-primary-500 cursor-pointer rounded border-none px-2 py-1 text-xs font-semibold text-white transition-[filter] duration-200 hover:brightness-[1.15]"
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
			0 0 0 3px var(--color-sorcery),
			0 0 10px color-mix(in srgb, var(--color-sorcery) 50%, transparent);
	}

	img.instant {
		box-shadow:
			0 0 0 3px var(--color-instant),
			0 0 10px color-mix(in srgb, var(--color-instant) 50%, transparent);
	}

	img.enchantment {
		box-shadow:
			0 0 0 3px var(--color-enchantment),
			0 0 10px color-mix(in srgb, var(--color-enchantment) 50%, transparent);
	}

	img:hover {
		cursor: pointer;
		box-shadow:
			0 0 0 3px #eee,
			0 0 10px rgba(255, 255, 255, 0.4);
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
		border-color: var(--color-primary-500);
	}

	.card-btn {
		display: flex;
		align-items: center;
		padding: 0.25rem 0.375rem;
		background: rgba(0, 0, 0, 0.65);
		backdrop-filter: blur(4px);
		color: rgba(255, 255, 255, 0.9);
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 6px;
		cursor: pointer;
		transition: background 0.2s;
	}

	.card-btn:hover {
		background: rgba(0, 0, 0, 0.8);
		color: white;
	}
</style>
