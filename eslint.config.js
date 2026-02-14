import js from '@eslint/js';
import { includeIgnoreFile } from '@eslint/compat';
import svelte from 'eslint-plugin-svelte';
import eslintConfigPrettierFlat from 'eslint-config-prettier';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import { fileURLToPath } from 'node:url';
const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...svelte.configs['flat/recommended'],
	eslintConfigPrettierFlat,
	...svelte.configs['flat/prettier'],
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte']
			}
		}
	},
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		rules: {
			'no-undef': 'off'
		}
	}
);
