<script>
    import { 
        Button, 
        ButtonGroup, 
        Icon, 
        Tooltip 
    } from 'sveltestrap';
    import { getContext } from 'svelte';
    import { key } from '../context';

    let state;
    let client = getContext(key);
    client.subscribe(s => state = s);
</script>

<div id="score">
    <div id="undo">
        <Tooltip target="btn-undo">Undo</Tooltip>
        <Button id="btn-undo" on:click={() => client.undo()} color="dark"><Icon name="arrow-counterclockwise"/></Button>
    </div>
    <div id="horde" class:player-turn={state.ctx.currentPlayer === "0"}>
        <div id="horde-life">
            <span class="name">Horde</span>
            <span class="life">{state.G.hordeLife}</span>
            <div class="change-life">
                <ButtonGroup>
                    <Button on:click={() => client.moves.hordeLosesLife(5)} color="danger">-5</Button>
                    <Button on:click={() => client.moves.hordeLosesLife(1)} color="danger">-1</Button>
                </ButtonGroup>
            </div>
        </div>
        <div id="horde-actions" class="actions">
            <ButtonGroup>
                {#if state.ctx.phase === 'fightTheHorde' && state.ctx.activePlayers}
                    {#if state.ctx.activePlayers[state.ctx.currentPlayer] === 'untap'}
                        <Button on:click={() => client.moves.stageHordeUntap()} color="primary" size="sm">Untap all</Button>
                    {:else if state.ctx.activePlayers[state.ctx.currentPlayer] === 'draw'}
                        <Button on:click={() => client.moves.stageHordeDraw()} color="primary" size="sm">Draw</Button>
                    {:else if state.ctx.activePlayers[state.ctx.currentPlayer] === 'upkeek'}
                        <Button on:click={() => client.moves.stageHordeDeclareAttack()} color="primary" size="sm">Declare attack</Button>
                    {:else if state.ctx.activePlayers[state.ctx.currentPlayer] === 'attack'}
                        <Button on:click={() => client.moves.stageHordeAttackEnd()} color="primary" size="sm">Attack End</Button>
                    {/if}
                {/if}
            </ButtonGroup>
        </div>
    </div>
    <div id="survivors" class:player-turn={state.ctx.currentPlayer === "1"}>
        <div id="survivors-life">
            <span class="name">Survivors</span>
            <span class="life">{state.G.survivorsLife}</span>
            <div class="change-life">
                <ButtonGroup>
                    <Button on:click={() => client.moves.survivorsLoseLife(5)} color="danger">-5</Button>
                    <Button on:click={() => client.moves.survivorsLoseLife(1)} color="danger">-1</Button>
                    <Button on:click={() => client.moves.survivorsGainLife(1)} color="success">+1</Button>
                    <Button on:click={() => client.moves.survivorsGainLife(5)} color="success">+5</Button>
                </ButtonGroup>
            </div>
        </div>
        <div id="survivors-actions" class="actions">
            {#if state.ctx.phase === 'fightTheHorde' && state.ctx.activePlayers}
                {#if state.ctx.activePlayers[state.ctx.currentPlayer] === 'survivorsTurn'}
                    <Button on:click={() => client.moves.stageSurvivorsEndTurn()} color="primary" size="sm">End turn</Button>
                {/if}
            {/if}
        </div>
    </div>
    <div id="redo">
        <Tooltip target="btn-redo">Redo</Tooltip>
        <Button id="btn-redo" on:click={() => client.redo()} color="dark"><Icon name="arrow-clockwise"/></Button>
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

    #score #horde-life, #score #survivors-life {
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

    #score #horde-life:hover .change-life, #score #survivors-life:hover .change-life {
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