import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	resolve: {
		alias: {
			$assets: path.resolve(__dirname, './src/assets'),
			decks: path.resolve(__dirname, './decks')
		}
	},
	plugins: [tailwindcss(), svelte()]
});
