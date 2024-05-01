<script>
	import { Badge, Button, P, Tooltip } from 'flowbite-svelte';
	import {
		AdjustmentsHorizontal,
		DocumentArrowDown,
		DocumentArrowUp,
		InformationCircle,
		PlusCircle
	} from 'svelte-heros-v2';
	import { expoOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import * as SavepointUtils from '../savepoint';
	import { game as G } from '../game.svelte';

	import Battlefield from './Battlefield.svelte';
	import Score from './Score.svelte';
	import GameInfo from './GameInfo.svelte';
	import OffCardDetails from './OffCardDetails.svelte';
	import GraveyardModal from './GraveyardModal.svelte';
	import AddTokenModal from './AddTokenModal.svelte';
	import SettingsModal from './SettingsModal.svelte';
	import AlertToast from './AlertToast.svelte';

	let gameInfoRef;
	let cardDetailsRef;
	let graveyardModalRef;
	let settingsModalRef;
	let addTokenModalRef;
	let alertToastRef;

	let state = $derived(G.state);

	$effect(() => {
		if (settingsModalRef && !state.ctx.phase) settingsModalRef.show();
	});

	function onSave() {
		SavepointUtils.savepointInLocalStorage(G.client);
		alertToastRef.alert('Savepoint !');
	}

	function onRestore() {
		SavepointUtils.restoreSavepointFromLocalStorage(G.client);
		alertToastRef.alert('Savepoint restored !');
	}
</script>

<GameInfo bind:this={gameInfoRef} />
<OffCardDetails bind:this={cardDetailsRef} />
<GraveyardModal bind:this={graveyardModalRef} />
<SettingsModal bind:this={settingsModalRef} permanent={!state.ctx.phase} />
<AlertToast bind:this={alertToastRef} />
<AddTokenModal bind:this={addTokenModalRef} />

{#if state.ctx.phase === G.helpers.PHASES.initialSurvivorsTurns}
	<div
		id="survivors-turns"
		class="absolute w-full top-1/2 -translate-y-2/4 bg-black text-white text-center text-5xl font-bold py-4"
		in:fly={{ y: 100, duration: 700 }}
		out:fly={{ easing: expoOut }}
	>
		<div id="current">
			Survivors turn {state.G.currentInitialSurvivorTurn + 1} / {state.G.nbInitialSurvivorsTurn}
		</div>
		<div id="next">
			<Button onclick={() => G.client.moves.nextInitialTurn()}>
				{state.G.currentInitialSurvivorTurn + 1 === state.G.nbInitialSurvivorsTurn ? 'Go !' : 'Next'}
			</Button>
		</div>
	</div>
{/if}

<div id="game" class="overflow-hidden h-full">
	<div id="board" class="grid grid-cols-[max-content_1fr] h-5/6">
		<div id="stacks">
			{#if state.ctx.phase === G.helpers.PHASES.fightTheHorde}
				<div
					id="horde"
					class=" grid grid-cols-[max-content_1fr]"
					in:fly={{ x: -100, duration: 500 }}
				>
					<div class="label">Horde</div>
					<div class="relative">
						<img src="/assets/card-back.jpg" alt="card bak - horde" />
						<Badge
							large
							id="horde-life-badge"
							color="dark"
							class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
							>{state.G.hordeDeck.length}</Badge
						>
						<Tooltip triggeredBy="#horde-life-badge">Horde life</Tooltip>
					</div>
				</div>
				{#if state.G.hordeGraveyard.length > 0}
				<div
					id="graveyard"
					class="grid grid-cols-[max-content_1fr]"
					in:fly={{ x: -100, duration: 500 }}
				>
					<div class="label">Graveyard</div>
					<div class="relative">
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
						<img
							src="/assets/card-back.jpg"
							alt="graveyard zone"
							onclick={() => graveyardModalRef.show()}
						/>
						<Badge
							large
							id="horde-graveyard-badge"
							color="dark"
							class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
							>{state.G.hordeGraveyard.length}</Badge
						>
						<Tooltip triggeredBy="#horde-graveyard-badge">Horde graveyard</Tooltip>
					</div>
				</div>
				{/if}
				<div class="bg-gray-400" in:fly={{ x: -100, duration: 500 }}>
					<P color="text-white">Horde Damage: {G.helpers.computeHordeDamage(state.G)}</P>
				</div>
			{/if}
		</div>
		<div id="battlefield" class="overflow-auto h-full">
			<Battlefield onCardClick={(card) => cardDetailsRef.show(card)} />
		</div>
	</div>
</div>

{#if state.ctx.phase === G.helpers.PHASES.fightTheHorde}
	<div
		id="footer"
		class="fixed bottom-0 left-1/2 w-8/12 -translate-x-1/2"
		transition:fly={{ y: 50, duration: 500 }}
	>
		<Score />
	</div>
{/if}

<div id="options" class="absolute bottom-0 left-2">
	{#if state.ctx.phase === G.helpers.PHASES.fightTheHorde}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div id="add-card" onclick={() => addTokenModalRef.show()}>
			<PlusCircle variation="solid" class="text-white" />
		</div>
		<Tooltip triggeredBy="#add-card">Add token</Tooltip>
	{/if}

	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div id="settings" onclick={() => settingsModalRef.show()}>
		<AdjustmentsHorizontal variation="solid" class="text-white" />
	</div>
	<Tooltip triggeredBy="#settings">Restart game ?</Tooltip>

	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div id="save" onclick={onSave}>
		<DocumentArrowDown variation="solid" class="text-white" />
	</div>
	<Tooltip triggeredBy="#save">Do savepoint</Tooltip>

	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div id="restore" onclick={onRestore}>
		<DocumentArrowUp variation="solid" class="text-white" />
	</div>
	<Tooltip triggeredBy="#restore">Restore savepoint</Tooltip>

	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div id="info" onclick={() => gameInfoRef.show()}>
		<InformationCircle variation="solid" class="text-white" />
	</div>
	<Tooltip triggeredBy="#info">Open game info</Tooltip>
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
		box-shadow:
			0 0 0 4px #eee,
			0 0 0 5px #aaa;
	}
</style>
