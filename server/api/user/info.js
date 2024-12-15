/** @format */

// server/api/login.ts

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();

	try {
		const response = await $fetch(config.app.apiUrl + '/user/_info', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': config.app.apiKey,
				'x-client-id': getCookie(event, 'x-client-id'),
				authorization: getCookie(event, 'authorization')
			}
		});
		// Return the exact response structure received
		return response;
	} catch (e) {
		return e.data;
	}
});
