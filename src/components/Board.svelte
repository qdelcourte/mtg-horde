<script>
	import { Button, Icon } from 'sveltestrap';
	import { getContext, onMount, tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import { key } from '../context';

	import Battlefield from './Battlefield.svelte';
	import Score from './Score.svelte';
	import GameInfo from './GameInfo.svelte';
	import OffCardDetails from './OffCardDetails.svelte';
	import GraveyardModal from './GraveyardModal.svelte';
	import AddTokenModal from './AddTokenModal.svelte';
	import SettingsModal from './SettingsModal.svelte';
	import AlertToast from './AlertToast.svelte';

	import * as SavepointUtils from '../savepoint';
	import { PHASES } from '../gameHelpers';

	let gameInfoRef;
	let cardDetailsRef;
	let graveyardModalRef;
	let settingsModalRef;
	let addTokenModalRef;
	let alertToastRef;

	let state;
	let client = getContext(key);
	client.subscribe((s) => (state = s));

	onMount(async () => {
		await tick();
		if (settingsModalRef && !state.ctx.phase) settingsModalRef.toggle();
	});

	function onSave() {
		SavepointUtils.savepointInLocalStorage(client);
		alertToastRef.alert('Savepoint !');
	}

	function onRestore() {
		SavepointUtils.restoreSavepointFromLocalStorage(client);
		alertToastRef.alert('Savepoint restored !');
	}
</script>

<GameInfo bind:this={gameInfoRef} />
<OffCardDetails bind:this={cardDetailsRef} />
<GraveyardModal bind:this={graveyardModalRef} />
<SettingsModal bind:this={settingsModalRef} />
<AddTokenModal bind:this={addTokenModalRef} />
<AlertToast bind:this={alertToastRef} />

<div id="game">
	<div id="bottom-left">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div id="info" on:click={() => gameInfoRef.toggle()}>
			<Icon name="info-square-fill" />
		</div>

		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div id="settings" on:click={() => settingsModalRef.toggle()}>
			<Icon name="gear-fill" />
		</div>

		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div id="save" on:click={onSave}>
			<Icon name="save-fill" />
		</div>

		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div id="restore" on:click={onRestore}>
			<Icon name="file-arrow-up-fill" />
		</div>
	</div>

	<div id="top">
		{#if state.ctx.phase === PHASES.fightTheHorde}
			<div id="actions">
				<Button on:click={() => addTokenModalRef.toggle()}
					><Icon name="plus-circle" /> Token</Button
				>
			</div>
		{/if}
	</div>

	<div id="board">
		<div id="stacks">
			<div id="deck">
				<img src="/assets/card-back.jpg" alt="card back - deck" />
			</div>
			{#if state.G.hordeGraveyard.length > 0}
				<div id="graveyard">
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<img
						src="/assets/card-back.jpg"
						alt="graveyard zone"
						on:click={() => graveyardModalRef.toggle()}
					/>
				</div>
			{/if}
		</div>
		<div id="battlefield">
			<Battlefield on:show_card={(event) => cardDetailsRef.show(event.detail.card)}/>
		</div>
	</div>

	{#if state.ctx.phase === PHASES.initialSurvivorsTurns}
		<div id="survivors-turns" transition:fly={{ y: 100, duration: 1000 }}>
			<div id="current">
				Survivors turn {state.G.currentInitialSurvivorTurn + 1} / {state.G.nbInitialSurvivorsTurn}
			</div>
			<div id="next">
				<Button color="primary" on:click={() => client.moves.nextInitialTurn()}>Next</Button>
			</div>
		</div>
	{/if}

	{#if state.ctx.phase === PHASES.fightTheHorde}
		<div id="footer" transition:fly={{ y: 50, duration: 1000 }}>
			<Score />
		</div>
	{/if}
</div>

<style>
	#bottom-left {
		position: absolute;
		bottom: 0;
		left: 5px;
	}

	#game {
		background-image: url('/assets/horde-bg.jpg');
		background-size: cover;
		height: 100%;
		overflow: hidden;
		overflow-y: scroll;
	}

	#board {
		display: grid;
		grid-template-columns: 15% 1fr;
		margin-bottom: 160px;
	}

	#top #actions {
		margin: 15px;
	}

	#board #battlefield {
		display: grid;
		grid-template-columns: repeat(auto-fill, 203px);
	}

	#board img {
		transition-duration: 0.5s;
		height: 15rem;
		margin: 15px;
	}

	#graveyard img:hover {
		cursor: pointer;
		box-shadow: 0 0 0 4px #eee, 0 0 0 5px #aaa;
	}

	#survivors-turns {
		position: absolute;
		background-color: black;
		color: white;
		font-weight: bold;
		font-size: 3rem;
		width: 100%;
		text-align: center;
		top: 50%;
		transform: translateY(-50%);
	}

	#footer {
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		position: fixed;
		width: 60%;
	}
</style>
