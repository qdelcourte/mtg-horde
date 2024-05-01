<script>
	import { Alert } from 'flowbite-svelte';

	let open = $state(false);
	let color = $state('green');
	let message = $state('');

	export function alert(_message, _color = 'green') {
		message = _message;
		color = _color;
		open = true;
	}
</script>

{#if open}
	<div id="alert">
		<Alert {color} dismissable>
			{message}
		</Alert>
	</div>
{/if}

<style>
	#alert {
		z-index: 1;
		position: absolute;
		margin-top: 15px;
		left: 50%;
		transform: translateX(-50%);
	}
</style>
