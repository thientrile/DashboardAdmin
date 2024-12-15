/** @format */

export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig();
		const query = getQuery(event);
		const body = await readBody(event);

		const queryString = new URLSearchParams(query).toString();
		const url = `${config.app.apiUrl}/admin/rbac/role/_delete?${queryString}`;
		const response = await $fetch(url, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': config.app.apiKey,
				'x-client-id': getCookie(event, 'x-client-id'),
				authorization: getCookie(event, 'authorization')
			},
			body: JSON.stringify(body)
		});
		// Return the exact response structure received
		return response;
	} catch (e) {
		console.error(e);
		return e.data;
	}
});
