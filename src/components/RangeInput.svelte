<script>
	let { id, value = $bindable(), min = 0, max = 100, step = 1 } = $props();
</script>

<input {id} class="flex-1" type="range" bind:value {min} {max} {step} />

<style>
	input {
		accent-color: var(--color-primary-500);
	}

	input::-moz-range-track {
		background: rgba(255, 255, 255, 0.15);
		border-radius: 9999px;
		height: 6px;
		border: none;
	}

	input::-moz-range-progress {
		background: var(--color-primary-500);
		border-radius: 9999px;
		height: 6px;
	}

	input::-moz-range-thumb {
		background: var(--color-primary-500);
		border: none;
		border-radius: 50%;
		width: 16px;
		height: 16px;
		cursor: pointer;
	}
</style>
