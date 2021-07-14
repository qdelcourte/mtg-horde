<script>
  import { Form, FormGroup, Input, Label, Button, Spinner } from 'sveltestrap';
  import { getContext, createEventDispatcher } from 'svelte';
  import { key } from '../context';

  import decks from 'decks';

  let dispatch = createEventDispatcher();

  let client = getContext(key);

  let inputDeckValue;
  let inputNbSurvivorsValue = 1;
  let inputNbInitialSurvivorsTurn = 3;

  async function loadDeckList() {
    const deckList = Object.keys(decks);
    inputDeckValue = deckList[0];
    return deckList;
  }

  function startOrRestartGame() {
    client.reset();
    client.moves.startGame({
      nbSurvivors: inputNbSurvivorsValue,
      deckName: inputDeckValue,
      nbInitialSurvivorsTurn: inputNbInitialSurvivorsTurn
    });
    dispatch('startGame');
  }
</script>

<Form>
  <FormGroup>
    <Label for="deckName">Choose the horde</Label>
    {#await loadDeckList()}
        <Spinner size="sm" />
    {:then decks} 
        <Input type="select" name="deckName" id="deckName" bind:value={inputDeckValue}>
            {#each decks as deckName}
                <option value={deckName}>{deckName}</option>
            {/each}
        </Input>
    {/await}
  </FormGroup>

  <FormGroup>
    <Label for="nbSurvivors">Number of survivors</Label>
    <Input
        bind:value={inputNbSurvivorsValue}
        type="number"
        name="nbSurvivors"
        id="nbSurvivors"
        placeholder="number of survivors"/>
  </FormGroup>
  
  <FormGroup>
    <Label for="numInitialSurvivorsTurn">Number of initial survivors turn</Label>
    <Input
        bind:value={inputNbInitialSurvivorsTurn}
        type="number"
        name="numInitialSurvivorsTurn"
        id="numInitialSurvivorsTurn"
        placeholder="number of initial survivors turn"/>
  </FormGroup>
</Form>

<Button on:click={startOrRestartGame}>Start/Restart Game</Button>