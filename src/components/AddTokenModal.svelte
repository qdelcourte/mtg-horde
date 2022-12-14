<script>
	import { Button, Offcanvas, Row, Col, Input } from 'sveltestrap';
	import { getContext } from 'svelte';
	import { key } from '../context';

	import zombieTokenCard from 'decks/cards/zombie_token.json';

	export let placement = 'start';

	let open = false;
	export const toggle = () => (open = !open);

	let client = getContext(key);

	let inputPowerValue = zombieTokenCard.power;
	let inputToughness = zombieTokenCard.toughness;
</script>

<Offcanvas isOpen={open} {toggle} {placement}>
	<div><img src={zombieTokenCard.images.normal} alt="zombie token card" height="500px" /></div>
	<Row>
		<Col>
			<label for="power">Power</label>
			<Input
				bind:value={inputPowerValue}
				type="number"
				name="power"
				id="power"
				placeholder="power"
			/>
		</Col>
		<Col>
			<label for="toughness">Toughness</label>
			<Input
				bind:value={inputToughness}
				type="number"
				name="toughness"
				id="toughness"
				placeholder="toughness"
			/>
		</Col>
	</Row>
	<Row>
		<Col>
			<Button
				block
				on:click={() =>
					client.moves.addTokenInHordeBattlefield(zombieTokenCard, inputPowerValue, inputToughness)}
				>Add token</Button
			>
		</Col>
	</Row>
</Offcanvas>

<style>
	img {
		margin-bottom: 15px;
	}
</style>
