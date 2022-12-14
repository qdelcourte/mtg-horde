<script>
	import { Alert } from 'sveltestrap';

	let open = false;
	let color = 'success';
	let message;

	const toggle = () => (open = !open);

	export function alert(_message, _color = 'success') {
		message = _message;
		color = _color;
		open = true;
	}
</script>

{#if open}
	<div id="alert">
		<Alert isOpen={open} {color} {toggle} dismissible>
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
