<script>
	import Icon from '@iconify/svelte';
	import { DropdownItem } from 'flowbite-svelte';
	import { fly } from 'svelte/transition';

	import { game as G } from '../game';
	import Card from './Card.svelte';
	import CardGrid from './CardGrid.svelte';

	const { onCardClick } = $props();

	let wrath = $state(false);
	let prevCount = G.state.horde.battlefield.length;

	function removeOut(node, { duration = 400 }) {
		return {
			duration,
			css: (t) => {
				const scale = 0.3 + 0.7 * t;
				const y = (1 - t) * 60;
				const rotate = (1 - t) * 15;
				return `transform: scale(${scale}) translateY(${y}px) rotate(${rotate}deg); opacity: ${t};`;
			}
		};
	}

	function wrathOut(node, { duration = 600 }) {
		const angle = Math.random() * 360;
		const dist = 150 + Math.random() * 200;
		const dx = Math.cos(angle) * dist;
		const dy = Math.sin(angle) * dist;
		const spin = (Math.random() - 0.5) * 720;

		return {
			duration,
			css: (t) => {
				const ease = 1 - t;
				return `transform: translate(${dx * ease}px, ${dy * ease}px) rotate(${spin * ease}deg) scale(${t}); opacity: ${t * t};`;
			}
		};
	}

	function cardOut(node, params) {
		return wrath ? wrathOut(node, params) : removeOut(node, params);
	}

	let frozenCount = $state(0);

	$effect.pre(() => {
		const count = G.state.horde.battlefield.length;
		if (count === 0 && prevCount > 1) {
			frozenCount = prevCount;
			wrath = true;
			setTimeout(() => {
				wrath = false;
				frozenCount = 0;
			}, 800);
		}
		prevCount = count;
	});
</script>

<div class="battlefield-wrap" class:wrath>
	{#if wrath}
		<div class="wrath-flash"></div>
	{/if}
	<CardGrid count={frozenCount || G.state.horde.battlefield.length}>
		{#each G.state.horde.battlefield as card, index (card.uid)}
			<div in:fly={{ x: 100, duration: 500 }} out:cardOut>
				<Card {card} {index} canChangeMarker onclick={() => onCardClick(card)}>
					{#snippet actions()}
						{#if card.tapped}
							<DropdownItem onclick={() => G.moves.hordeToggleTapCard(index)}
								><Icon icon="mdi:arrow-u-left-top" class="inline-block" width="16" /> Untap</DropdownItem
							>
						{:else}
							<DropdownItem onclick={() => G.moves.hordeToggleTapCard(index)}
								><Icon icon="mdi:arrow-u-right-top" class="inline-block" width="16" /> Tap</DropdownItem
							>
						{/if}
						<DropdownItem
							class="w-48"
							onclick={() => G.moves.putCardInHordeDeckFromBattlefield(index)}
							><Icon icon="mdi:close" width="16" class="inline-block" /> To the top library</DropdownItem
						>
						<DropdownItem onclick={() => G.moves.putCardInHordeGraveyardFromBattlefield(index)}
							><Icon icon="mdi:close" width="16" class="inline-block" /> To the graveyard</DropdownItem
						>
						<DropdownItem onclick={() => G.moves.putCardInHordeExileFromBattlefield(index)}
							><Icon icon="mdi:close" width="16" class="inline-block" /> To the exile</DropdownItem
						>
					{/snippet}
				</Card>
			</div>
		{/each}
	</CardGrid>
</div>

<style>
	.battlefield-wrap {
		height: 100%;
		position: relative;
		overflow: hidden;
	}

	.battlefield-wrap.wrath {
		animation: shake 0.5s ease-out;
	}

	.wrath-flash {
		position: absolute;
		inset: 0;
		z-index: 10;
		pointer-events: none;
		background: radial-gradient(
			ellipse at center,
			rgba(239, 68, 68, 0.4),
			rgba(255, 200, 50, 0.2),
			transparent 70%
		);
		animation: flash 0.8s ease-out forwards;
	}

	@keyframes flash {
		0% {
			opacity: 0;
		}
		15% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}

	@keyframes shake {
		0%,
		100% {
			transform: translate(0);
		}
		10% {
			transform: translate(-4px, 2px);
		}
		20% {
			transform: translate(4px, -2px);
		}
		30% {
			transform: translate(-3px, -3px);
		}
		40% {
			transform: translate(3px, 3px);
		}
		50% {
			transform: translate(-2px, 1px);
		}
		60% {
			transform: translate(2px, -1px);
		}
		70% {
			transform: translate(-1px, 2px);
		}
		80% {
			transform: translate(1px, -1px);
		}
	}
</style>
