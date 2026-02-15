<script>
	import Icon from '@iconify/svelte';

	const { label, icon, onclick, disabled = false, confirm = false } = $props();

	let confirming = $state(false);
	let timeout;

	function handleClick() {
		if (disabled) return;
		if (confirm && !confirming) {
			confirming = true;
			timeout = setTimeout(() => (confirming = false), 2000);
			return;
		}
		clearTimeout(timeout);
		confirming = false;
		onclick?.();
	}
</script>

<button class="toolbar-btn" class:disabled class:confirming onclick={handleClick}>
	<Icon icon={confirming ? 'mdi:help-circle' : icon} color="white" width="18" />
	<span class="toolbar-label">{confirming ? 'Sure ?' : label}</span>
</button>

<style>
	.toolbar-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.35rem 0.5rem;
		border-radius: 8px;
		border: none;
		background: transparent;
		color: white;
		cursor: pointer;
		transition: background 0.2s;
		white-space: nowrap;
	}

	.toolbar-btn:hover:not(.disabled) {
		background: rgba(255, 255, 255, 0.15);
	}

	.toolbar-btn.disabled {
		opacity: 0.35;
		cursor: default;
		pointer-events: none;
	}

	.toolbar-btn.confirming {
		background: rgba(239, 68, 68, 0.25);
	}

	.toolbar-btn.confirming:hover {
		background: rgba(239, 68, 68, 0.4);
	}

	.toolbar-label {
		font-size: 0.75rem;
		font-weight: 500;
	}
</style>
