<script>
    export let card;
</script>

<h1>{card.name}</h1>
{#if card.text}
    <p>{card.text}</p>
{/if}
<div><img src={card.images.normal} alt="explain card" height="500px"></div>
