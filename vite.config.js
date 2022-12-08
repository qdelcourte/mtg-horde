import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';


export default defineConfig({
  resolve:{
    alias:{
        'decks' : path.resolve(__dirname, './decks')
    },
  },
  plugins: [
    svelte({
      /* plugin options */
    })
  ]
});