<script>
	import Icon from '@iconify/svelte';

	const { label, icon, onclick, disabled = false, confirm = false } = $props();

	let confirming = $state(false);

	function handleClick() {
		if (confirm && !confirming) {
			confirming = true;
			return;
		}
		confirming = false;
		onclick?.();
	}

	$effect(() => {
		if (!confirming) return;
		const timer = setTimeout(() => (confirming = false), 2000);
		return () => clearTimeout(timer);
	});
</script>

<button
	class={[
		'flex cursor-pointer items-center gap-2 rounded-lg border-none px-2 py-1.5 whitespace-nowrap text-white transition-colors duration-200',
		'disabled:cursor-default disabled:opacity-35',
		confirming ? 'bg-danger/25 hover:bg-danger/40' : 'bg-transparent enabled:hover:bg-white/15'
	]}
	{disabled}
	onclick={handleClick}
>
	<Icon icon={confirming ? 'mdi:help-circle' : icon} color="white" width="18" />
	<span class="text-xs font-medium">{confirming ? 'Sure ?' : label}</span>
</button>
