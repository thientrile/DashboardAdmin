/** @format */

import { defineNuxtConfig } from 'nuxt/config';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-04-03',
	devtools: { enabled: true },
	modules: [
		'@vite-pwa/nuxt',
		'@nuxt/icon', // 'nuxt-storage',
		'@pinia/nuxt',
		'@nuxt/ui'
	],
	runtimeConfig: {
		app: {
			apiUrl: `${process.env.API_SCHEME}://${process.env.API_HOST}:${process.env.API_PORT}`,
			apiKey: process.env.API_KEY,
			secretKey: process.env.SECRET_KEY
		}
	},
	devServer: {
		https: {
			key: './key.pem',
			cert: './cert.pem'
		}
	}
});
