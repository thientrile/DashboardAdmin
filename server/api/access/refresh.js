/** @format */


export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();


	try {
		const response = await $fetch(config.app.apiUrl + '/access/_refresh', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': config.app.apiKey,
				'x-client-id': getCookie(event, 'x-client-id'),
				'x-rtoken-id': getCookie(event, 'x-rtoken-id')
			}
		});

		return response;
	} catch (e) {
		return e.data;
	}
});
