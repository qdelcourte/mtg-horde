import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
	resolve: {
		alias: {
			$lib: path.resolve(__dirname, './src/lib'),
			decks: path.resolve(__dirname, './decks')
		}
	},
	plugins: [tailwindcss(), svelte()]
});
