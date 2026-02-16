<script>
	let { count, children } = $props();

	// Scale columns based on card count to keep cards reasonably sized
	// 1-2: match count, 3-4: 3 cols, 5-8: 4, 9-10: 5, 11-14: 6, 15-21: 7, 22+: 8
	const columns = $derived(
		count <= 2
			? count || 1
			: count <= 4
				? 3
				: count <= 8
					? 4
					: count <= 10
						? 5
						: count <= 14
							? 6
							: count <= 21
								? 7
								: 8
	);
</script>

<div class="card-grid" style:--columns={columns}>
	{@render children()}
</div>

<style>
	.card-grid {
		display: grid;
		grid-template-columns: repeat(var(--columns), minmax(0, 14rem));
		justify-content: center;
		align-content: start;
		gap: 2rem;
		padding: 10px;
		box-sizing: border-box;
		height: 100%;
		overflow: auto;
		overflow-x: hidden;
	}
</style>
