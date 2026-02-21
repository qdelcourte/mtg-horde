<script>
	import { fly } from 'svelte/transition';

	import { toast } from '../lib/toast.svelte.js';
</script>

{#if toast.message}
	<div
		class="pointer-events-none absolute top-4 left-1/2 z-50 -translate-x-1/2"
		in:fly={{ y: -10, duration: 200 }}
		out:fly={{ y: -10, duration: 150 }}
	>
		<div
			class="border-primary-500/50 bg-primary-500/20 rounded-lg border px-4 py-2 text-sm font-medium text-white backdrop-blur-sm"
		>
			{toast.message}
		</div>
	</div>
{/if}
