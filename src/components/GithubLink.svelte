<script>
	import Icon from '@iconify/svelte';
</script>

<a
	href="https://github.com/qdelcourte/mtg-horde"
	target="_blank"
	rel="noreferrer"
	class="github-link"
>
	<Icon icon="mdi:github" color="white" width="20" />
	<span class="github-text">GitHub</span>
</a>

<style>
	.github-link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.4rem 0.5rem;
		border-radius: 8px;
		color: rgba(255, 255, 255, 0.6);
		text-decoration: none;
		font-size: 0.8rem;
		font-weight: 500;
		margin-top: auto;
		transition:
			background 0.2s,
			color 0.2s;
	}

	.github-link:hover {
		background: rgba(255, 255, 255, 0.1);
		color: white;
	}

	.github-link span {
		line-height: normal;
	}
</style>
