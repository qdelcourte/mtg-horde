import { mount } from 'svelte';
import App from './App.svelte';

const app = new mount(App, { target: document.body });

export default app;
