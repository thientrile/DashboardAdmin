export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig();
		const query = getQuery(event);
		const queryString = new URLSearchParams(query).toString();
		const url = `${config.app.apiUrl}/admin/rbac/roles?${queryString}`;
		const response = await $fetch(url, {
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