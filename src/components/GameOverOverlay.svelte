<script>
	import Icon from '@iconify/svelte';

	import { game as G } from '../game';
	import { modals } from '../lib/modals.svelte.js';
	import TurnHistory from './TurnHistory.svelte';

	const gameover = $derived(G.state.turn.gameover);

	const survivorsWin = $derived(gameover?.winner?.includes('Survivors'));
</script>

{#if gameover}
	<div
		class="gameover-overlay absolute inset-0 z-50 flex items-center justify-center"
		class:win={survivorsWin}
		class:lose={!survivorsWin}
	>
		<div class="gameover-flash absolute inset-0"></div>
		<div class="gameover-content flex flex-col items-center gap-4">
			<Icon
				icon={survivorsWin ? 'mdi:trophy' : 'mdi:skull'}
				width="64"
				color={survivorsWin ? 'var(--color-warning)' : 'var(--color-danger)'}
			/>
			<div class="gameover-title text-5xl font-extrabold tracking-[4px] text-white uppercase">
				{survivorsWin ? 'Victory' : 'Defeat'}
			</div>
			<div class="text-base font-medium text-white/60">{gameover.winner}</div>
			<button
				class="bg-primary-500 mt-4 flex cursor-pointer items-center gap-2 rounded-lg border-none px-6 py-2.5 text-base font-semibold text-white transition-[filter] duration-200 hover:brightness-[1.15]"
				onclick={() => modals.settings.open()}
			>
				<Icon icon="mdi:restart" width="20" />
				New Game
			</button>
			<TurnHistory />
		</div>
	</div>
{/if}

<style>
	.gameover-overlay {
		animation: overlayIn 0.8s ease-out forwards;
	}

	.gameover-overlay.win {
		background: radial-gradient(
			ellipse at center,
			color-mix(in srgb, var(--color-warning) 15%, transparent),
			rgba(0, 0, 0, 0.85) 70%
		);
	}

	.gameover-overlay.lose {
		background: radial-gradient(
			ellipse at center,
			color-mix(in srgb, var(--color-danger) 20%, transparent),
			rgba(0, 0, 0, 0.85) 70%
		);
	}

	.gameover-flash {
		animation: gameoverFlash 1s ease-out forwards;
	}

	.gameover-overlay.win .gameover-flash {
		background: radial-gradient(
			ellipse at center,
			color-mix(in srgb, var(--color-warning) 40%, transparent),
			transparent 60%
		);
	}

	.gameover-overlay.lose .gameover-flash {
		background: radial-gradient(
			ellipse at center,
			color-mix(in srgb, var(--color-danger) 40%, transparent),
			transparent 60%
		);
	}

	.gameover-content {
		animation: contentIn 0.6s 0.3s ease-out both;
	}

	.gameover-title {
		text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
	}

	@keyframes overlayIn {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	@keyframes gameoverFlash {
		0% {
			opacity: 0;
		}
		20% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}

	@keyframes contentIn {
		0% {
			opacity: 0;
			transform: scale(0.8) translateY(20px);
		}
		100% {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}
</style>
