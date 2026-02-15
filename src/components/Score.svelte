<script>
	import Icon from '@iconify/svelte';
	import { Button, ButtonGroup, Tooltip } from 'flowbite-svelte';

	import { game as G } from '../game';
	import { PHASES, STAGES } from '../game/phases';
</script>

<div id="score-shadow">
	<div id="score" class="h-1/6">
		<div id="undo">
			<Button id="btn-undo" onclick={() => G.undo()} color="dark" aria-label="undo"
				><Icon icon="mdi:arrow-u-left-top" width="24" /></Button
			>
			<Tooltip placement="top">Undo</Tooltip>
		</div>
		<div id="horde" class:player-turn={G.state.turn.activePlayer === 0}>
			<div id="horde-life">
				<span class="name">Horde</span>
				<span class="life">{G.hordeLife}</span>
				<div class="change-life">
					<ButtonGroup>
						<Button onclick={() => G.moves.putCardsInHordeGraveyardFromDeck(5)} color="red"
							>-5</Button
						>
						<Button onclick={() => G.moves.putCardsInHordeGraveyardFromDeck(1)} color="red"
							>-1</Button
						>
					</ButtonGroup>
				</div>
			</div>
		</div>
		<div class="w-36 text-center">
			<div class="actions" class:player-turn={G.state.turn.activePlayer === 0}>
				{#if G.state.turn.phase === PHASES.fightTheHorde && G.state.turn.stage}
					{#if G.state.turn.stage === STAGES.draw}
						<Button onclick={() => G.moves.stageHordeDraw()} size="sm">Draw</Button>
					{:else if G.state.turn.stage === STAGES.attack}
						<Button onclick={() => G.moves.stageHordeAttackEnd()} size="sm">Attack End</Button>
					{/if}
				{/if}
			</div>

			<div class="actions" class:player-turn={G.state.turn.activePlayer === 1}>
				{#if G.state.turn.phase === PHASES.fightTheHorde && G.state.turn.activePlayer == 1}
					<Button onclick={() => G.moves.stageSurvivorsEndTurn()} size="sm">End turn</Button>
				{/if}
			</div>

			<div class="mt-2">Turn {G.state.turn.current}</div>
		</div>
		<div id="survivors" class:player-turn={G.state.turn.activePlayer === 1}>
			<div id="survivors-life">
				<span class="name">Survivors</span>
				<span class="life">{G.state.survivors.life}</span>
				<div class="change-life">
					<ButtonGroup>
						<Button onclick={() => G.moves.survivorsChangeLife(-5)} color="red">-5</Button>
						<Button onclick={() => G.moves.survivorsChangeLife(-1)} color="red">-1</Button>
						<Button onclick={() => G.moves.survivorsChangeLife(1)} color="green">+1</Button>
						<Button onclick={() => G.moves.survivorsChangeLife(5)} color="green">+5</Button>
					</ButtonGroup>
				</div>
			</div>
		</div>
		<div id="redo">
			<Button id="btn-redo" onclick={() => G.redo()} color="dark" aria-label="redo"
				><Icon icon="mdi:arrow-u-right-top" width="24" /></Button
			>
			<Tooltip>Redo</Tooltip>
		</div>
	</div>
</div>

<style>
	#score-shadow {
		filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 1));
	}

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

		&:hover .change-life {
			bottom: 50px;
		}
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

		&.player-turn {
			display: block;
		}
	}

	#horde,
	#survivors {
		&.player-turn {
			border: 1px solid cornflowerblue;
			transition: border 0.3s ease-in-out;
		}
	}
</style>
