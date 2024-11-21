/** @format */



// server/api/login.ts

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();


	try {
		const response = await $fetch(config.app.apiUrl + '/user/refresh', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': config.app.apiKey,
				'x-client-id': getCookie(event, 'c_user'),
				'x-rtoken-id': getCookie(event, 'refreshToken')
			}
		});

		return response;
	} catch (e) {
		return e.data;
	}
});
