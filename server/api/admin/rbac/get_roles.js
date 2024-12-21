import crypto from 'node:crypto';
export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig();
		const query = getQuery(event);
		const queryString = new URLSearchParams(query).toString();
		const timestamp = new Date().getTime();
		const hmacSignature = crypto
			.createHmac('sha256', config.app.secretKey)
			.update(timestamp.toString() + JSON.stringify({}))
			.digest('hex');
		const url = `${config.app.apiUrl}/admin/rbac/roles?${queryString}`;
		const response = await $fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': config.app.apiKey,
				'x-client-id': getCookie(event, 'x-client-id'),
				authorization: getCookie(event, 'authorization'),
				'x-timestamp': timestamp,
				'x-hmac-signature': hmacSignature,
				
			},
			retry:3,
			retryDelay: 5000,
		});
		// Return the exact response structure received
		return response;
	} catch (e) {

		return e.data;
	}
});