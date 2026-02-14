<script>
	import Icon from '@iconify/svelte';
	import cardBack from '$assets/card-back.jpg';
	import hordeBg from '$assets/horde-bg.jpg';
	import { Badge, Button, P, Tooltip } from 'flowbite-svelte';
	import { expoOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	import { game as G } from '../game.svelte';
	import * as SavepointUtils from '../savepoint';
	import AddTokenModal from './AddTokenModal.svelte';
	import AlertToast from './AlertToast.svelte';
	import Battlefield from './Battlefield.svelte';
	import FullscreenToggle from './FullscreenToggle.svelte';
	import GameInfo from './GameInfo.svelte';
	import GraveyardModal from './GraveyardModal.svelte';
	import OffCardDetails from './OffCardDetails.svelte';
	import Score from './Score.svelte';
	import SettingsModal from './SettingsModal.svelte';

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
				{state.G.currentInitialSurvivorTurn + 1 === state.G.nbInitialSurvivorsTurn
					? 'Go !'
					: 'Next'}
			</Button>
		</div>
	</div>
{/if}

<div id="game" class="overflow-hidden h-full" style:background-image="url({hordeBg})">
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
						<img src={cardBack} alt="card bak - horde" />
						<Badge
							large
							id="horde-life-badge"
							class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
							>{state.G.hordeDeck.length}</Badge
						>
						<Tooltip>Horde life</Tooltip>
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
							<img src={cardBack} alt="graveyard zone" onclick={() => graveyardModalRef.show()} />
							<Badge
								large
								id="horde-graveyard-badge"
								class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
								>{state.G.hordeGraveyard.length}</Badge
							>
							<Tooltip>Horde graveyard</Tooltip>
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
		<Icon
			id="add-card"
			onclick={() => addTokenModalRef.show()}
			icon="mdi:plus-circle"
			color="white"
			width="32"
		/>
		<Tooltip>Add token</Tooltip>
	{/if}

	<FullscreenToggle />

	<Icon
		id="settings"
		onclick={() => settingsModalRef.show()}
		icon="mdi:mixer-settings"
		color="white"
		width="32"
	/>
	<Tooltip>Restart game ?</Tooltip>

	<Icon id="save" onclick={onSave} icon="mdi:content-save" color="white" width="32" />
	<Tooltip>Do savepoint</Tooltip>

	<Icon id="restore" onclick={onRestore} icon="mdi:file-restore" color="white" width="32" />
	<Tooltip>Restore savepoint</Tooltip>

	<Icon
		id="info"
		onclick={() => gameInfoRef.show()}
		icon="mdi:information-slab-circle"
		color="white"
		width="32"
	/>
	<Tooltip>Open game info</Tooltip>
</div>

<style>
	#game {
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
