<script>
	let { value, class: className } = $props();

	let pulse = $state(false);
	let prev;

	$effect.pre(() => {
		if (prev !== undefined && value !== prev) {
			pulse = true;
			setTimeout(() => (pulse = false), 400);
		}
		prev = value;
	});
</script>

<span class={[pulse ? 'animate-pulse-once' : '', className]}>{value}</span>

<style>
	@keyframes pulse-once {
		0% {
			transform: scale(1);
			text-shadow: none;
		}
		50% {
			transform: scale(1.3);
			text-shadow: 0 0 12px rgba(255, 255, 255, 0.8);
		}
		100% {
			transform: scale(1);
			text-shadow: none;
		}
	}
	.animate-pulse-once {
		animation: pulse-once 400ms ease-out;
	}
</style>
