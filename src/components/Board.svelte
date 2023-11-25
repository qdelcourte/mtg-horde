<script>
	import { Button, InformationCircle } from 'flowbite-svelte';
	import {
		AdjustmentsHorizontal,
		DocumentArrowDown,
		DocumentArrowUp,
		PlusCircle
	} from 'svelte-heros-v2';
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
<SettingsModal bind:this={settingsModalRef} permanent={!state.ctx.phase} />
<AlertToast bind:this={alertToastRef} />
<AddTokenModal bind:this={addTokenModalRef} />

{#if state.ctx.phase === PHASES.initialSurvivorsTurns}
	<div
		id="survivors-turns"
		class="absolute w-full top-1/2 -translate-y-2/4 bg-black text-white text-center text-5xl font-bold py-4"
		transition:fly={{ y: 100, duration: 1000 }}
	>
		<div id="current">
			Survivors turn {state.G.currentInitialSurvivorTurn + 1} / {state.G.nbInitialSurvivorsTurn}
		</div>
		<div id="next">
			<Button on:click={() => client.moves.nextInitialTurn()}>
				{#if state.G.currentInitialSurvivorTurn + 1 === state.G.nbInitialSurvivorsTurn}
					Go !
				{:else}
					Next
				{/if}
			</Button>
		</div>
	</div>
{/if}

<div id="game" class="overflow-hidden h-full">
	<div id="board" class="grid grid-cols-[max-content_1fr] h-5/6">
		<div id="stacks">
			{#if state.ctx.phase === PHASES.fightTheHorde}
				<div id="deck" class="grid grid-cols-[max-content_1fr]" in:fly={{ x: -100, duration: 500 }}>
					<div class="label">Deck</div>
					<img src="/assets/card-back.jpg" alt="card back - deck" />
				</div>
			{/if}
			{#if state.G.hordeGraveyard.length > 0}
				<div
					id="graveyard"
					class="grid grid-cols-[max-content_1fr]"
					in:fly={{ x: -100, duration: 500 }}
				>
					<div class="label">Graveyard</div>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<img
						src="/assets/card-back.jpg"
						alt="graveyard zone"
						on:click={() => graveyardModalRef.toggle()}
					/>
				</div>
			{/if}
		</div>
		<div id="battlefield" class="overflow-auto h-full">
			<Battlefield on:show_card={(event) => cardDetailsRef.show(event.detail.card)} />
		</div>
	</div>
</div>

{#if state.ctx.phase === PHASES.fightTheHorde}
	<div
		id="footer"
		class="fixed bottom-0 left-1/2 w-8/12 -translate-x-1/2"
		transition:fly={{ y: 50, duration: 500 }}
	>
		<Score />
	</div>
{/if}

<div id="options" class="absolute bottom-0 left-2">
	{#if state.ctx.phase === PHASES.fightTheHorde}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div id="add-card" on:click={() => addTokenModalRef.toggle()}>
			<PlusCircle variation="solid" class="text-white" />
		</div>
	{/if}

	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div id="info" on:click={() => gameInfoRef.toggle()}>
		<InformationCircle variation="solid" class="text-white" />
	</div>

	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div id="settings" on:click={() => settingsModalRef.toggle()}>
		<AdjustmentsHorizontal variation="solid" class="text-white" />
	</div>

	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div id="save" on:click={onSave}>
		<DocumentArrowDown variation="solid" class="text-white" />
	</div>

	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div id="restore" on:click={onRestore}>
		<DocumentArrowUp variation="solid" class="text-white" />
	</div>
</div>

<style>
	#game {
		background-image: url('/assets/horde-bg.jpg');
		background-size: cover;
	}

	#board #stacks > div {
		background-color: gray;
		opacity: 0.9;
		transition: border-radius 0.7s ease-in-out;
	}

	#board #stacks > div:last-child {
		border-bottom-right-radius: 10px;
	}

	#board #stacks div.label {
		transform: rotate(180deg);
		writing-mode: vertical-lr;
		text-align: center;
		text-transform: uppercase;
		background-color: dimgray;
		color: white;
		font-size: 1rem;
		letter-spacing: 1px;
	}

	#board img {
		transition-duration: 0.5s;
		height: 10rem;
		margin: 15px;
	}

	#graveyard img:hover {
		cursor: pointer;
		box-shadow: 0 0 0 4px #eee, 0 0 0 5px #aaa;
	}
</style>
