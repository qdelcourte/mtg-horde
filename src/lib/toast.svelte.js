let message = $state(null);
let timer;

export const toast = {
	get message() {
		return message;
	},
	show(msg, duration = 3000) {
		message = msg;
		clearTimeout(timer);
		timer = setTimeout(() => (message = null), duration);
	}
};
