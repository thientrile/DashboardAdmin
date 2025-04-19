/** @format */
import crypto from 'node:crypto';
export default defineEventHandler(async (event) => {
	try {
		const config = useRuntimeConfig();
		const query = getQuery(event);
		const timestamp = new Date().getTime();
		const headers = getHeaders(event);
		const body = await readBody(event);
		const hmacSignature = crypto
			.createHmac('sha256', config.app.secretKey)
			.update(timestamp.toString() + JSON.stringify(query || {}))
			.digest('hex');
		const queryString = new URLSearchParams(query).toString();
		const url = `${config.app.apiUrl}:3057/resource/_all?${queryString}`;
		const response = await $fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': config.app.apiKey,
				 'authorization': headers['authorization'],
        'x-client-id': headers['x-client-id'],
				'x-timestamp': timestamp,
				'x-hmac-signature': hmacSignature
			}
		});
		// Return the exact response structure received
		return response;
	} catch (e) {
		return e.data;
	}
});
