<script>
	const PALETTES = {
		green: {
			label: 'Forest',
			color: '#22c55e',
			scale: {
				50: '#f0fdf4',
				100: '#dcfce7',
				200: '#bbf7d0',
				300: '#86efac',
				400: '#4ade80',
				500: '#22c55e',
				600: '#16a34a',
				700: '#15803d',
				800: '#166534',
				900: '#14532d',
				950: '#052e16'
			}
		},
		blue: {
			label: 'Island',
			color: '#3b82f6',
			scale: {
				50: '#eff6ff',
				100: '#dbeafe',
				200: '#bfdbfe',
				300: '#93c5fd',
				400: '#60a5fa',
				500: '#3b82f6',
				600: '#2563eb',
				700: '#1d4ed8',
				800: '#1e40af',
				900: '#1e3a8a',
				950: '#172554'
			}
		},
		red: {
			label: 'Mountain',
			color: '#f43f5e',
			scale: {
				50: '#fff1f2',
				100: '#ffe4e6',
				200: '#fecdd3',
				300: '#fda4af',
				400: '#fb7185',
				500: '#f43f5e',
				600: '#e11d48',
				700: '#be123c',
				800: '#9f1239',
				900: '#881337',
				950: '#4c0519'
			}
		},
		purple: {
			label: 'Swamp',
			color: '#a855f7',
			scale: {
				50: '#faf5ff',
				100: '#f3e8ff',
				200: '#e9d5ff',
				300: '#d8b4fe',
				400: '#c084fc',
				500: '#a855f7',
				600: '#9333ea',
				700: '#7e22ce',
				800: '#6b21a8',
				900: '#581c87',
				950: '#3b0764'
			}
		},
		orange: {
			label: 'Plains',
			color: '#f97316',
			scale: {
				50: '#fff7ed',
				100: '#ffedd5',
				200: '#fed7aa',
				300: '#fdba74',
				400: '#fb923c',
				500: '#f97316',
				600: '#ea580c',
				700: '#c2410c',
				800: '#9a3412',
				900: '#7c2d12',
				950: '#431407'
			}
		}
	};

	const STORAGE_KEY = 'mtg-horde-theme';

	let current = $state(localStorage.getItem(STORAGE_KEY) ?? 'green');

	$effect(() => {
		const palette = PALETTES[current];
		if (!palette) return;
		const root = document.documentElement;
		for (const [step, hex] of Object.entries(palette.scale)) {
			root.style.setProperty(`--color-primary-${step}`, hex);
		}
	});

	function select(key) {
		current = key;
		localStorage.setItem(STORAGE_KEY, key);
	}
</script>

<div class="color-picker">
	<span class="label">Theme</span>
	<div class="swatches">
		{#each Object.entries(PALETTES) as [key, palette] (key)}
			<button
				class="swatch"
				class:active={current === key}
				style="--c: {palette.color}"
				title={palette.label}
				onclick={() => select(key)}
				aria-label="Theme {palette.label}"
			></button>
		{/each}
	</div>
</div>

<style>
	.color-picker {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 6px 8px;
	}

	.label {
		font-size: 11px;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: rgba(255, 255, 255, 0.6);
		white-space: nowrap;
	}

	.swatches {
		display: flex;
		gap: 5px;
		flex-wrap: wrap;
	}

	.swatch {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: var(--c);
		border: 2px solid transparent;
		cursor: pointer;
		padding: 0;
		transition:
			transform 0.15s,
			border-color 0.15s;
		flex-shrink: 0;
	}

	.swatch:hover {
		transform: scale(1.2);
	}

	.swatch.active {
		border-color: white;
		transform: scale(1.15);
	}
</style>
