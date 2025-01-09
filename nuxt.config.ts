/** @format */

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-12-25',
	devtools: { enabled: true },
	modules: ['@nuxt/ui', '@nuxt/icon', '@pinia/nuxt'],

	css: ['~/assets/css/main.css'],
	runtimeConfig: {
		app: {
			apiUrl: `${process.env.API_SCHEME}://${process.env.API_HOST}:${process.env.API_PORT}`,
			apiKey: process.env.API_KEY,
			secretKey: process.env.SECRET_KEY,
			pageTransition: {
				name: 'fade',
				mode: 'out-in' // default
			},
			layoutTransition: {
				name: 'slide',
				mode: 'out-in' // default
			},
			head: {
				charset: 'utf-8',
				viewport: 'width=device-width, initial-scale=1'
			}
		}
	},
	devServer: {
		https: {
			key: './key.pem',
			cert: './cert.pem'
		}
	}
});
