/** @format */

// server/api/login.ts

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();

	try {
		const response = await $fetch(config.app.apiUrl + '/user/logout', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': config.app.apiKey,
				'x-client-id': getCookie(event, 'c_user'),
				'authorization': getCookie(event, 'accessToken')
			}
		});
		// Return the exact response structure received
		return response;
	} catch (e) {
		return e.data;
	}
});
