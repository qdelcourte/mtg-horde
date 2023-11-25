<script>
	import { Button, ButtonGroup, Tooltip } from 'flowbite-svelte';
	import { ArrowUturnLeft, ArrowUturnRight } from 'svelte-heros-v2';
	import { getContext } from 'svelte';
	import { key } from '../context';
	import { PHASES, STAGES } from '../gameHelpers';

	let state;
	let client = getContext(key);
	client.subscribe((s) => (state = s));
</script>

<div id="score" class="h-1/6">
	<div id="undo">
		<Button id="btn-undo" on:click={() => client.undo()} color="dark" aria-label="undo"
			><ArrowUturnLeft /></Button
		>
		<Tooltip triggeredBy="#btn-undo" placement="top">Undo</Tooltip>
	</div>
	<div id="horde" class:player-turn={state.ctx.currentPlayer === '0'}>
		<div id="horde-life">
			<span class="name">Horde</span>
			<span class="life">{state.G.hordeLife}</span>
			<div class="change-life">
				<ButtonGroup>
					<Button on:click={() => client.moves.putCardsInHordeGraveyardFromDeck(5)} color="red"
						>-5</Button
					>
					<Button on:click={() => client.moves.putCardsInHordeGraveyardFromDeck(1)} color="red"
						>-1</Button
					>
				</ButtonGroup>
			</div>
		</div>
		<div id="horde-actions" class="actions">
			<ButtonGroup>
				{#if state.ctx.phase === PHASES.fightTheHorde && state.ctx.activePlayers}
					{#if state.ctx.activePlayers[state.ctx.currentPlayer] === STAGES.untap}
						<Button on:click={() => client.moves.stageHordeUntap()} size="sm">Untap all</Button>
					{:else if state.ctx.activePlayers[state.ctx.currentPlayer] === STAGES.draw}
						<Button on:click={() => client.moves.stageHordeDraw()} size="sm">Draw</Button>
					{:else if state.ctx.activePlayers[state.ctx.currentPlayer] === STAGES.upkeek}
						<Button on:click={() => client.moves.stageHordeDeclareAttack()} size="sm"
							>Declare attack</Button
						>
					{:else if state.ctx.activePlayers[state.ctx.currentPlayer] === STAGES.attack}
						<Button on:click={() => client.moves.stageHordeAttackEnd()} size="sm">Attack End</Button
						>
					{/if}
				{/if}
			</ButtonGroup>
		</div>
	</div>
	<div id="survivors" class:player-turn={state.ctx.currentPlayer === '1'}>
		<div id="survivors-life">
			<span class="name">Survivors</span>
			<span class="life">{state.G.survivorsLife}</span>
			<div class="change-life">
				<ButtonGroup>
					<Button on:click={() => client.moves.survivorsChangeLife(-5)} color="red">-5</Button>
					<Button on:click={() => client.moves.survivorsChangeLife(-1)} color="red">-1</Button>
					<Button on:click={() => client.moves.survivorsChangeLife(1)} color="green">+1</Button>
					<Button on:click={() => client.moves.survivorsChangeLife(5)} color="green">+5</Button>
				</ButtonGroup>
			</div>
		</div>
		<div id="survivors-actions" class="actions">
			{#if state.ctx.phase === PHASES.fightTheHorde && state.ctx.currentPlayer == 1}
				<Button on:click={() => client.moves.stageSurvivorsEndTurn()} size="sm">End turn</Button>
			{/if}
		</div>
	</div>
	<div id="redo">
		<Button id="btn-redo" on:click={() => client.redo()} color="dark" aria-label="redo"
			><ArrowUturnRight /></Button
		>
		<Tooltip triggeredBy="#btn-redo">Redo</Tooltip>
	</div>
</div>

<style>
	#score {
		background-color: black;
		color: white;
		clip-path: polygon(20% -80%, 80% -80%, 100% 100%, 0% 100%);
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		height: 100px;
		padding-left: 60px;
		padding-right: 60px;
	}

	#score #horde-life,
	#score #survivors-life {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100px;
		padding: 12px;
	}

	#score .life {
		font-size: 2rem;
	}

	#score .change-life {
		position: absolute;
		bottom: -100px;
	}

	#score .actions {
		display: none;
		position: absolute;
		top: -50px;
	}

	#score #horde-life:hover .change-life,
	#score #survivors-life:hover .change-life {
		bottom: 50px;
	}

	#score .player-turn {
		border: 1px solid cornflowerblue;
		transition: border 0.1s ease-in-out;
	}

	#score .player-turn .actions {
		display: block;
	}
</style>
