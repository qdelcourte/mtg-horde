<script>
	const { card } = $props();
</script>

<div class="card-details">
	<div class="card-image">
		<img src={card.images.normal} alt={card.name} class="card-rounded" />
	</div>
	<div class="card-info">
		<div class="card-header">
			<span class="card-name">{card.name}</span>
			{#if card.mana_cost}
				<span class="mana-cost">{card.mana_cost}</span>
			{/if}
		</div>
		<div class="card-type">{card.type}</div>
		{#if card.text}
			<hr class="divider" />
			<p class="card-text">{card.text}</p>
		{/if}
		{#if card.power !== undefined && card.power !== null}
			<div class="card-pt">{card.power} / {card.toughness}</div>
		{/if}
	</div>
</div>

<style>
	.card-details {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.card-image img {
		width: 100%;
		display: block;
	}

	.card-info {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 8px;
	}

	.card-name {
		font-size: 0.95rem;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.95);
		line-height: 1.3;
	}

	.mana-cost {
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.5);
		white-space: nowrap;
		flex-shrink: 0;
		font-family: monospace;
	}

	.card-type {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: rgba(255, 255, 255, 0.45);
		font-weight: 500;
	}

	.divider {
		border: none;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		margin: 2px 0;
	}

	.card-text {
		font-size: 1.2rem;
		color: rgba(255, 255, 255, 0.7);
		line-height: 1.5;
		white-space: pre-line;
		margin: 0;
	}

	.card-pt {
		align-self: flex-end;
		font-size: 0.85rem;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.9);
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 6px;
		padding: 2px 8px;
	}
</style>
