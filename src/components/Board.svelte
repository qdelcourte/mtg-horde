<script>
    import { 
        Button, 
        DropdownItem,
        Icon, 
    } from 'sveltestrap';
    import { getContext, onMount, tick } from 'svelte';
	import { fly } from 'svelte/transition';
    import { key } from '../context';

    import Card from './Card.svelte';
    import Score from './Score.svelte'
    import GameInfo from './GameInfo.svelte';
    import OffCardDetails from './OffCardDetails.svelte';
    import GraveyardModal from './GraveyardModal.svelte';
    import AddTokenModal from'./AddTokenModal.svelte';
    import SettingsModal from './SettingsModal.svelte';
    import AlertToast from './AlertToast.svelte';

    import * as Utils from '../utils';

    let gameInfoRef;
    let cardDetailsRef;
    let graveyardModalRef;
    let settingsModalRef;
    let addTokenModalRef;
    let alertToastRef;

    let state;
    let client = getContext(key);
    client.subscribe(s => state = s);

    onMount(async () => {
        await tick();
        settingsModalRef.toggle();
    });

    function onSave() {
        Utils.savepointInLocalStorage(client);
        alertToastRef.alert('Savepoint !');
    }

    function onRestore() {
        Utils.restoreSavepointFromLocalStorage(client);
        alertToastRef.alert('Savepoint restored !');
    }
</script>

<GameInfo bind:this={gameInfoRef}/>
<OffCardDetails bind:this={cardDetailsRef}/>
<GraveyardModal bind:this={graveyardModalRef}/>
<SettingsModal bind:this={settingsModalRef}/>
<AddTokenModal bind:this={addTokenModalRef}/>
<AlertToast bind:this={alertToastRef}/>

<div id="game">
    <div id="bottom-left">
        <div id="info" on:click={() => gameInfoRef.toggle()}>
            <Icon name="info-square-fill"/>
        </div>
    
        <div id="settings" on:click={() => settingsModalRef.toggle()}>
            <Icon name="gear-fill"/>
        </div>

        <div id="save" on:click={onSave}>
            <Icon name="save-fill"/>
        </div>

        <div id="restore" on:click={onRestore}>
            <Icon name="file-arrow-up-fill"/>
        </div>
    </div>
    
    <div id="board">
        <div id="stacks">
            <div id="deck">
                <img src="/assets/card-back.jpg" alt="card back - deck">
            </div>
            {#if state.G.hordeGraveyard.length > 0}
                <div id="graveyard">
                    <img src="/assets/card-back.jpg" alt="graveyard zone" on:click={() => graveyardModalRef.toggle()}>
                </div>
            {/if}
            {#if state.ctx.phase === 'fightTheHorde'}
                <div id="stacks-actions">
                    <Button on:click={() => addTokenModalRef.toggle()}><Icon name="plus-circle"/> Token</Button>
                </div>
            {/if}
        </div>
        <div id="battlefield">
            {#each state.G.hordeBattlefield as card, index}
                <div class="battlefield-card" in:fly="{{ y: 100, duration: 500 }}" out:fly>
                    <Card {card} {index} canChangeMarker={true} on:click={() => cardDetailsRef.show(card)}>
                        <div slot="actions">
                            {#if card.tapped}
                                <DropdownItem on:click={() => client.moves.hordeToggleTapCard(index)}><Icon name="arrow-counterclockwise"/> Untap</DropdownItem>
                            {:else}
                                <DropdownItem on:click={() => client.moves.hordeToggleTapCard(index)}><Icon name="arrow-clockwise"/> Tap</DropdownItem>
                            {/if}
                            <DropdownItem on:click={() => client.moves.putCardInHordeDeckFromBattlefield(index)}><Icon name="x"/> To the top library</DropdownItem>
                            <DropdownItem on:click={() => client.moves.putCardInHordeGraveyardFromBattlefield(index)}><Icon name="x"/> To the graveyard</DropdownItem>
                            <DropdownItem on:click={() => client.moves.putCardInHordeExileFromBattlefield(index)}><Icon name="x"/> To the exile</DropdownItem>
                        </div>
                    </Card>
                </div>
            {/each}
        </div>
    </div>

    {#if state.ctx.phase === 'initialSurvivorsTurns'}
        <div id="survivors-turns" transition:fly="{{ y: 100, duration: 1000 }}">
            <div id="current">Survivors turn {state.G.currentInitialSurvivorTurn+1} / {state.G.nbInitialSurvivorsTurn}</div>
            <div id="next"><Button color='primary' on:click={() => client.moves.nextInitialTurn()}>Next</Button></div>
        </div>
    {/if}

    <div id="footer">
        <Score/>
    </div>
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

    #board #stacks-actions {
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

    .battlefield-card {
        position: relative;
        height: min-content;
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
