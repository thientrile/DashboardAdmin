/** @format */

import { defineNuxtConfig } from 'nuxt/config';

import fs from 'fs';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-04-03',
	devtools: { enabled: true },
	modules: [
		'@nuxtjs/tailwindcss',
		'@vite-pwa/nuxt',
		'@nuxt/icon',
		'@pinia/nuxt'
	],
	runtimeConfig: {
		app: {
			apiUrl: `${process.env.API_SCHEME}://${process.env.API_HOST}:${process.env.API_PORT}/${process.env.API_VERSION}/${process.env.API_NAME}`,
			apiKey: process.env.API_KEY
		}
	}
	,
	devServer: {
		https: {
			key: './key.pem',
			cert: './cert.pem'
		}
	}
});
